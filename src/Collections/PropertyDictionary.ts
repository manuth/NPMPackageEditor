import { Dictionary } from "./Dictionary.js";

/**
 * Represents a set of property-keys and their values.
 *
 * @template T
 * The type of the objects containing the properties.
 */
export class PropertyDictionary<T> extends Dictionary<keyof T, T[keyof T]>
{
    /**
     * Initializes a new instance of the {@link PropertyDictionary `PropertyDictionary<T>`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link PropertyDictionary `PropertyDictionary<T>`} class.
     *
     * @param collection
     * The items to load.
     */
    public constructor(collection: T);

    /**
     * Initializes a new instance of the {@link PropertyDictionary `PropertyDictionary<T>`} class.
     *
     * @param collection
     * The items to load.
     */
    public constructor(collection?: T)
    {
        super(
            collection ?
                (Object.keys(collection ?? {}) as Array<keyof T>).map<[keyof T, T[keyof T]]>(
                    (key) =>
                    {
                        return [key, collection[key]];
                    }) :
                []);
    }
}
