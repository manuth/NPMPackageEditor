import { Dictionary } from "../Collections/Dictionary";
import { ICollection } from "../Collections/ICollection";
import { List } from "../Collections/List";
import { PropertyDictionary } from "../Collections/PropertyDictionary";
import { IDependencyCollection } from "./IDependencyCollection";
import { IDependencyCollectionOptions } from "./IDependencyCollectionOptions";
import { KeyOfType } from "./KeyOfType";

/**
 * Represents a set of dependencies.
 */
export class DependencyCollection implements IDependencyCollection
{
    /**
     * The normal dependencies.
     */
    private readonly dependencies: Dictionary<string, string>;

    /**
     * The dependencies for development purposes.
     */
    private readonly devDependencies: Dictionary<string, string>;

    /**
     * The peer-dependencies.
     */
    private readonly peerDependencies: Dictionary<string, string>;

    /**
     * The optional dependencies.
     */
    private readonly optionalDependencies: Dictionary<string, string>;

    /**
     * The bundled dependencies.
     */
    private readonly bundledDependencies: List<string>;

    /**
     * Initializes a new instance of the {@link DependencyCollection `DependencyCollection`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link DependencyCollection `DependencyCollection`} class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection: IDependencyCollectionOptions);

    /**
     * Initializes a new instance of the {@link DependencyCollection `DependencyCollection`} class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection?: IDependencyCollectionOptions)
    {
        this.dependencies = this.LoadDependencyDictionary(collection?.dependencies);
        this.devDependencies = this.LoadDependencyDictionary(collection?.devDependencies);
        this.peerDependencies = this.LoadDependencyDictionary(collection?.peerDependencies);
        this.optionalDependencies = this.LoadDependencyDictionary(collection?.optionalDependencies);
        this.bundledDependencies = this.LoadDependencyList(collection?.bundledDependencies ?? []);
    }

    /**
     * @inheritdoc
     */
    public get AllDependencies(): Dictionary<string, string>
    {
        let result = new Dictionary<string, string>();
        result.AddRange(this.Dependencies);
        result.AddRange(this.DevelopmentDependencies);
        result.AddRange(this.OptionalDependencies);
        return result;
    }

    /**
     * @inheritdoc
     */
    public get Dependencies(): Dictionary<string, string>
    {
        return this.dependencies;
    }

    /**
     * @inheritdoc
     */
    public get DevelopmentDependencies(): Dictionary<string, string>
    {
        return this.devDependencies;
    }

    /**
     * @inheritdoc
     */
    public get PeerDependencies(): Dictionary<string, string>
    {
        return this.peerDependencies;
    }

    /**
     * @inheritdoc
     */
    public get OptionalDependencies(): Dictionary<string, string>
    {
        return this.optionalDependencies;
    }

    /**
     * @inheritdoc
     */
    public get BundledDependencies(): List<string>
    {
        return this.bundledDependencies;
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
        let keys = [
            nameof(this.Dependencies),
            nameof(this.DevelopmentDependencies),
            nameof(this.PeerDependencies),
            nameof(this.OptionalDependencies)
        ] as Array<KeyOfType<DependencyCollection, Dictionary<string, string>>>;

        for (let key of keys)
        {
            if (overwrite !== null && overwrite !== undefined)
            {
                let collectionToMutate = overwrite ? this : collection;

                for (let dependency of collection[key].Entries)
                {
                    if (this[key].Has(dependency[0]))
                    {
                        collectionToMutate[key].Remove(dependency[0]);
                    }
                }
            }

            this[key].AddRange(collection[key]);
        }

        for (let dependency of collection.BundledDependencies.Values)
        {
            if (!this.BundledDependencies.Values.includes(dependency))
            {
                this.BundledDependencies.Add(dependency);
            }
        }
    }

    /**
     * Clears all dependencies from the collection.
     */
    public Clear(): void
    {
        let sets: Array<ICollection<any, any>> = [
            this.Dependencies,
            this.DevelopmentDependencies,
            this.PeerDependencies,
            this.OptionalDependencies,
            this.BundledDependencies
        ];

        for (let set of sets)
        {
            set.Clear();
        }
    }

    /**
     * Loads a dictionary which contains dependencies and corresponding versions.
     *
     * @param source
     * The object which contains the dependencies to load.
     *
     * @returns
     * The dependency-dictionary.
     */
    protected LoadDependencyDictionary(source: Record<string, string>): Dictionary<string, string>
    {
        return new PropertyDictionary(source);
    }

    /**
     * Loads a list of dependencies.
     *
     * @param source
     * A set of dependencies to load.
     *
     * @returns
     * The newly created dependency-list.
     */
    protected LoadDependencyList(source: string[]): List<string>
    {
        return new List(source);
    }
}
