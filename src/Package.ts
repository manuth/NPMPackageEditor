import { readFileSync } from "fs";
import { Dictionary } from "./Dictionary";
import { IPackageJSON } from "./IPackageJSON";
import { BugInfo } from "./Management/BugInfo";
import { IBinCollection } from "./Management/IBinCollection";
import { IDirectoryStructure } from "./Management/IDirectoryStructure";
import { IRepository } from "./Management/IRepository";
import { IShimCollection } from "./Management/IShimCollection";
import { Person } from "./Management/Person";
import { JSONObject } from "./Utilities/JSONObject";

/**
 * Represents a package.
 */
export class Package
{
    /**
     * Gets or sets the name of the package.
     */
    public Name: string;

    /**
     * Gets or sets the version of the package.
     */
    public Version: string;

    /**
     * Gets or sets a value indicating whether the package is private.
     */
    public Private: boolean;

    /**
     * Gets or sets the descrption of the package.
     */
    public Description: string;

    /**
     * Gets or sets the author of the package.
     */
    public Author: Person;

    /**
     * Gets the maintainers of the package.
     */
    public readonly Maintainers: Person[];

    /**
     * Gets the contributors of the package.
     */
    public readonly Contributors: Person[];

    /**
     * Gets or sets the license of the package.
     */
    public License: string;

    /**
     * Gets the keywords of the package.
     */
    public Keywords: string[];

    /**
     * Gets or sets a set of engines which are required for running the package.
     */
    public readonly Engines: Dictionary<string, string>;

    /**
     * Gets or sets the operating-systems supported by this package.
     */
    public OS: string[];

    /**
     * Gets or sets the CPU architectures supported by this package.
     */
    public CPU: string[];

    /**
     * Gets or sets the primary entry point of the program.
     */
    public Main: string;

    /**
     * Gets or sets the path to the bundlet declaration file.
     */
    public Types: string;

    /**
     * Gets or sets a hint to javascript bundlers for packaging modules for client side use.
     */
    public Browser: string | IShimCollection;

    /**
     * Gets or sets a set of executables to add to `PATH`.
     */
    public Binaries: string | IBinCollection;

    /**
     * Gets or sets filenames to put in place for the `man` program to find.
     */
    public Manuals: string | string[];

    /**
     * Gets the files to include into the package.
     */
    public Files: string[];

    /**
     * Gets or sets the directory-structure of the package.
     */
    public Directories: IDirectoryStructure;

    /**
     * Gets or sets the homepage.
     */
    public Homepage: string;

    /**
     * Gets or sets the repository of the package.
     */
    public Repository: string | IRepository;

    /**
     * Gets links for reporting bugs.
     */
    public readonly Bugs: BugInfo;

    /**
     * Gets or sets a set of persistent configurations.
     */
    public Config: Record<string, any>;

    /**
     * Gets or sets the npm configuration to use while publishing.
     */
    public PublishConfig: Record<string, any>;

    /**
     * Gets or sets a set of script-commands for the package.
     */
    public readonly Scripts: Dictionary<string, string>;

    /**
     * Gets or sets a set of dependencies of the package.
     */
    public readonly Dependencies: Dictionary<string, string>;

    /**
     * Gets or sets a set of development-dependencies of the package.
     */
    public readonly DevelpomentDependencies: Dictionary<string, string>;

    /**
     * Gets or sets a set of peer-dependencies of the package.
     */
    public readonly PeerDependencies: Dictionary<string, string>;

    /**
     * Gets or sets a set of optional dependencies of the package.
     */
    public readonly OptionalDependencies: Dictionary<string, string>;

    /**
     * Gets or sets a set of dependencies to include into `.tgz`-packages.
     */
    public BundledDependencies: string[];

    /**
     * Initializes a new instance of the `Package` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `Package` class based on an existing `package.json`-file.
     *
     * @param path
     * The path to the `package.json`-file to load.
     */
    public constructor(path: string);

    /**
     * Initializes a new instance of the `Package` class.
     *
     * @param packageJSON
     * The options of the package-manifest.
     */
    public constructor(packageJSON: IPackageJSON);

    /**
     * Initializes a new instance of the `Package` class.
     *
     * @param args
     * The passed arguments.
     */
    public constructor(...args: [] | [string] | [IPackageJSON])
    {
        let packageJSON: IPackageJSON;

        switch (typeof args[0])
        {
            case "undefined":
                packageJSON = {};
                break;
            case "string":
                packageJSON = JSON.parse(readFileSync(args[0]).toString());
                break;
            default:
                packageJSON = args[0];
                break;
        }

        this.Name = packageJSON.name ?? null;
        this.Version = packageJSON.version ?? null;
        this.Private = this.LoadObject(packageJSON.private);
        this.Description = packageJSON.description ?? null;
        this.Author = new Person(packageJSON.author);
        this.Maintainers = (packageJSON.maintainers ?? []).map((person) => new Person(person));
        this.Contributors = (packageJSON.contributors ?? []).map((person) => new Person(person));
        this.License = this.LoadObject(packageJSON.license);
        this.Keywords = this.LoadObject(packageJSON.keywords ?? []);
        this.Engines = this.LoadDictionary(packageJSON.engines ?? {});
        this.OS = this.LoadObject(packageJSON.os);
        this.CPU = this.LoadObject(packageJSON.cpu);
        this.Main = packageJSON.main ?? null;
        this.Types = packageJSON.types ?? null;
        this.Browser = this.LoadObject(packageJSON.browser ?? {});
        this.Binaries = this.LoadObject(packageJSON.bin ?? {});
        this.Manuals = this.LoadObject(packageJSON.man ?? []);
        this.Files = this.LoadObject(packageJSON.files);
        this.Directories = this.LoadObject(packageJSON.directories ?? {});
        this.Homepage = packageJSON.homepage ?? null;
        this.Repository = this.LoadObject(packageJSON.repository ?? {});
        this.Bugs = new BugInfo(packageJSON.bugs);
        this.Config = this.LoadObject(packageJSON.config ?? {});
        this.PublishConfig = this.LoadObject(packageJSON.publishConfig ?? {});
        this.Scripts = this.LoadDictionary(packageJSON.scripts ?? {});
        this.Dependencies = this.LoadDictionary(packageJSON.dependencies ?? {});
        this.DevelpomentDependencies = this.LoadDictionary(packageJSON.devDependencies ?? {});
        this.PeerDependencies = this.LoadDictionary(packageJSON.peerDependencies ?? {});
        this.OptionalDependencies = this.LoadDictionary(packageJSON.optionalDependencies ?? {});
        this.BundledDependencies = packageJSON.bundledDependencies ?? [];
    }

    /**
     * Gets a json-object representing this package.
     *
     * @returns
     * A json-object representing this package.
     */
    public ToJSON(): IPackageJSON
    {
        let result = new JSONObject<IPackageJSON>();
        result.AddIfNotNull("name", this.Name);
        result.AddIfNotNull("version", this.Version);
        result.AddIfNotNull("private", this.Private);
        result.AddIfNotNull("description", this.Description);
        result.AddIfNotNull("author", this.Author.ToJSON());
        result.AddIfNotEmpty("maintainers", this.Maintainers.map(maintainer => maintainer.ToJSON()));
        result.AddIfNotEmpty("contributors", this.Contributors.map(contributor => contributor.ToJSON()));
        result.AddIfNotNull("license", this.License);
        result.AddIfNotEmpty("keywords", this.Keywords);
        result.AddIfNotEmpty("engines", this.Engines.ToJSON());
        result.AddIfNotNull("os", this.OS);
        result.AddIfNotNull("cpu", this.CPU);
        result.AddIfNotNull("main", this.Main);
        result.AddIfNotNull("types", this.Types);
        result.AddIfNotEmpty("browser", this.Browser);
        result.AddIfNotNull("bin", this.Binaries);
        result.AddIfNotNull("man", this.Manuals);
        result.AddIfNotNull("files", this.Files);
        result.AddIfNotEmpty("directories", this.Directories);
        result.AddIfNotNull("homepage", this.Homepage);
        result.AddIfNotNull("repository", this.Repository);
        result.AddIfNotNull("bugs", this.Bugs.ToJSON());
        result.AddIfNotEmpty("config", this.Config);
        result.AddIfNotEmpty("publishConfig", this.PublishConfig);
        result.Add("scripts", this.Scripts.ToJSON());
        result.Add("dependencies", this.Dependencies.ToJSON());
        result.Add("devDependencies", this.DevelpomentDependencies.ToJSON());
        result.AddIfNotEmpty("peerDependencies", this.PeerDependencies.ToJSON());
        result.AddIfNotEmpty("optionalDependencies", this.OptionalDependencies.ToJSON());
        result.AddIfNotEmpty("bundledDependencies", this.BundledDependencies);
        return result.ToJSON();
    }

    /**
     * Loads an object.
     *
     * @param object
     * The object to load.
     *
     * @returns
     * The loaded object.
     */
    private LoadObject(object: any): any
    {
        return object ? (typeof object === "object" ? (Array.isArray(object) ? [...object] : { ...object }) : object) : null;
    }

    /**
     * Loads a dictionary from an object.
     *
     * @param collection
     * The collection to load.
     *
     * @returns
     * The loaded dictionary.
     */
    private LoadDictionary<TValue>(collection: Record<string, TValue>): Dictionary<string, TValue>
    {
        return new Dictionary(Object.keys(collection).map<[string, TValue]>((key) => [key, collection[key]]));
    }
}
