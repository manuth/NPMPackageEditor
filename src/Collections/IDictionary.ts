import { ICollection } from "./ICollection";

/**
 * Represents a set of key-value pairs.
 *
 * @template TKey
 * The type of the keys of the dictionary.
 *
 * @template TValue
 * The type of the values of the dictionary.
 */
export interface IDictionary<TKey, TValue> extends ICollection<TKey, TValue>
{
    /**
     * Adds an entry to the dictionary.
     *
     * @param key
     * The key of the entry to add.
     *
     * @param value
     * The value of the entry to add.
     */
    Add(key: TKey, value: TValue): void;

    /**
     * Adds multiple entries to the dictionary.
     *
     * @param entries
     * The entries to add.
     */
    AddRange(entries: Iterable<readonly [TKey, TValue]> | IDictionary<TKey, TValue>): void;

    /**
     * Removes an entry from the dictionary.
     *
     * @param key
     * The key of the entry to remove.
     */
    Remove(key: TKey): void;

    /**
     * Gets the value of the entry with the specified `key`.
     *
     * @param key
     * The `key` of the entry whose value to get.
     *
     * @returns
     * The value of the entry with the specified `key`.
     */
    Get(key: TKey): TValue;

    /**
     * Checks whether the dictionary has an entry with the specified `key`.
     *
     * @param key
     * The `key` of the entry to check.
     *
     * @returns
     * A value indicating whether the dictionary contains an entryx with the specified `key`.
     */
    Has(key: TKey): boolean;
}
