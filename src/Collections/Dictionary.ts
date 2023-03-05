import isIterableLike from "@stdlib/assert-is-iterable-like";
import { JSONObject } from "../Utilities/JSONObject.js";
import { JSONObjectBase } from "../Utilities/JSONObjectBase.js";
import { Collection } from "./Collection.js";
import { IDictionary } from "./IDictionary.js";

/**
 * Provides the functionality to store key-value pairs.
 *
 * @template TKey
 * The type of the keys of the dictionary.
 *
 * @template TValue
 * The type of the values of the dictionary.
 */
export class Dictionary<TKey, TValue> extends Collection<TKey, TValue> implements IDictionary<TKey, TValue>, JSONObjectBase<Record<string, TValue>>
{
    /**
     * The actual collection.
     */
    private innerCollection: Map<TKey, TValue> = new Map();

    /**
     * Initializes a new instance of the {@link Dictionary `Dictionary<TKey, TValue>`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link Dictionary `Dictionary<TKey, TValue>`} class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>);

    /**
     * Initializes a new instance of the {@link Dictionary `Dictionary<TKey, TValue>`} class.
     *
     * @param args
     * The passed arguments.
     */
    public constructor(...args: [(Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>)?])
    {
        super();
        let entries = args[0];

        if (entries)
        {
            this.AddRange(entries);
        }
    }

    /**
     * @inheritdoc
     */
    public override get Count(): number
    {
        return this.innerCollection.size;
    }

    /**
     * @inheritdoc
     */
    public get Entries(): Array<[TKey, TValue]>
    {
        return Array.from(this.innerCollection.entries());
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The key of the entry to add.
     *
     * @param value
     * The value of the entry to add.
     */
    public Add(key: TKey, value: TValue): void
    {
        if (this.Has(key))
        {
            throw new RangeError();
        }
        else
        {
            this.innerCollection.set(key, value);
        }
    }

    /**
     * @inheritdoc
     *
     * @param entries
     * The entries to add.
     */
    public AddRange(entries: Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>): void
    {
        let entrySet: Iterable<readonly [TKey, TValue]>;

        if (this.IsIterable(entries))
        {
            entrySet = entries;
        }
        else
        {
            entrySet = entries.Entries;
        }

        for (let entry of entrySet)
        {
            this.Add(entry[0], entry[1]);
        }
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The key of the entry to remove.
     */
    public Remove(key: TKey): void
    {
        if (!this.innerCollection.delete(key))
        {
            throw new RangeError();
        }
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The {@link key `key`} of the entry whose value to get.
     *
     * @returns
     * The value of the entry with the specified {@link key `key`}.
     */
    public Get(key: TKey): TValue
    {
        if (!this.Has(key))
        {
            throw new RangeError();
        }
        else
        {
            return this.innerCollection.get(key) as TValue;
        }
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The {@link key `key`} of the entry whose value to set.
     *
     * @param value
     * The value to set for the specified {@link key `key`}.
     */
    public Set(key: TKey, value: TValue): void
    {
        if (!this.Has(key))
        {
            throw new RangeError();
        }
        else
        {
            this.innerCollection.set(key, value);
        }
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The {@link key `key`} of the entry to check.
     *
     * @returns
     * A value indicating whether the dictionary contains an entry with the specified {@link key `key`}.
     */
    public Has(key: TKey): boolean
    {
        return this.innerCollection.has(key);
    }

    /**
     * @inheritdoc
     */
    public Clear(): void
    {
        this.innerCollection.clear();
    }

    /**
     * @inheritdoc
     *
     * @returns
     * An object representing this collection.
     */
    public ToJSON(): Record<string, TValue>
    {
        return this.Entries.reduce<JSONObject<Record<string, TValue>>>(
            (result, entry) =>
            {
                result.Add(`${entry[0]}`, entry[1]);
                return result;
            },
            new JSONObject()).ToJSON() as Record<string, TValue>;
    }

    /**
     * Checks whether the specified {@link list `list`} is an {@link Iterable `Iterable<T>`} object.
     *
     * @param list
     * The list to to check.
     *
     * @returns
     * A value indicating whether the specified {@link list `list`} is an {@link Iterable `Iterable<T>`} object.
     */
    protected IsIterable(list: Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>): list is Iterable<readonly [TKey, TValue]>
    {
        return isIterableLike(list);
    }
}
