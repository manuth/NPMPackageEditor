import { Dictionary } from "../Collections/Dictionary";
import { ICollection } from "../Collections/ICollection";
import { List } from "../Collections/List";
import { PropertyDictionary } from "../Collections/PropertyDictionary";
import { IDependencyCollection } from "./IDependencyCollection";
import { IDependencyCollectionOptions } from "./IDependencyCollectionOptions";

/**
 * Represents a set of dependencies.
 */
export class DependencyCollection implements IDependencyCollection
{
    /**
     * @inheritdoc
     */
    public readonly Dependencies: Dictionary<string, string>;

    /**
     * @inheritdoc
     */
    public readonly DevelpomentDependencies: Dictionary<string, string>;

    /**
     * @inheritdoc
     */
    public readonly PeerDependencies: Dictionary<string, string>;

    /**
     * @inheritdoc
     */
    public readonly OptionalDependencies: Dictionary<string, string>;

    /**
     * @inheritdoc
     */
    public readonly BundledDependencies: List<string>;

    /**
     * Initializes a new instance of the `DependencyCollection` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `DependencyCollection` class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection: IDependencyCollectionOptions);

    /**
     * Initializes a new instance of the `DependencyCollection` class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection?: IDependencyCollectionOptions)
    {
        this.Dependencies = this.LoadDependencyDictionary(collection?.dependencies);
        this.DevelpomentDependencies = this.LoadDependencyDictionary(collection?.devDependencies);
        this.PeerDependencies = this.LoadDependencyDictionary(collection?.peerDependencies);
        this.OptionalDependencies = this.LoadDependencyDictionary(collection?.optionalDependencies);
        this.BundledDependencies = this.LoadDependencyList(collection?.bundledDependencies ?? []);
    }

    /**
     * @inheritdoc
     */
    public get AllDependencies(): Dictionary<string, string>
    {
        let result = new Dictionary<string, string>();
        result.AddRange(this.Dependencies);
        result.AddRange(this.DevelpomentDependencies);
        result.AddRange(this.OptionalDependencies);
        return result;
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
        let keys: Array<
            keyof Pick<
                DependencyCollection,
                "Dependencies" |
                "DevelpomentDependencies" |
                "PeerDependencies" |
                "OptionalDependencies">>;

        keys = [
            "Dependencies",
            "DevelpomentDependencies",
            "PeerDependencies",
            "OptionalDependencies"
        ];

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
            this.DevelpomentDependencies,
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
