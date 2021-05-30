import { Dictionary } from "./Dictionary";

/**
 * Represents a dictionary which is sorted alphabetically.
 */
export class AlphabeticalDictionary<TKey, TValue> extends Dictionary<TKey, TValue>
{
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
