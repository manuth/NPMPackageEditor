import { AlphabeticalDictionary } from "./AlphabeticalDictionary.js";
import { List } from "./List.js";

/**
 * Represents an alphabetical list.
 *
 * @template T
 * The type of the items.
 */
export class AlphabeticalList<T> extends List<T>
{
    /**
     * The inner collection.
     */
    private innerCollection: AlphabeticalDictionary<T, null>;

    /**
     * Initializes a new instance of the {@link AlphabeticalArray `AlphabeticalArray<T>`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link AlphabeticalArray `AlphabeticalArray<T>`} class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<T>);

    /**
     * Initializes a new instance of the {@link AlphabeticalArray `AlphabeticalArray<T>`} class.
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
    public override get Count(): number
    {
        return this.innerCollection.Count;
    }

    /**
     * @inheritdoc
     */
    public override get Entries(): Array<[number, T]>
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
     * @param item
     * The item to add.
     */
    public override Add(item: T): void
    {
        this.innerCollection.Add(item, null);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public override AddRange(items: readonly T[]): void
    {
        this.innerCollection.AddRange(items.map((entry) => [entry, null]));
    }

    /**
     * @inheritdoc
     *
     * @param item
     * The item to remove.
     */
    public override Remove(item: T): void
    {
        this.innerCollection.Remove(item);
    }

    /**
     * @inheritdoc
     *
     * @param index
     * The index of the item to remove.
     */
    public override RemoveAt(index: number): void
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
    public override Clear(): void
    {
        this.innerCollection.Clear();
    }
}
