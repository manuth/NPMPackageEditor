import { ICollection } from "./ICollection";

/**
 * Represents a list.
 */
export interface IList<T> extends ICollection<number, T>
{
    /**
     * Checks whether the specified `item` exists in the list.
     *
     * @param item
     * The item to check.
     *
     * @returns
     * A value indicating whether the specified `item` exists.
     */
    Contains(item: T): boolean;

    /**
     * Adds an item to the list.
     *
     * @param item
     * The item to add.
     */
    Add(item: T): void;

    /**
     * Adds elements to the list.
     *
     * @param items
     * The items to add.
     */
    AddRange(items: readonly T[]): void;

    /**
     * Removes an item from the list.
     *
     * @param item
     * The item to remove.
     */
    Remove(item: T): void;

    /**
     * Removes the item at the specified `index`.
     *
     * @param index
     * The index of the item to remove.
     */
    RemoveAt(index: number): void;
}
