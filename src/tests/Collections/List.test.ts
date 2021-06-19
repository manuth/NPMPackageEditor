import { deepStrictEqual, doesNotThrow, notStrictEqual, ok, strictEqual, throws } from "assert";
import { Random } from "random-js";
import { List } from "../../Collections/List";

/**
 * Registers tests for the {@link List `List<T>`} class.
 */
export function ListTests(): void
{
    suite(
        "List",
        () =>
        {
            let random: Random;
            let randomData: string[];
            let randomItem: string;
            let list: List<string>;

            suiteSetup(
                () =>
                {
                    random = new Random();
                    randomData = [];

                    for (let i = random.integer(1, 10); i > 0; i--)
                    {
                        randomData.push(`${i}:${random.string(10)}`);
                    }
                });

            setup(
                () =>
                {
                    list = new List(randomData);
                    randomItem = random.pick(randomData);
                });

            suite(
                "Count",
                () =>
                {
                    test(
                        "Checking whether `Count` returns the number of entries…",
                        () =>
                        {
                            strictEqual(randomData.length, list.Count);
                        });
                });

            suite(
                "Entries",
                () =>
                {
                    test(
                        "Checking whether the keys represent a numeric range…",
                        () =>
                        {
                            let expected: number[] = [];

                            for (let i = 0; i < randomData.length; i++)
                            {
                                expected.push(i);
                            }

                            deepStrictEqual(list.Entries.map((entry) => entry[0]), expected);
                        });

                    test(
                        "Checking whether all entries are present…",
                        () =>
                        {
                            ok(
                                list.Entries.every(
                                    (entry) =>
                                    {
                                        return randomData[entry[0]] === entry[1];
                                    }));
                        });
                });

            suite(
                "Contains",
                () =>
                {
                    test(
                        "Checking whether items can be checked for existence…",
                        () =>
                        {
                            list = new List();
                            ok(!list.Contains(randomItem));
                            list.Add(randomItem);
                            ok(list.Contains(randomItem));
                        });
                });

            suite(
                "Add",
                () =>
                {
                    test(
                        "Checking whether items can be added…",
                        () =>
                        {
                            list = new List();
                            strictEqual(list.Count, 0);
                            doesNotThrow(() => list.Add(randomItem));
                            strictEqual(list.Count, 1);
                            ok(list.Contains(randomItem));
                        });
                });

            suite(
                "AddRange",
                () =>
                {
                    test(
                        "Checking whether multiple items can be added at once…",
                        () =>
                        {
                            list = new List();
                            list.AddRange(randomData);
                            strictEqual(list.Count, randomData.length);
                        });
                });

            suite(
                "Remove",
                () =>
                {
                    test(
                        "Checking whether items can be removed…",
                        () =>
                        {
                            ok(list.Contains(randomItem));
                            doesNotThrow(() => list.Remove(randomItem));
                            ok(!list.Contains(randomItem));
                        });

                    test(
                        "Checking whether trying to remove an inexistent item throws an error…",
                        () =>
                        {
                            list.Remove(randomItem);
                            throws(() => list.Remove(randomItem));
                        });
                });

            suite(
                "RemoveAt",
                () =>
                {
                    test(
                        "Checking whether an item at a specified index can be removed…",
                        () =>
                        {
                            let index = randomData.indexOf(randomItem);
                            strictEqual(list.Values[index], randomItem);
                            doesNotThrow(() => list.RemoveAt(index));
                            strictEqual(list.Count, randomData.length - 1);
                            notStrictEqual(list.Values[index], randomItem);
                        });

                    test(
                        "Checking whether trying to remove an inexistent index throws an error…",
                        () =>
                        {
                            throws(() => list.RemoveAt(list.Count));
                        });
                });

            suite(
                "Clear",
                () =>
                {
                    test(
                        "Checking whether the list can be cleared…",
                        () =>
                        {
                            strictEqual(list.Count, randomData.length);
                            doesNotThrow(() => list.Clear());
                            strictEqual(list.Count, 0);
                        });
                });

            suite(
                "ToJSON",
                () =>
                {
                    test(
                        "Checking whether lists are converted to json correctly…",
                        () =>
                        {
                            deepStrictEqual(list.ToJSON(), randomData);
                        });
                });
        });
}
