import { readFileSync } from "fs";
import { pathExists, readFile } from "fs-extra";
import gitRemoteOriginUrl = require("git-remote-origin-url");
import gitRootDir = require("git-root-dir");
import normalize = require("normalize-package-data");
import readmeFilename = require("readme-filename");
import { dirname, join, relative, resolve } from "upath";
import { Dictionary } from "./Collections/Dictionary";
import { List } from "./Collections/List";
import { PropertyDictionary } from "./Collections/PropertyDictionary";
import { GenerationLogic } from "./GenerationLogic";
import { IPackageJSON } from "./IPackageJSON";
import { IPackageMetadata } from "./IPackageMetadata";
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
     * Gets or sets name of the package-file.
     */
    public FileName: string;

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
     * Gets or sets the maintainers of the package.
     */
    public Maintainers: Person[];

    /**
     * Gets or sets the contributors of the package.
     */
    public Contributors: Person[];

    /**
     * Gets or sets the license of the package.
     */
    public License: string;

    /**
     * Gets or sets the keywords of the package.
     */
    public Keywords: string[];

    /**
     * Gets or sets a set of engines which are required for running the package.
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
     * Gets or sets the files to include into the package.
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
     * Gets or sets links for reporting bugs.
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
     * Gets or sets of script-commands for the package.
     */
    public Scripts: Dictionary<string, string>;

    /**
     * Gets or sets the dependencies of the package.
     */
    public DependencyCollection: DependencyCollection;

    /**
     * Gets or sets a set of additional properties.
     */
    public AdditionalProperties: Dictionary<string, unknown>;

    /**
     * The generation-logic for the properties.
     */
    private generationLogics: Map<keyof IPackageMetadata, GenerationLogic> = new Map<keyof IPackageMetadata, GenerationLogic>(
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
     * @param metadata
     * The metadata of the package.
     */
    public constructor(metadata: IPackageMetadata | IPackageJSON);

    /**
     * Initializes a new instance of the `Package`.
     *
     * @param path
     * The path to the `package.json` file.
     *
     * @param metadata
     * The metadata of the package.
     */
    public constructor(path: string, metadata: IPackageMetadata | IPackageJSON);

    /**
     * Initializes a new instance of the `Package` class.
     *
     * @param args
     * The passed arguments.
     */
    public constructor(...args: [] | [string] | [IPackageJSON] | [string, IPackageJSON])
    {
        super();
        let path: string = null;
        let metadata: IPackageJSON;

        if (args.length === 2)
        {
            path = args[0];
            metadata = args[1];
        }
        else
        {
            switch (typeof args[0])
            {
                case "string":
                    path = args[0];
                    metadata = JSON.parse(readFileSync(args[0]).toString());
                    break;
                default:
                    metadata = args[0];
                    break;
            }
        }

        this.FileName = path;
        this.LoadMetadata(metadata ?? {});
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
     * @inheritdoc
     */
    public get AllDependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.AllDependencies;
    }

    /**
     * Gets the default values for the options.
     */
    protected get Defaults(): Dictionary<keyof IPackageMetadata, any>
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
            } as IPackageMetadata);
    }

    /**
     * Gets the mapping from the `IPackageMetadata`-properties to the `Package` properties.
     */
    protected get PropertyMap(): Map<keyof IPackageMetadata, keyof Package>
    {
        return new Map<keyof IPackageMetadata, keyof Package>(
            [
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
            ]);
    }

    /**
     * Gets the load-logic for the properties.
     */
    protected get LoadLogics(): Map<keyof IPackageMetadata, LoadLogic>
    {
        return new Map<keyof IPackageMetadata, LoadLogic>(
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
    public get GenerationLogics(): Map<keyof IPackageMetadata, GenerationLogic>
    {
        return this.generationLogics;
    }

    /**
     * @inheritdoc
     *
     * @param collection
     * The collection to register.
     *
     * @param overwrite
     * A value indicating whether existing dependencies should be overwritten.
     */
    public Register(collection: IDependencyCollection, overwrite?: boolean): void
    {
        this.DependencyCollection.Register(collection, overwrite);
    }

    /**
     * Normalizes the package-metadata.
     */
    public async Normalize(): Promise<void>
    {
        let directory: string = null;
        let metadata: IPackageJSON = { ...this.ToJSON() };

        if (this.FileName)
        {
            let packageRoot = dirname(resolve(this.FileName));

            if (await pathExists(packageRoot))
            {
                let gitRoot = await gitRootDir(packageRoot);
                let readmeFile = await readmeFilename(packageRoot);

                if (gitRoot)
                {
                    let remote: string;

                    try
                    {
                        remote = await gitRemoteOriginUrl(gitRoot);
                    }
                    catch
                    {
                        remote = null;
                    }

                    metadata.repository = remote;

                    if (resolve(gitRoot) !== resolve(packageRoot))
                    {
                        directory = relative(gitRoot, packageRoot);
                    }
                }

                if (readmeFile)
                {
                    metadata.readme = (await readFile(join(packageRoot, readmeFile))).toString();
                }
            }
        }

        normalize(metadata);

        let newMetadata: IPackageJSON = {
            ...this.ToJSON(),
            description: metadata.description,
            bin: metadata.bin,
            man: metadata.man,
            repository: metadata.repository,
            bugs: metadata.bugs,
            homepage: metadata.homepage
        };

        if (directory !== null)
        {
            if (
                newMetadata.repository &&
                typeof newMetadata.repository !== "string")
            {
                newMetadata.repository.directory = directory;
            }
        }

        this.LoadMetadata(newMetadata);
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

        for (let entry of this.PropertyMap.entries())
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

        for (let property of this.AdditionalProperties.Entries)
        {
            result.Add(property[0], property[1]);
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

        let additionalProperties: Record<string, unknown> = {};
        let metaDictionary = new PropertyDictionary(metadata);
        this.DependencyCollection = this.LoadDependencyCollection(metadata);

        for (let entry of metaDictionary.Entries)
        {
            let key = entry[0] as keyof IPackageMetadata;
            let value: any = metaDictionary.Get(entry[0]);

            if (this.PropertyMap.has(key))
            {
                let logic = this.LoadLogics.get(key);

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
                            [this.PropertyMap.get(key)]: value
                        });
                }
            }
            else
            {
                Object.assign(
                    additionalProperties,
                    {
                        [entry[0]]: entry[1]
                    });
            }
        }

        this.AdditionalProperties = this.LoadDictionary(additionalProperties);
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
        return (object !== null && object !== undefined) ?
            (typeof object === "object" ? (Array.isArray(object) ? [...object] : { ...object }) : object) :
            null;
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
