import { AlphabeticalDictionary } from "../Collections/AlphabeticalDictionary";
import { AlphabeticalList } from "../Collections/AlphabeticalList";
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
    public readonly BundledDependencies: AlphabeticalList<string>;

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
        this.Dependencies = new AlphabeticalDictionary(new PropertyDictionary(collection?.dependencies));
        this.DevelpomentDependencies = new AlphabeticalDictionary(new PropertyDictionary(collection?.devDependencies));
        this.PeerDependencies = new AlphabeticalDictionary(new PropertyDictionary(collection?.peerDependencies));
        this.OptionalDependencies = new AlphabeticalDictionary(new PropertyDictionary(collection?.optionalDependencies));
        this.BundledDependencies = new AlphabeticalList(collection?.bundledDependencies ?? []);
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
}
