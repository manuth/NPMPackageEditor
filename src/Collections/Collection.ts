import { JSONObjectBase } from "../Utilities/JSONObjectBase";
import { ICollection } from "./ICollection";

/**
 * Provides the functionality to store collections of items.
 */
export abstract class Collection<TKey, TValue> extends JSONObjectBase<any> implements ICollection<TKey, TValue>
{
    /**
     * @inheritdoc
     */
    public abstract get Count(): number;

    /**
     * @inheritdoc
     */
    public abstract get Entries(): ReadonlyArray<[TKey, TValue]>;

    /**
     * @inheritdoc
     */
    public get Keys(): readonly TKey[]
    {
        return this.Entries.map((entry) => entry[0]);
    }

    /**
     * @inheritdoc
     */
    public get Values(): readonly TValue[]
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
    public abstract ToJSON(): any;
}
