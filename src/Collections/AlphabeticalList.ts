import { AlphabeticalDictionary } from "./AlphabeticalDictionary";
import { List } from "./List";

/**
 * Represents an alphabetical list.
 */
export class AlphabeticalList<T> extends List<T>
{
    /**
     * The inner collection.
     */
    private innerCollection: AlphabeticalDictionary<T, null>;

    /**
     * Initializes a new instance of the `AlphabeticalArray` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `AlphabeticalArray` class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<T>);

    /**
     * Initializes a new instance of the `AlphabeticalArray` class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries?: Iterable<T>)
    {
        super();
        this.innerCollection = new AlphabeticalDictionary(Array.from(entries ?? []).map((entry) => [entry, null]));
    }

    /**
     * @inheritdoc
     */
    public get Count(): number
    {
        return this.innerCollection.Count;
    }

    /**
     * @inheritdoc
     */
    public get Entries(): ReadonlyArray<[number, T]>
    {
        return Array.from(
            this.innerCollection.Entries.map(
                (value, index) =>
                {
                    return [index, value[0]];
                }));
    }

    /**
     * @inheritdoc
     *
     * @param value
     * The item to add.
     */
    public Add(value: T): void
    {
        this.innerCollection.Add(value, null);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public AddRange(items: readonly T[]): void
    {
        this.innerCollection.AddRange(items.map((entry) => [entry, null]));
    }

    /**
     * @inheritdoc
     *
     * @param item
     * The item to remove.
     */
    public Remove(item: T): void
    {
        this.innerCollection.Remove(item);
    }

    /**
     * @inheritdoc
     *
     * @param index
     * The index of the item to remove.
     */
    public RemoveAt(index: number): void
    {
        if (this.Count > index)
        {
            this.Remove(this.Values[index]);
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
        this.innerCollection.Clear();
    }
}
