import { ICollection } from "./ICollection.js";

/**
 * Represents a list.
 *
 * @template T
 * The type of the items.
 */
export interface IList<T> extends ICollection<number, T>
{
    /**
     * Checks whether the specified {@link item `item`} exists in the list.
     *
     * @param item
     * The item to check.
     *
     * @returns
     * A value indicating whether the specified {@link item `item`} exists.
     */
    Contains(item: T): boolean;

    /**
     * Adds the specified {@link item `item`} to the list.
     *
     * @param item
     * The item to add.
     */
    Add(item: T): void;

    /**
     * Adds the specified {@link items `items`} to the list.
     *
     * @param items
     * The items to add.
     */
    AddRange(items: readonly T[]): void;

    /**
     * Removes the specified {@link item `item`} from the list.
     *
     * @param item
     * The item to remove.
     */
    Remove(item: T): void;

    /**
     * Removes the item at the specified {@link index `index`}.
     *
     * @param index
     * The index of the item to remove.
     */
    RemoveAt(index: number): void;
}
