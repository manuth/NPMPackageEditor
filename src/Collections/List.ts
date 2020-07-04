import { JSONObjectBase } from "../Utilities/JSONObjectBase";
import { Collection } from "./Collection";
import { IList } from "./IList";

/**
 * Provides the functionality to store a list of values.
 */
export class List<T> extends Collection<number, T> implements IList<T>, JSONObjectBase<T[]>
{
    /**
     * The inner list.
     */
    private innerList: T[] = [];

    /**
     * Initializes a new instance of the `List` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `List` class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<T>);

    /**
     * Initializes a new instance of the `List` class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries?: Iterable<T>)
    {
        super();
        this.innerList.push(...(entries ?? []));
    }

    /**
     * @inheritdoc
     */
    public get Count(): number
    {
        return this.innerList.length;
    }

    /**
     * @inheritdoc
     */
    public get Entries(): ReadonlyArray<[number, T]>
    {
        return this.innerList.map(
            (value, index) =>
            {
                return [index, value];
            });
    }

    /**
     * @inheritdoc
     *
     * @param item
     * The item to add.
     */
    public Add(item: T): void
    {
        this.innerList.push(item);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public AddRange(items: readonly T[]): void
    {
        this.innerList.push(...items);
    }

    /**
     * @inheritdoc
     *
     * @param item
     * The item to remove.
     */
    public Remove(item: T): void
    {
        if (this.innerList.includes(item))
        {
            this.innerList.splice(this.innerList.indexOf(item), 1);
        }
        else
        {
            throw new RangeError();
        }
    }

    /**
     * @inheritdoc
     *
     * @param index
     * The index of the item to remove.
     */
    public RemoveAt(index: number): void
    {
        if (this.innerList.length > index)
        {
            this.innerList.splice(index, 1);
        }
        else
        {
            throw new RangeError();
        }
    }

    /**
     * @inheritdoc
     */
    public Clear(): void
    {
        this.innerList.splice(0, this.innerList.length);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * An object representing this collection.
     */
    public ToJSON(): T[]
    {
        return Array.from(this.Values);
    }
}
