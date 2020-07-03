/**
 * Represents a collection.
 *
 * @template TKey
 * The type of the keys of the collection.
 *
 * @template TValue
 * The type of the values of the collection.
 */
export interface ICollection<TKey, TValue>
{
    /**
     * Gets the number of elements in this collection.
     */
    readonly Count: number;

    /**
     * Gets the entries of the collection.
     */
    readonly Entries: ReadonlyArray<[TKey, TValue]>;

    /**
     * Gets the keys of the collection.
     */
    readonly Keys: readonly TKey[];

    /**
     * Gets the values of the collection.
     */
    readonly Values: readonly TValue[];

    /**
     * Clears the collection.
     */
    Clear(): void;
}
