import { Collection } from "../../Collections/Collection";

/**
 * Provides the functionality to store item-collections.
 */
export class TestCollection extends Collection<string, number>
{
    /**
     * The entries of the collection.
     */
    private entries: Array<[string, number]>;

    /**
     * Initializes a new instance of the `TestCollection` class.
     *
     * @param entries
     * The entries of the collection.
     */
    public constructor(entries: ReadonlyArray<readonly [string, number]>)
    {
        super();
        this.entries = [...(entries.map<[string, number]>((entry) => [...entry]))];
    }

    /**
     * @inheritdoc
     */
    public get Entries(): Array<[string, number]>
    {
        return this.entries;
    }

    /**
     * @inheritdoc
     */
    public Clear(): void
    {
        this.entries = [];
    }

    /**
     * @inheritdoc
     *
     * @returns
     * An object representing this collection.
     */
    public ToJSON(): any
    {
        return {};
    }
}
