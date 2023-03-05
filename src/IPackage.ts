import { Dictionary } from "./Collections/Dictionary.js";
import { BugInfo } from "./Management/BugInfo.js";
import { DependencyCollection } from "./Management/DependencyCollection.js";
import { IBinCollection } from "./Management/IBinCollection.js";
import { IDependencyCollection } from "./Management/IDependencyCollection.js";
import { IDirectoryStructure } from "./Management/IDirectoryStructure.js";
import { IRepository } from "./Management/IRepository.js";
import { IShimCollection } from "./Management/IShimCollection.js";
import { Person } from "./Management/Person.js";
import { PackageType } from "./PackageType.js";
import { ResolveMatrix } from "./ResolveMatrix.js";

/**
 * Represents a package.
 */
export interface IPackage extends IDependencyCollection
{

    /**
     * Gets or sets the name of the package.
     */
    Name: string;

    /**
     * Gets or sets the version of the package.
     */
    Version: string;

    /**
     * Gets or sets the type of the package.
     */
    Type?: PackageType;

    /**
     * Gets or sets a value indicating whether the package is private.
     */
    Private: boolean;

    /**
     * Gets or sets the description of the package.
     */
    Description: string;

    /**
     * Gets or sets the author of the package.
     */
    Author: Person;

    /**
     * Gets or sets the maintainers of the package.
     */
    Maintainers: Person[];

    /**
     * Gets or sets the contributors of the package.
     */
    Contributors: Person[];

    /**
     * Gets or sets the license of the package.
     */
    License: string;

    /**
     * Gets or sets the keywords of the package.
     */
    Keywords: string[];

    /**
     * Gets or sets a set of engines which are required for running the package.
     */
    Engines: Dictionary<string, string>;

    /**
     * Gets or sets the operating-systems supported by this package.
     */
    OS: string[];

    /**
     * Gets or sets the CPU architectures supported by this package.
     */
    CPU: string[];

    /**
     * Gets or sets the entry points of the package.
     */
    Exports: string | string[] | ResolveMatrix;

    /**
     * Gets or sets the subpath imports of the package.
     */
    Imports: ResolveMatrix;

    /**
     * Gets or sets the primary entry point of the program.
     */
    Main: string;

    /**
     * Gets or sets the path to the bundled declaration file.
     */
    Types: string;

    /**
     * Gets or sets a hint to javascript bundlers for packaging modules for client side use.
     */
    Browser: string | IShimCollection;

    /**
     * Gets or sets a set of executables to add to `PATH`.
     */
    Binaries: string | IBinCollection;

    /**
     * Gets or sets filenames to put in place for the `man` program to find.
     */
    Manuals: string | string[];

    /**
     * Gets or sets the files to include into the package.
     */
    Files: string[];

    /**
     * Gets or sets the directory-structure of the package.
     */
    Directories: IDirectoryStructure;

    /**
     * Gets or sets the homepage.
     */
    Homepage: string;

    /**
     * Gets or sets the repository of the package.
     */
    Repository: string | IRepository;

    /**
     * Gets or sets links for reporting bugs.
     */
    Bugs: BugInfo;

    /**
     * Gets or sets a set of persistent configurations.
     */
    Config: Record<string, any>;

    /**
     * Gets or sets the npm configuration to use while publishing.
     */
    PublishConfig: Record<string, any>;

    /**
     * Gets or sets a set of script-commands for the package.
     */
    Scripts: Dictionary<string, string>;

    /**
     * Gets or sets the dependencies of the package.
     */
    DependencyCollection: DependencyCollection;

    /**
     * Gets or sets a set of additional properties.
     */
    AdditionalProperties: Dictionary<string, unknown>;
}
