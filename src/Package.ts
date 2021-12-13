import { readFileSync } from "fs";
import { pathExists, readFile } from "fs-extra";
import gitRemoteOriginUrl = require("git-remote-origin-url");
import gitRootDir = require("git-root-dir");
import githubUrlFromGit = require("github-url-from-git");
import normalize = require("normalize-package-data");
import readmeFilename = require("readme-filename");
import { fileName, PackageJSONFileName } from "types-pkg-json";
import { dirname, join, relative, resolve } from "upath";
import { Dictionary } from "./Collections/Dictionary";
import { List } from "./Collections/List";
import { PropertyDictionary } from "./Collections/PropertyDictionary";
import { DumpLogic } from "./DumpLogic";
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
     * Gets the default file-name of `package.json`-files.
     */
    public static readonly FileName: PackageJSONFileName = fileName;

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
     * Gets or sets the description of the package.
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
     * Gets or sets the path to the bundled declaration file.
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
     * Gets or sets a set of script-commands for the package.
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
            [nameof<IPackageMetadata>((meta) => meta.maintainers), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.contributors), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.keywords), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.engines), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.browser), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.bin), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.man), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.directories), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.config), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.publishConfig), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.scripts), GenerationLogic.Always],
            [nameof<IPackageMetadata>((meta) => meta.dependencies), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.devDependencies), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.peerDependencies), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.optionalDependencies), GenerationLogic.NonEmpty],
            [nameof<IPackageMetadata>((meta) => meta.bundledDependencies), GenerationLogic.NonEmpty]
        ] as Array<[keyof IPackageMetadata, GenerationLogic]>);

    /**
     * Initializes a new instance of the {@link Package `Package`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link Package `Package`} class based on an existing `package.json`-file.
     *
     * @param path
     * The path to the `package.json`-file to load.
     */
    public constructor(path: string);

    /**
     * Initializes a new instance of the {@link Package `Package`} class.
     *
     * @param metadata
     * The metadata of the package.
     */
    public constructor(metadata: IPackageMetadata | IPackageJSON);

    /**
     * Initializes a new instance of the {@link Package `Package`}.
     *
     * @param path
     * The path to the `package.json` file.
     *
     * @param metadata
     * The metadata of the package.
     */
    public constructor(path: string, metadata: IPackageMetadata | IPackageJSON);

    /**
     * Initializes a new instance of the {@link Package `Package`} class.
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
    public get DevelopmentDependencies(): Dictionary<string, string>
    {
        return this.DependencyCollection.DevelopmentDependencies;
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
            });
    }

    /**
     * Gets the mapping from the {@link IPackageMetadata `IPackageMetadata`}-properties to the {@link Package `Package`} properties.
     */
    protected get PropertyMap(): Map<keyof IPackageMetadata, keyof Package>
    {
        return new Map<keyof IPackageMetadata, keyof Package>(
            [
                [nameof<IPackageMetadata>((meta) => meta.name), nameof<Package>((pkg) => pkg.Name)],
                [nameof<IPackageMetadata>((meta) => meta.version), nameof<Package>((pkg) => pkg.Version)],
                [nameof<IPackageMetadata>((meta) => meta.private), nameof<Package>((pkg) => pkg.Private)],
                [nameof<IPackageMetadata>((meta) => meta.description), nameof<Package>((pkg) => pkg.Description)],
                [nameof<IPackageMetadata>((meta) => meta.author), nameof<Package>((pkg) => pkg.Author)],
                [nameof<IPackageMetadata>((meta) => meta.maintainers), nameof<Package>((pkg) => pkg.Maintainers)],
                [nameof<IPackageMetadata>((meta) => meta.contributors), nameof<Package>((pkg) => pkg.Contributors)],
                [nameof<IPackageMetadata>((meta) => meta.license), nameof<Package>((pkg) => pkg.License)],
                [nameof<IPackageMetadata>((meta) => meta.keywords), nameof<Package>((pkg) => pkg.Keywords)],
                [nameof<IPackageMetadata>((meta) => meta.engines), nameof<Package>((pkg) => pkg.Engines)],
                [nameof<IPackageMetadata>((meta) => meta.os), nameof<Package>((pkg) => pkg.OS)],
                [nameof<IPackageMetadata>((meta) => meta.cpu), nameof<Package>((pkg) => pkg.CPU)],
                [nameof<IPackageMetadata>((meta) => meta.main), nameof<Package>((pkg) => pkg.Main)],
                [nameof<IPackageMetadata>((meta) => meta.types), nameof<Package>((pkg) => pkg.Types)],
                [nameof<IPackageMetadata>((meta) => meta.browser), nameof<Package>((pkg) => pkg.Browser)],
                [nameof<IPackageMetadata>((meta) => meta.bin), nameof<Package>((pkg) => pkg.Binaries)],
                [nameof<IPackageMetadata>((meta) => meta.man), nameof<Package>((pkg) => pkg.Manuals)],
                [nameof<IPackageMetadata>((meta) => meta.files), nameof<Package>((pkg) => pkg.Files)],
                [nameof<IPackageMetadata>((meta) => meta.directories), nameof<Package>((pkg) => pkg.Directories)],
                [nameof<IPackageMetadata>((meta) => meta.homepage), nameof<Package>((pkg) => pkg.Homepage)],
                [nameof<IPackageMetadata>((meta) => meta.repository), nameof<Package>((pkg) => pkg.Repository)],
                [nameof<IPackageMetadata>((meta) => meta.bugs), nameof<Package>((pkg) => pkg.Bugs)],
                [nameof<IPackageMetadata>((meta) => meta.config), nameof<Package>((pkg) => pkg.Config)],
                [nameof<IPackageMetadata>((meta) => meta.publishConfig), nameof<Package>((pkg) => pkg.PublishConfig)],
                [nameof<IPackageMetadata>((meta) => meta.scripts), nameof<Package>((pkg) => pkg.Scripts)],
                [nameof<IPackageMetadata>((meta) => meta.dependencies), nameof<Package>((pkg) => pkg.Dependencies)],
                [nameof<IPackageMetadata>((meta) => meta.devDependencies), nameof<Package>((pkg) => pkg.DevelopmentDependencies)],
                [nameof<IPackageMetadata>((meta) => meta.peerDependencies), nameof<Package>((pkg) => pkg.PeerDependencies)],
                [nameof<IPackageMetadata>((meta) => meta.optionalDependencies), nameof<Package>((pkg) => pkg.OptionalDependencies)],
                [nameof<IPackageMetadata>((meta) => meta.bundledDependencies), nameof<Package>((pkg) => pkg.BundledDependencies)]
            ] as Array<[keyof IPackageMetadata, keyof Package]>);
    }

    /**
     * Gets the dump-logic for the properties.
     */
    protected get DumpLogics(): Map<keyof Package, DumpLogic>
    {
        return new Map<keyof Package, DumpLogic>(
            [
                ...[
                    nameof<Package>((pkg) => pkg.Author),
                    nameof<Package>((pkg) => pkg.Engines),
                    nameof<Package>((pkg) => pkg.Bugs),
                    nameof<Package>((pkg) => pkg.Scripts),
                    nameof<Package>((pkg) => pkg.Dependencies),
                    nameof<Package>((pkg) => pkg.DevelopmentDependencies),
                    nameof<Package>((pkg) => pkg.PeerDependencies),
                    nameof<Package>((pkg) => pkg.OptionalDependencies),
                    nameof<Package>((pkg) => pkg.BundledDependencies)
                ].map(
                    (key) => [key, DumpLogic.JSONObject] as [keyof Package, DumpLogic]),
                ...[
                    nameof<Package>((pkg) => pkg.Maintainers),
                    nameof<Package>((pkg) => pkg.Contributors)
                ].map(
                    (key) => [key, DumpLogic.JSONObjectArray] as [keyof Package, DumpLogic])
            ]);
    }

    /**
     * Gets the load-logic for the properties.
     */
    protected get LoadLogics(): Map<keyof IPackageMetadata, LoadLogic>
    {
        return new Map<keyof IPackageMetadata, LoadLogic>(
            [
                [nameof<IPackageMetadata>((meta) => meta.author), LoadLogic.Person],
                [nameof<IPackageMetadata>((meta) => meta.maintainers), LoadLogic.PersonList],
                [nameof<IPackageMetadata>((meta) => meta.contributors), LoadLogic.PersonList],
                [nameof<IPackageMetadata>((meta) => meta.engines), LoadLogic.Dictionary],
                [nameof<IPackageMetadata>((meta) => meta.bugs), LoadLogic.BugInfo],
                [nameof<IPackageMetadata>((meta) => meta.scripts), LoadLogic.Dictionary],
                [nameof<IPackageMetadata>((meta) => meta.dependencies), LoadLogic.None],
                [nameof<IPackageMetadata>((meta) => meta.devDependencies), LoadLogic.None],
                [nameof<IPackageMetadata>((meta) => meta.peerDependencies), LoadLogic.None],
                [nameof<IPackageMetadata>((meta) => meta.optionalDependencies), LoadLogic.None],
                [nameof<IPackageMetadata>((meta) => meta.bundledDependencies), LoadLogic.None]
            ] as Array<[keyof IPackageMetadata, LoadLogic]>);
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
                        remote = githubUrlFromGit(await gitRemoteOriginUrl(gitRoot));
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
            let generationLogic = GenerationLogic.Default;
            let dumpLogic = DumpLogic.Default;

            if (this.DumpLogics.has(entry[1]))
            {
                dumpLogic = this.DumpLogics.get(entry[1]);
            }

            switch (dumpLogic)
            {
                case DumpLogic.JSONObject:
                    value = (value as JSONObject).ToJSON();
                    break;
                case DumpLogic.JSONObjectArray:
                    value = (value as JSONObject[]).map((obj) => obj.ToJSON());
                    break;
                default:
                    break;
            }

            if (this.GenerationLogics.has(entry[0]))
            {
                generationLogic = this.GenerationLogics.get(entry[0]);
            }

            switch (generationLogic)
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
     * @template T
     * The type of the collection to load.
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
