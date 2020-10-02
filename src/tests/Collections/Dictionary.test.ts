import { doesNotThrow, notStrictEqual, ok, strictEqual, throws } from "assert";
import { Random } from "random-js";
import { Dictionary } from "../../Collections/Dictionary";

/**
 * Registers tests for the `Dictionary` class.
 */
export function DictionaryTests(): void
{
    suite(
        "Dictionary",
        () =>
        {
            let dictionary: Dictionary<string, string>;
            let random: Random;
            let randomMap: Array<[string, string]>;
            let randomKey: string;

            suiteSetup(
                () =>
                {
                    random = new Random();
                    randomMap = [];

                    for (let i = random.integer(1, 10); i > 0; i--)
                    {
                        randomMap.push([i.toString(), random.string(5)]);
                    }
                });

            setup(
                () =>
                {
                    dictionary = new Dictionary(randomMap);
                    randomKey = random.pick(randomMap)[0];
                });

            /**
             * Checks whether all entries are present.
             *
             * @param entries
             * The entries to check against.
             */
            function AssertEntries(entries: Iterable<readonly [string, string]>): void
            {
                let entryArray = Array.from(entries);
                strictEqual(dictionary.Count, entryArray.length);

                ok(
                    entryArray.every(
                        (entry) =>
                        {
                            return dictionary.Get(entry[0]) === entry[1];
                        }));
            }

            suite(
                "constructor",
                () =>
                {
                    test(
                        "Checking whether a dictionary can be constructed without arguments…",
                        () =>
                        {
                            doesNotThrow(() => new Dictionary());
                        });

                    test(
                        "Checking whether a dictionary can be constructed with predefined entries…",
                        () =>
                        {
                            doesNotThrow(
                                () => new Dictionary(
                                    [
                                        ["", ""]
                                    ]));
                        });
                });

            suite(
                "Count",
                () =>
                {
                    test(
                        "Checking whether `Count` returns the number of entries…",
                        () =>
                        {
                            strictEqual(randomMap.length, dictionary.Count);
                        });
                });

            suite(
                "Entries",
                () =>
                {
                    test(
                        "Checking whether all entries are present…",
                        () =>
                        {
                            ok(
                                randomMap.every(
                                    (mapEntry) =>
                                    {
                                        return dictionary.Entries.some((entry) => mapEntry[0] === entry[0] && mapEntry[1] === entry[1]);
                                    }));
                        });
                });

            suite(
                "Add",
                () =>
                {
                    let key: string;
                    let value: string;

                    suiteSetup(
                        () =>
                        {
                            key = "this-is-a-key";
                            value = random.string(5);
                        });

                    setup(
                        () =>
                        {
                            dictionary = new Dictionary();
                        });

                    test(
                        "Checking whether entries are added correctly…",
                        () =>
                        {
                            dictionary.Add(key, value);
                        });

                    test(
                        "Checking whether adding duplicate entries throws an error…",
                        () =>
                        {
                            dictionary.Add(key, value);
                            throws(() => dictionary.Add(key, ""));
                        });
                });

            suite(
                "AddRange",
                () =>
                {
                    setup(
                        () =>
                        {
                            dictionary = new Dictionary();
                        });

                    test(
                        "Checking whether iterable values can be added…",
                        () =>
                        {
                            dictionary.AddRange(randomMap);
                            AssertEntries(randomMap);
                        });

                    test(
                        "Checking whether dictionaries can be added…",
                        () =>
                        {
                            dictionary.AddRange(new Dictionary(randomMap));
                            AssertEntries(randomMap);
                        });
                });

            suite(
                "Remove",
                () =>
                {
                    test(
                        "Checking whether entries can be removed…",
                        () =>
                        {
                            let expectedDictionary = new Map<string, string>(dictionary.Entries);
                            expectedDictionary.delete(randomKey);
                            dictionary.Remove(randomKey);
                            AssertEntries(expectedDictionary.entries());
                        });

                    test(
                        "Checking whether trying to remove inexistent entries throws an error…",
                        () =>
                        {
                            dictionary.Remove(randomKey);
                            throws(() => dictionary.Remove(randomKey));
                        });
                });

            suite(
                "Get",
                () =>
                {
                    test(
                        "Checking whether values can be requested correctly…",
                        () =>
                        {
                            strictEqual(dictionary.Get(randomKey), new Map(randomMap).get(randomKey));
                        });

                    test(
                        "Checking whether requesting an inexistent key throws an error…",
                        () =>
                        {
                            dictionary.Remove(randomKey);
                            throws(() => dictionary.Get(randomKey));
                        });
                });

            suite(
                "Has",
                () =>
                {
                    test(
                        "Checking whether key-existence is computed correctly…",
                        () =>
                        {
                            ok(dictionary.Has(randomKey));
                            dictionary.Remove(randomKey);
                            ok(!dictionary.Has(randomKey));
                        });
                });

            suite(
                "Clear",
                () =>
                {
                    test(
                        "Checking whether dictionaries can be cleared…",
                        () =>
                        {
                            dictionary.Clear();
                            notStrictEqual(dictionary.Count, randomMap.length);
                            strictEqual(dictionary.Count, 0);
                        });
                });

            suite(
                "ToJSON",
                () =>
                {
                    test(
                        "Checking whether dictionaries are converted to JSON correclty…",
                        () =>
                        {
                            let jsonObject = dictionary.ToJSON();

                            for (let key of Object.keys(jsonObject))
                            {
                                ok(dictionary.Has(key));
                                strictEqual(jsonObject[key], dictionary.Get(key));
                            }
                        });
                });
        });
}
