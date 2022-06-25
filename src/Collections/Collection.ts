import { JSONObjectBase } from "../Utilities/JSONObjectBase.js";
import { ICollection } from "./ICollection.js";

/**
 * Provides the functionality to store collections of items.
 *
 * @template TKey
 * The type of the keys of the collection.
 *
 * @template TValue
 * The type of the values of the collection.
 */
export abstract class Collection<TKey, TValue> extends JSONObjectBase<any> implements ICollection<TKey, TValue>
{
    /**
     * Initializes a new instance of the {@link Collection `Collection<TKey, TValue>`} class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     */
    public get Count(): number
    {
        return this.Entries.length;
    }

    /**
     * @inheritdoc
     */
    public abstract get Entries(): Array<[TKey, TValue]>;

    /**
     * @inheritdoc
     */
    public get Keys(): TKey[]
    {
        return this.Entries.map((entry) => entry[0]);
    }

    /**
     * @inheritdoc
     */
    public get Values(): TValue[]
    {
        return this.Entries.map((entry) => entry[1]);
    }

    /**
     * @inheritdoc
     */
    public abstract Clear(): void;

    /**
     * Returns an object representing this collection.
     *
     * @returns
     * An object representing this collection.
     */
    public abstract override ToJSON(): any;
}
