import { Dictionary } from "../Collections/Dictionary";
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
     *
     * @param collection
     * The collection to register.
     */
    public Register(collection: IDependencyCollection): void
    {
        this.Dependencies.AddRange(collection.Dependencies);
        this.DevelpomentDependencies.AddRange(collection.DevelpomentDependencies);
        this.PeerDependencies.AddRange(collection.PeerDependencies);
        this.OptionalDependencies.AddRange(collection.OptionalDependencies);

        for (let dependency of collection.BundledDependencies.Values)
        {
            if (!this.BundledDependencies.Values.includes(dependency))
            {
                this.BundledDependencies.Add(dependency);
            }
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
