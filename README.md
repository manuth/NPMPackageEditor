# NPMPackageEditor
Provides types and tools for editing `package.json` files

## Installing NPMPackageEditor
`NPMPackageEditor` can be installed using the `npm`-cli:
```bash
npm install --save @manuth/package-json-editor
```

## Using NPMPackageEditor
### General
`NPMPackageEditor` provides useful tools for creating, editing and analyzing `package.json`-files.

### Usage
#### Type-Checking for `package.json` Metadata
Using a code-editor with typescript support provides autocompletion for `package.json`-metadata.

```ts
import { writeFileSync } from "fs";
import { IPackageMetadata, Package } from "@manuth/package-json-editor";

let packageMeta: IPackageMetadata;
packageMeta = {
    name: "example",
    version: "1.0.0"
};

writeFileSync(Package.FileName, JSON.stringify(packageMeta));
```


#### Creating a Package-Object
You can create a `Package` object by passing a path to a `package.json` file or by passing the `package.json`-metadata as an object or nothing to create an empty package:

```ts
import { join } from "node:path";
import { cwd } from "node:process";
import { Package } from "@manuth/package-json-editor";

let packagePath = join(cwd(), Package.FileName);

// Option 1: Passing nothing
let package = new Package();

// Option 2: Passing the filename
let package = new Package(packagePath); // Loads the metadata from the specified file

// Option 3: Passing the metadata
let package = new Package( // Loads the metadata from the specified object
    {
        name: "example",
        version: "0.0.0",
        author: "John Doe",
        maintainers: [
            {
                name: "John Doe",
                email: "john.doe@example.com"
            },
            "Jane Doe <jane.doe@example.com>"
        ]
    });

// Option 4: Passing the filename and the metadata
let package = new Package(packagePath, { name: "example" }); // Loads the metadata from the specified object
```

#### Normalizing Meta-Data
Using the `Package.Normalize` method, some properties of the package are set automatically.
  * If `bin` is a string, it is set to an object with a property named like the package's `name` and its value set to the original string.
  * If `man` is a string, it is set to an array containing said string.

If the `FileName` property of the package is set, following properties will be normalized in addition:
  * If undefined, `description` is automatically loaded from the `README` file
  * If the package is located inside a `GitHub` repository, `bugs` and `homepage` are automatically set if they're undefined
  * If the package is located inside a `git` repository, the `repository` property is set accordingly, if undefined

```ts
import { join } from "node:path";
import { Package } from "@manuth/package-json-editor";

let packagePath = join("path", "to", "package", Package.FileName);

let package = new Package(packagePath);
await package.Normalize();
// or
let package = new Package({});
package.FileName = packagePath;
await package.Normalize();
// or
let package = new Package({});
await package.Normalize();
```

#### Editing Meta-Data
The `Package`-class allows you to easily edit the metadata by providing useful abstractions for bug-info, persons (such as `author`, `contributors` etc.) and dependencies.

##### Editing Persons
That way you can always be sure there's an `Author` property to edit even if no `author` is specified in the source package.

```ts
import { Package } from "@manuth/package-json-editor";

let package = new Package(
    {
        name: "example"
    });

package.Author.Name = "John Doe";
package.Author.EMail = "john.doe@example.com";
```

##### Editing Dependencies
Handling dependencies is the key feature of this package.  
Dependencies are represented by a class that allows you to easily add, remove, set and manage dependencies.  
The dependencies of the `Package` class are ordered alphabetically out of the box.

```ts
import { Package } from "@manuth/package-json-editor";

let package = new Package(
    {
        name: "example",
        dependencies: {
            eslint: "*",
            tslint: "*"
        }
    });

package.Dependencies.Set("eslint", "^7.0.0");
package.Dependencies.Remove("tslint");
package.Dependencies.Add("@typescript-eslint/eslint-plugin", "*");
package.Dependencies.Add("@typescript-eslint/parser", "*");
```

The `DependencyCollection` class allows you to easily create dependency-sets for certain purposes and adding them to a `Package` object or even another `DependencyCollection`.

```ts
import { writeFileSync } from "fs";
import { Package, DependencyCollection } from "@manuth/package-json-editor";

let package = new Package(
    {
        name: "example",
        devDependencies: {
            typescript: "*",
            "@types/node": "*"
        }
    });

let eslintDependencies = new DependencyCollection(
    {
        devDependencies: {
            eslint: "*",
            "@typescript-eslint/eslint-plugin": "*",
            "@typescript-eslint/parser": "*"
        }
    });

let tslintDependencies = new DependencyCollection(
    {
        devDependencies: {
            tslint: "*"
        }
    });

export function installLinter(eslint: boolean)
{
    package.Register(eslint ? eslintDependencies : tslintDependencies);
    writeFileSync("package.json", JSON.stringify(package.ToJSON()));
}
```

This is especially useful when creating proper `package.json` files in [Yeoman]-generators.

<!--- References -->
[Yeoman]: https://yeoman.io/
