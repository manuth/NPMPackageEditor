import { AlphabeticalDictionary } from "../Collections/AlphabeticalDictionary.js";
import { AlphabeticalList } from "../Collections/AlphabeticalList.js";
import { Dictionary } from "../Collections/Dictionary.js";
import { List } from "../Collections/List.js";
import { DependencyCollection } from "./DependencyCollection.js";
import { IDependencyCollectionOptions } from "./IDependencyCollectionOptions.js";

/**
 * Represents a set of dependencies which are ordered alphabetically.
 */
export class OrderedDependencyCollection extends DependencyCollection
{
    /**
     * Initializes a new instance of the {@link OrderedDependencyCollection `OrderedDependencyCollection`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link OrderedDependencyCollection `OrderedDependencyCollection`} class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection: IDependencyCollectionOptions);

    /**
     * Initializes a new instance of the {@link OrderedDependencyCollection `OrderedDependencyCollection`} class.
     *
     * @param collection
     * The base collection.
     */
    public constructor(collection?: IDependencyCollectionOptions)
    {
        super(collection ?? {});
    }

    /**
     * @inheritdoc
     *
     * @param source
     * The object which contains the dependencies to load.
     *
     * @returns
     * The dependency-dictionary.
     */
    protected override LoadDependencyDictionary(source: Record<string, string>): Dictionary<string, string>
    {
        return new AlphabeticalDictionary(super.LoadDependencyDictionary(source));
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
    protected override LoadDependencyList(source: string[]): List<string>
    {
        return new AlphabeticalList(source);
    }
}
