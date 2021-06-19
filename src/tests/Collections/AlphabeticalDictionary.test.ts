import { strictEqual } from "assert";
import { Random } from "random-js";
import { AlphabeticalDictionary } from "../../Collections/AlphabeticalDictionary";
import { Dictionary } from "../../Collections/Dictionary";

/**
 * Registers tests for the {@link AlphabeticalDictionary `AlphabeticalDictionary<TKey, TValue>`} class.
 */
export function AlphabeticalDictionaryTests(): void
{
    suite(
        nameof(AlphabeticalDictionary),
        () =>
        {
            let random: Random;
            let dictionary: Dictionary<string, number>;
            let incorrectOrder: string[];
            let randomMap: Array<[string, number]>;

            suiteSetup(
                () =>
                {
                    random = new Random();
                    incorrectOrder = [];
                    randomMap = [];

                    for (let i = random.integer(1, 50); i > 0; i--)
                    {
                        incorrectOrder.push(random.string(10 + i, "abc"));
                    }

                    for (let entry of incorrectOrder)
                    {
                        randomMap.push([entry, random.int32()]);
                    }
                });

            setup(
                () =>
                {
                    dictionary = new AlphabeticalDictionary(randomMap);
                });

            suite(
                nameof<AlphabeticalDictionary<any, any>>((dictionary) => dictionary.Entries),
                () =>
                {
                    /**
                     * Asserts that the unordered entries in the specified {@link map `map`} have been sorted and added to the {@link dictionary `dictionary`}.
                     *
                     * @param dictionary
                     * The actual dictionary.
                     *
                     * @param map
                     * The expected entries.
                     */
                    function AssertEntriesWithoutOrder<TKey, TValue>(dictionary: Dictionary<TKey, TValue>, map: Array<[TKey, TValue]>): void
                    {
                        let correctOrder: string[] = [];
                        strictEqual(dictionary.Count, map.length);

                        for (let entry of map)
                        {
                            strictEqual(dictionary.Get(entry[0]), entry[1]);
                            correctOrder.push(`${entry[0]}`);
                        }

                        correctOrder.sort();

                        for (let i = 0; i < correctOrder.length; i++)
                        {
                            strictEqual(`${dictionary.Keys[i]}`, correctOrder[i]);
                        }
                    }

                    test(
                        "Checking whether the entries are sorted alphabetically…",
                        () =>
                        {
                            AssertEntriesWithoutOrder(dictionary, randomMap);
                        });

                    test(
                        `Checking whether entries can be sorted using the \`${nameof(Object.toString)}\`-method, too…`,
                        () =>
                        {
                            let objectMap = randomMap.map<[Record<string, unknown>, number]>(
                                (entry) =>
                                {
                                    let result: [Record<string, unknown>, number] = [null, null];
                                    result[0] = { toString: () => entry[0] };
                                    result[1] = entry[1];
                                    return result;
                                });

                            let dictionary = new AlphabeticalDictionary(objectMap);
                            AssertEntriesWithoutOrder(dictionary, objectMap);
                        });
                });
        });
}
