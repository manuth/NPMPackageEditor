import { ICollection } from "./ICollection.js";

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
     * Gets the value of the entry with the specified {@link key `key`}.
     *
     * @param key
     * The {@link key `key`} of the entry whose value to get.
     *
     * @returns
     * The value of the entry with the specified {@link key `key`}.
     */
    Get(key: TKey): TValue;

    /**
     * Sets the value of the entry with the specified {@link key `key`}.
     *
     * @param key
     * The {@link key `key`} of the entry whose value to set.
     *
     * @param value
     * The value to set for the entry with the specified {@link key `key`}.
     */
    Set(key: TKey, value: TValue): void;

    /**
     * Checks whether the dictionary has an entry with the specified {@link key `key`}.
     *
     * @param key
     * The {@link key `key`} of the entry to check.
     *
     * @returns
     * A value indicating whether the dictionary contains an entry with the specified {@link key `key`}.
     */
    Has(key: TKey): boolean;
}
