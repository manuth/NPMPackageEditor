import { Dictionary } from "./Dictionary";

/**
 * Represents a set of key-value pairs.
 */
export class PropertyDictionary<T> extends Dictionary<keyof T, T[keyof T]>
{
    /**
     * Initializes a new instance of the `PropertyDictionary` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `PropertyDictionary` class.
     *
     * @param collection
     * The items to load.
     */
    public constructor(collection: T);

    /**
     * Initializes a new instance of the `PropertyDictionary` class.
     *
     * @param collection
     * The items to load.
     */
    public constructor(collection?: T)
    {
        super((Object.keys(collection) as Array<keyof T>).map<[keyof T, T[keyof T]]>((key) => [key, collection[key]]));
    }
}
