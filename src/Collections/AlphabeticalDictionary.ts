import { Dictionary } from "./Dictionary.js";

/**
 * Represents a dictionary that is sorted alphabetically.
 *
 * @template TKey
 * The type of the keys.
 *
 * @template TValue
 * The type of the values.
 */
export class AlphabeticalDictionary<TKey, TValue> extends Dictionary<TKey, TValue>
{
    /**
     * Initializes a new instance of the {@link AlphabeticalDictionary `AlphabeticalDictionary<TKey, TValue>`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link AlphabeticalDictionary `AlphabeticalDictionary<TKey, TValue>`} class.
     *
     * @param entries
     * The entries to add.
     */
    public constructor(entries: Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>);

    /**
     * Initializes a new instance of the {@link AlphabeticalDictionary `AlphabeticalDictionary<TKey, TValue>`} class.
     *
     * @param args
     * The passed arguments.
     */
    public constructor(...args: [(Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue>)?])
    {
        super();

        let entries = args[0];

        if (entries)
        {
            this.AddRange(entries);
        }
    }

    /**
     * @inheritdoc
     */
    public override get Entries(): Array<[TKey, TValue]>
    {
        let result = Array.from(super.Entries);

        result.sort(
            (a, b) =>
            {
                let args = [a, b].map((value) => `${value[0]}`.toLocaleLowerCase());
                return args[0].localeCompare(args[1], []);
            });

        return result;
    }
}
