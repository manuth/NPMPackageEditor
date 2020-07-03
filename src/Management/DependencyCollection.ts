import { Dictionary } from "../Collections/Dictionary";
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
    public readonly BundledDependencies: string[];

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
        this.Dependencies = new PropertyDictionary(collection?.dependencies);
        this.DevelpomentDependencies = new PropertyDictionary(collection?.devDependencies);
        this.PeerDependencies = new PropertyDictionary(collection?.peerDependencies);
        this.OptionalDependencies = new PropertyDictionary(collection?.optionalDependencies);
        this.BundledDependencies = [...(collection?.bundledDependencies ?? [])];
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

        for (let dependency of collection.BundledDependencies)
        {
            if (!this.BundledDependencies.includes(dependency))
            {
                this.BundledDependencies.push(dependency);
            }
        }
    }
}
