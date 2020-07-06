import { readFileSync } from "fs";
import { isNullOrUndefined } from "util";
import gitRemoteOriginUrl = require("git-remote-origin-url");
import gitRootDir = require("git-root-dir");
import normalize = require("normalize-package-data");
import Path = require("upath");
import { Dictionary } from "./Collections/Dictionary";
import { List } from "./Collections/List";
import { PropertyDictionary } from "./Collections/PropertyDictionary";
import { GenerationLogic } from "./GenerationLogic";
import { IPackageJSON } from "./IPackageJSON";
import { LoadLogic } from "./LoadLogic";
import { BugInfo } from "./Management/BugInfo";
import { DependencyCollection } from "./Management/DependencyCollection";
import { IBinCollection } from "./Management/IBinCollection";
import { IDependencyCollection } from "./Management/IDependencyCollection";
import { IDependencyCollectionOptions } from "./Management/IDependencyCollectionOptions";
import { IDirectoryStructure } from "./Management/IDirectoryStructure";
import { IPerson } from "./Management/IPerson";
import { IRepository } from "./Management/IRepository";
import { IShimCollection } from "./Management/IShimCollection";
import { OrderedDependencyCollection } from "./Management/OrderedDependencyCollection";
import { Person } from "./Management/Person";
import { JSONObject } from "./Utilities/JSONObject";
import { JSONObjectBase } from "./Utilities/JSONObjectBase";

/**
 * Represents a package.
 */
export class Package extends JSONObjectBase<IPackageJSON> implements IDependencyCollection
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
    public Maintainers: Person[];

    /**
     * Gets the contributors of the package.
     */
    public Contributors: Person[];

    /**
     * Gets or sets the license of the package.
     */
    public License: string;

    /**
     * Gets the keywords of the package.
     */
    public Keywords: string[];

    /**
     * Gets a set of engines which are required for running the package.
     */
    public Engines: Dictionary<string, string>;

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
    public Bugs: BugInfo;

    /**
     * Gets or sets a set of persistent configurations.
     */
    public Config: Record<string, any>;

    /**
     * Gets or sets the npm configuration to use while publishing.
     */
    public PublishConfig: Record<string, any>;

    /**
     * Gets of script-commands for the package.
     */
    public Scripts: Dictionary<string, string>;

    /**
     * Gets the dependencies of the package.
     */
    public DependencyCollection: DependencyCollection;

    /**
     * The generation-logic for the properties.
     */
    private generationLogics: Map<keyof IPackageJSON, GenerationLogic> = new Map<keyof IPackageJSON, GenerationLogic>(
        [
            ["maintainers", GenerationLogic.NonEmpty],
            ["contributors", GenerationLogic.NonEmpty],
            ["keywords", GenerationLogic.NonEmpty],
            ["engines", GenerationLogic.NonEmpty],
            ["browser", GenerationLogic.NonEmpty],
            ["bin", GenerationLogic.NonEmpty],
            ["man", GenerationLogic.NonEmpty],
            ["directories", GenerationLogic.NonEmpty],
            ["config", GenerationLogic.NonEmpty],
            ["publishConfig", GenerationLogic.NonEmpty],
            ["scripts", GenerationLogic.Always],
            ["dependencies", GenerationLogic.Always],
            ["devDependencies", GenerationLogic.Always],
            ["peerDependencies", GenerationLogic.NonEmpty],
            ["optionalDependencies", GenerationLogic.NonEmpty],
            ["bundledDependencies", GenerationLogic.NonEmpty]
        ]);

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
        super();
        let packageJSON: IPackageJSON;

        switch (typeof args[0])
        {
            case "string":
                packageJSON = JSON.parse(readFileSync(args[0]).toString());
                break;
            default:
                packageJSON = args[0] ?? {};
                break;
        }

        this.LoadMetadata(packageJSON);
    }

    /**
     * @inheritdoc
     */
    public get Dependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.Dependencies;
    }

    /**
     * @inheritdoc
     */
    public get DevelpomentDependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.DevelpomentDependencies;
    }

    /**
     * @inheritdoc
     */
    public get PeerDependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.PeerDependencies;
    }

    /**
     * @inheritdoc
     */
    public get OptionalDependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.OptionalDependencies;
    }

    /**
     * @inheritdoc
     */
    public get BundledDependencies(): List<string>
    {
        return this.DependencyCollection.BundledDependencies;
    }

    /**
     * Gets the default values for the options.
     */
    protected get Defaults(): Dictionary<keyof IPackageJSON, any>
    {
        return this.LoadDictionary(
            {
                author: { name: null },
                maintainers: [],
                contributors: [],
                keywords: [],
                engines: {},
                browser: {},
                bin: {},
                man: [],
                directories: {},
                repository: null,
                config: {},
                publishConfig: {},
                scripts: {},
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                optionalDependencies: {},
                bundledDependencies: []
            } as IPackageJSON);
    }

    /**
     * Gets the mapping from the `IPackageJSON`-properties to the `Package` properties.
     */
    protected get PropertyMap(): Array<[keyof IPackageJSON, keyof Package]>
    {
        return [
            ["name", "Name"],
            ["version", "Version"],
            ["private", "Private"],
            ["description", "Description"],
            ["author", "Author"],
            ["maintainers", "Maintainers"],
            ["contributors", "Contributors"],
            ["license", "License"],
            ["keywords", "Keywords"],
            ["engines", "Engines"],
            ["os", "OS"],
            ["cpu", "CPU"],
            ["main", "Main"],
            ["types", "Types"],
            ["browser", "Browser"],
            ["bin", "Binaries"],
            ["man", "Manuals"],
            ["files", "Files"],
            ["directories", "Directories"],
            ["homepage", "Homepage"],
            ["repository", "Repository"],
            ["bugs", "Bugs"],
            ["config", "Config"],
            ["publishConfig", "PublishConfig"],
            ["scripts", "Scripts"],
            ["dependencies", "Dependencies"],
            ["devDependencies", "DevelpomentDependencies"],
            ["peerDependencies", "PeerDependencies"],
            ["optionalDependencies", "OptionalDependencies"],
            ["bundledDependencies", "BundledDependencies"]
        ];
    }

    /**
     * Gets the load-logic for the properties.
     */
    protected get LoadLogics(): Map<keyof IPackageJSON, LoadLogic>
    {
        return new Map<keyof IPackageJSON, LoadLogic>(
            [
                ["author", LoadLogic.Person],
                ["maintainers", LoadLogic.PersonList],
                ["contributors", LoadLogic.PersonList],
                ["engines", LoadLogic.Dictionary],
                ["bugs", LoadLogic.BugInfo],
                ["scripts", LoadLogic.Dictionary],
                ["dependencies", LoadLogic.None],
                ["devDependencies", LoadLogic.None],
                ["peerDependencies", LoadLogic.None],
                ["optionalDependencies", LoadLogic.None],
                ["bundledDependencies", LoadLogic.None]
            ]);
    }

    /**
     * Gets the generation-logic for the properties.
     */
    public get GenerationLogics(): Map<keyof IPackageJSON, GenerationLogic>
    {
        return this.generationLogics;
    }

    /**
     * @inheritdoc
     *
     * @param collection
     * The collection to register.
     */
    public Register(collection: IDependencyCollection): void
    {
        this.DependencyCollection.Register(collection);
    }

    /**
     * Normalizes the package-metadata.
     *
     * @param root
     * The root of the project.
     */
    public async Normalize(root?: string): Promise<void>
    {
        let directory: string = null;
        let packageData: IPackageJSON = { ...this.ToJSON() };

        if (!isNullOrUndefined(root))
        {
            let remote: string;

            try
            {
                remote = await gitRemoteOriginUrl(root);
            }
            catch
            {
                remote = null;
            }

            packageData.repository = remote;

            if (Path.resolve(await gitRootDir(root)) !== Path.resolve(root))
            {
                directory = Path.relative(await gitRootDir(root), root);
            }
        }

        normalize(packageData);

        packageData = {
            ...this.ToJSON(),
            bin: packageData.bin,
            man: packageData.man,
            repository: packageData.repository,
            bugs: packageData.bugs,
            homepage: packageData.homepage
        };

        if (directory !== null)
        {
            if (
                !isNullOrUndefined(packageData.repository) &&
                typeof packageData.repository !== "string")
            {
                packageData.repository.directory = directory;
            }
        }

        this.LoadMetadata(packageData);
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

        for (let entry of this.PropertyMap)
        {
            let value = this[entry[1]];
            let logic = GenerationLogic.Default;

            if (value instanceof JSONObjectBase)
            {
                value = value.ToJSON();
            }

            if (this.GenerationLogics.has(entry[0]))
            {
                logic = this.GenerationLogics.get(entry[0]);
            }

            switch (logic)
            {
                case GenerationLogic.NonEmpty:
                    result.AddIfNotEmpty(entry[0], value);
                    break;
                case GenerationLogic.Always:
                    result.Add(entry[0], value);
                    break;
                case GenerationLogic.NonNull:
                default:
                    result.AddIfNotNull(entry[0], value);
                    break;
            }
        }

        return result.ToJSON();
    }

    /**
     * Loads package-metadata.
     *
     * @param metadata
     * The matadata to load.
     */
    protected LoadMetadata(metadata: IPackageJSON): void
    {
        for (let entry of this.PropertyMap)
        {
            let value: any = metadata[entry[0]];

            if (this.Defaults.Has(entry[0]))
            {
                value = value ?? this.Defaults.Get(entry[0]);
            }

            Object.assign(
                metadata,
                {
                    [entry[0]]: value
                });
        }

        this.DependencyCollection = this.LoadDependencyCollection(metadata);

        for (let entry of this.PropertyMap)
        {
            let value: any = metadata[entry[0]];
            let logic = this.LoadLogics.get(entry[0]);

            if (logic !== LoadLogic.None)
            {
                switch (logic)
                {
                    case LoadLogic.Dictionary:
                        value = this.LoadDictionary(value);
                        break;
                    case LoadLogic.Person:
                        value = this.LoadPerson(value);
                        break;
                    case LoadLogic.PersonList:
                        value = this.LoadPersonList(value);
                        break;
                    case LoadLogic.BugInfo:
                        value = new BugInfo(value);
                        break;
                    case LoadLogic.Plain:
                    default:
                        value = this.LoadObject(value);
                        break;
                }

                Object.assign(
                    this,
                    {
                        [entry[1]]: value
                    });
            }
        }
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
    protected LoadObject(object: any): any
    {
        return !isNullOrUndefined(object) ? (typeof object === "object" ? (Array.isArray(object) ? [...object] : { ...object }) : object) : null;
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
    protected LoadDictionary<T>(collection: T): Dictionary<keyof T, T[keyof T]>
    {
        return new PropertyDictionary(collection);
    }

    /**
     * Loads a dependency-collection.
     *
     * @param collection
     * The dependency-collection to load.
     *
     * @returns
     * The newly created dependency-collection.
     */
    protected LoadDependencyCollection(collection: IDependencyCollectionOptions): DependencyCollection
    {
        return new OrderedDependencyCollection(collection);
    }

    /**
     * Loads a person from an object.
     *
     * @param person
     * The person to load.
     *
     * @returns
     * The loaded person.
     */
    protected LoadPerson(person: IPerson | string): Person
    {
        return new Person(person);
    }

    /**
     * Loads a set of persons from an object.
     *
     * @param personList
     * The person-list to load.
     *
     * @returns
     * The loaded list.
     */
    protected LoadPersonList(personList: Array<IPerson | string>): Person[]
    {
        return personList.map((person) => this.LoadPerson(person));
    }
}
