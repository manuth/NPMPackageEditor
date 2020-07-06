import Assert = require("assert");
import { Random } from "random-js";
import { Dictionary } from "../../Collections/Dictionary";

suite(
    "Dictionary<TKey, TValue>",
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
            Assert.strictEqual(dictionary.Count, entryArray.length);

            Assert.ok(
                entryArray.every(
                    (entry) =>
                    {
                        return dictionary.Get(entry[0]) === entry[1];
                    }));
        }

        suite(
            "constructor([Iterable<readonly [TKey, TValue]>?`] entries)",
            () =>
            {
                test(
                    "Checking whether a dictionary can be constructed without arguments…",
                    () =>
                    {
                        Assert.doesNotThrow(() => new Dictionary());
                    });

                test(
                    "Checking whether a dictionary can be constructed with predefined entries…",
                    () =>
                    {
                        Assert.doesNotThrow(
                            () =>
                            {
                                Assert.doesNotThrow(
                                    () => new Dictionary(
                                        [
                                            ["", ""]
                                        ]));
                            });
                    });
            });

        suite(
            "int Count",
            () =>
            {
                test(
                    "Checking whether `Count` returns the number of entries…",
                    () =>
                    {
                        Assert.strictEqual(randomMap.length, dictionary.Count);
                    });
            });

        suite(
            "Array<[TKey, TValue]> Entries",
            () =>
            {
                test(
                    "Checking whether all entries are present…",
                    () =>
                    {
                        Assert.ok(
                            randomMap.every(
                                (mapEntry) =>
                                {
                                    return dictionary.Entries.some((entry) => mapEntry[0] === entry[0] && mapEntry[1] === entry[1]);
                                }));
                    });
            });

        suite(
            "void Add(TKey key, TValue value)",
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
                        Assert.throws(() => dictionary.Add(key, ""));
                    });
            });

        suite(
            "void AddRange(Iterable<readonly [TKey, TValue]> | Dictionary<TKey, TValue> entries)",
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
            "void Remove(TKey key)",
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
                        Assert.throws(() => dictionary.Remove(randomKey));
                    });
            });

        suite(
            "TValue Get(TKey key)",
            () =>
            {
                test(
                    "Checking whether values can be requested correctly…",
                    () =>
                    {
                        Assert.strictEqual(dictionary.Get(randomKey), new Map(randomMap).get(randomKey));
                    });

                test(
                    "Checking whether requesting an inexistent key throws an error…",
                    () =>
                    {
                        dictionary.Remove(randomKey);
                        Assert.throws(() => dictionary.Get(randomKey));
                    });
            });

        suite(
            "bool Has(TKey key)",
            () =>
            {
                test(
                    "Checking whether key-existence is computed correctly…",
                    () =>
                    {
                        Assert.ok(dictionary.Has(randomKey));
                        dictionary.Remove(randomKey);
                        Assert.ok(!dictionary.Has(randomKey));
                    });
            });

        suite(
            "void Clear()",
            () =>
            {
                test(
                    "Checking whether dictionaries can be cleared…",
                    () =>
                    {
                        dictionary.Clear();
                        Assert.notStrictEqual(dictionary.Count, randomMap.length);
                        Assert.strictEqual(dictionary.Count, 0);
                    });
            });

        suite(
            "Record<string, TValue> ToJSON()",
            () =>
            {
                test(
                    "Checking whether dictionaries are converted to JSON correclty…",
                    () =>
                    {
                        let jsonObject = dictionary.ToJSON();

                        for (let key of Object.keys(jsonObject))
                        {
                            Assert.ok(dictionary.Has(key));
                            Assert.strictEqual(jsonObject[key], dictionary.Get(key));
                        }
                    });
            });
    });
