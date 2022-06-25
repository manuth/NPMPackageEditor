import { deepStrictEqual, doesNotThrow, notStrictEqual, ok, strictEqual, throws } from "assert";
import { List } from "../../Collections/List.js";
import { TestContext } from "../TestContext.js";

/**
 * Registers tests for the {@link List `List<T>`} class.
 *
 * @param context
 * The test-context.
 */
export function ListTests(context: TestContext): void
{
    suite(
        nameof(List),
        () =>
        {
            let randomData: string[];
            let randomItem: string;
            let list: List<string>;

            setup(
                () =>
                {
                    randomData = [];

                    for (let i = context.Random.integer(1, 10); i > 0; i--)
                    {
                        randomData.push(`${i}:${context.Random.string(10)}`);
                    }

                    list = new List(randomData);
                    randomItem = context.Random.pick(randomData);
                });

            suite(
                nameof<List<any>>((list) => list.Count),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<List<any>>((l) => l.Count)}\` returns the number of entries…`,
                        () =>
                        {
                            strictEqual(randomData.length, list.Count);
                        });
                });

            suite(
                nameof<List<any>>((list) => list.Entries),
                () =>
                {
                    test(
                        "Checking whether the keys represent a numeric range…",
                        function()
                        {
                            this.slow(2 * 1000);
                            this.timeout(4 * 1000);

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
                nameof<List<any>>((list) => list.Contains),
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
                nameof<List<any>>((list) => list.Add),
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
                nameof<List<any>>((list) => list.AddRange),
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
                nameof<List<any>>((list) => list.Remove),
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
                nameof<List<any>>((list) => list.RemoveAt),
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
                nameof<List<any>>((list) => list.Clear),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof(List)}\` can be cleared…`,
                        () =>
                        {
                            strictEqual(list.Count, randomData.length);
                            doesNotThrow(() => list.Clear());
                            strictEqual(list.Count, 0);
                        });
                });

            suite(
                nameof<List<any>>((list) => list.ToJSON),
                () =>
                {
                    test(
                        `Checking whether \`${nameof(List)}\`s are converted to JSON correctly…`,
                        () =>
                        {
                            deepStrictEqual(list.ToJSON(), randomData);
                        });
                });
        });
}
