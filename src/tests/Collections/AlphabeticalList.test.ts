import Assert = require("assert");
import { Random } from "random-js";
import { AlphabeticalList } from "../../Collections/AlphabeticalList";
import { List } from "../../Collections/List";

suite(
    "AlphabeticalList",
    () =>
    {
        let random: Random;
        let incorrectOrder: string[];
        let list: List<string>;
        let randomValue: string;

        suiteSetup(
            () =>
            {
                random = new Random();
                incorrectOrder = [];

                for (let i = random.integer(1, 50); i > 0; i--)
                {
                    incorrectOrder.push(random.string(10, "abc"));
                }
            });

        setup(
            () =>
            {
                list = new AlphabeticalList(incorrectOrder);
                randomValue = random.string(15);
            });

        /**
         * Asserts the items of a `list`.
         *
         * @param list
         * The actual list.
         *
         * @param items
         * The expected items.
         */
        function AssertItemsWithoutOrder<T>(list: List<T>, items: T[]): void
        {
            let correctOrder: string[] = [];
            Assert.strictEqual(list.Count, items.length);

            for (let item of items)
            {
                Assert.ok(list.Contains(item));
                correctOrder.push(`${item}`);
            }

            correctOrder.sort();

            for (let i = 0; i < correctOrder.length; i++)
            {
                Assert.strictEqual(`${list.Values[i]}`, correctOrder[i]);
            }
        }

        suite(
            "constructor()",
            () =>
            {
                test(
                    "Checking whether an empty list can be created…",
                    () =>
                    {
                        Assert.doesNotThrow(() => new AlphabeticalList());
                    });
            });

        suite(
            "constructor(Itearble<T> entries)",
            () =>
            {
                test(
                    "Checking whether a list with predefined entries can be created…",
                    () =>
                    {
                        AssertItemsWithoutOrder(list, incorrectOrder);
                    });
            });

        suite(
            "int Count",
            () =>
            {
                test(
                    "Checking whether the count is computed correctly…",
                    () =>
                    {
                        for (let i = incorrectOrder.length; i > 0; i--)
                        {
                            Assert.strictEqual(list.Count, i);
                            list.RemoveAt(i - 1);
                        }

                        Assert.strictEqual(list.Count, 0);
                    });
            });

        suite(
            "Array<[number, T]> Entries",
            () =>
            {
                test(
                    "Checking whether the entries are generated correctly…",
                    () =>
                    {
                        let correctOrder = incorrectOrder.sort();

                        for (let i = 0; i < correctOrder.length; i++)
                        {
                            let entry = list.Entries[i];
                            Assert.strictEqual(entry[0], i);
                            Assert.strictEqual(entry[1], correctOrder[i]);
                        }
                    });
            });

        suite(
            "void Add(T value)",
            () =>
            {
                test(
                    "Checking whether new values can be added…",
                    () =>
                    {
                        let startCount = list.Count;
                        Assert.ok(!list.Contains(randomValue));
                        list.Add(randomValue);
                        Assert.ok(list.Contains(randomValue));
                        Assert.strictEqual(list.Count, startCount + 1);
                    });
            });

        suite(
            "void AddRange(readonly T[] items)",
            () =>
            {
                test(
                    "Checking whether multiple items can be added at once…",
                    () =>
                    {
                        let otherRange: string[] = [];
                        let startCount = list.Count;

                        for (let i = random.integer(1, 10); i > 0; i--)
                        {
                            otherRange.push(random.string(15));
                        }

                        list.AddRange(otherRange);
                        Assert.strictEqual(list.Count, startCount + otherRange.length);

                        for (let item of otherRange)
                        {
                            Assert.ok(list.Contains(item));
                        }
                    });
            });

        suite(
            "void Remove(item T)",
            () =>
            {
                test(
                    "Checking whether items can be removed…",
                    () =>
                    {
                        list.Add(randomValue);
                        Assert.ok(list.Contains(randomValue));
                        Assert.doesNotThrow(() => list.Remove(randomValue));
                        Assert.ok(!list.Contains(randomValue));
                    });
            });

        suite(
            "void RemoveAt(number index)",
            () =>
            {
                test(
                    "Checking whether items can be removed by their index…",
                    () =>
                    {
                        list.Add(randomValue);
                        let index = list.Values.indexOf(randomValue);
                        Assert.ok(list.Contains(randomValue));
                        Assert.doesNotThrow(() => list.RemoveAt(index));
                        Assert.ok(!list.Contains(randomValue));
                    });

                test(
                    "Checking whether the keys get reordered automatically…",
                    () =>
                    {
                        list.Add(randomValue);
                        let index = list.Values.indexOf(randomValue);
                        Assert.strictEqual(list.Entries[index][1], randomValue);
                        Assert.doesNotThrow(() => list.RemoveAt(index));
                        Assert.notStrictEqual(list.Entries[index]?.[1], randomValue);
                    });

                test(
                    "Checking whether trying to remove an inexistent index throws an error…",
                    () =>
                    {
                        Assert.throws(() => list.RemoveAt(list.Count));
                    });
            });

        suite(
            "void Clear()",
            () =>
            {
                test(
                    "Checking whether the list can be emptied…",
                    () =>
                    {
                        Assert.doesNotThrow(() => list.Clear());
                        Assert.strictEqual(list.Count, 0);
                    });
            });
    });
