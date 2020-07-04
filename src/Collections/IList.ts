import { ICollection } from "./ICollection";

/**
 * Represents a list.
 */
export interface IList<T> extends ICollection<number, T>
{
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
