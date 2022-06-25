import { Collection } from "../../Collections/Collection.js";

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
     * Initializes a new instance of the {@link TestCollection `TestCollection`} class.
     *
     * @param entries
     * The entries to add to the collection.
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
