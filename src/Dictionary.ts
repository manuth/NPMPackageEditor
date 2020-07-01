import { JSONObject } from "./Utilities/JSONObject";

/**
 * Represents a set of key-value-pairs.
 *
 * @template TKey
 * The type of the keys of the dictionary.
 *
 * @template TValue
 * The type of the values of the dictionary.
 */
export class Dictionary<TKey, TValue>
{
    /**
     * The actual collection.
     */
    private innerCollection: Map<TKey, TValue> = new Map();

    /**
     * Initializes a new instance of the `Dictionary` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `Dictionary` class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<readonly [TKey, TValue]>);

    /**
     * Initializes a new instance of the `Dictionary` class.
     *
     * @param args
     * The passed arguments.
     */
    public constructor(...args: [Iterable<readonly [TKey, TValue]>?])
    {
        if (args.length > 0)
        {
            this.AddRange(...args);
        }
    }

    /**
     * Gets the number of elements.
     *
     * @returns
     * The number of elements.
     */
    public get Count(): number
    {
        return this.innerCollection.size;
    }

    /**
     * Gets the entries of the dictionary.
     */
    public get Entries(): ReadonlyArray<[TKey, TValue]>
    {
        return Array.from(this.innerCollection.entries());
    }

    /**
     * Gets the keys of the dictionary.
     */
    public get Keys(): readonly TKey[]
    {
        return Array.from(this.innerCollection.keys());
    }

    /**
     * Gets the versions of the dependencies in this collection.
     */
    public get Values(): readonly TValue[]
    {
        return Array.from(this.innerCollection.values());
    }

    /**
     * Adds an entry to the dictionary.
     *
     * @param key
     * The key of the entry to add.
     *
     * @param value
     * The value of the entry to add.
     */
    public Add(key: TKey, value: TValue): void
    {
        this.innerCollection.set(key, value);
    }

    /**
     * Adds multiple entries to the dictionary.
     *
     * @param entries
     * The entries to add.
     */
    public AddRange(entries: Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>): void
    {
        if (entries instanceof Dictionary)
        {
            entries = entries.Entries;
        }

        for (let entry of entries)
        {
            this.Add(entry[0], entry[1]);
        }
    }

    /**
     * Removes an entry from the dictionary.
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
     * Gets the value of the entry with the specified `key`.
     *
     * @param key
     * The `key` of the entry whose value to get.
     *
     * @returns
     * The value of the entry with the specified `key`.
     */
    public Get(key: TKey): TValue
    {
        if (!this.innerCollection.has(key))
        {
            throw new RangeError();
        }
        else
        {
            return this.innerCollection.get(key);
        }
    }

    /**
     * Checks whether the dictionary has an entry with the specified `key`.
     *
     * @param key
     * The `key` of the entry to check.
     *
     * @returns
     * A value indicating whether the dictionary contains an entryx with the specified `key`.
     */
    public Has(key: TKey): boolean
    {
        return this.innerCollection.has(key);
    }

    /**
     * Clears the dictionary.
     */
    public Clear(): void
    {
        this.innerCollection.clear();
    }

    /**
     * Returns an object representing this collection.
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
            new JSONObject()).ToJSON();
    }
}
