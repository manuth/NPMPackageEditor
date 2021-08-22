/**
 * Represents a JSON-object.
 *
 * @template T
 * The type of the corresponding json-object.
 */
export abstract class JSONObjectBase<T>
{
    /**
     * Initializes a new instance of the {@link JSONObjectBase `JSONObjectBase`} class.
     */
    public constructor()
    { }

    /**
     * Gets a JSON-object representing this object.
     *
     * @returns
     * A JSON-object representing this object.
     */
    public abstract ToJSON(): T;
}
