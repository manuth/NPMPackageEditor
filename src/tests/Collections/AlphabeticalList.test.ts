import { doesNotThrow, notStrictEqual, ok, strictEqual, throws } from "assert";
import { Random } from "random-js";
import { AlphabeticalList } from "../../Collections/AlphabeticalList";
import { List } from "../../Collections/List";

/**
 * Registers tests for the {@link AlphabeticalList `AlphabeticalList<T>`} class.
 */
export function AlphabeticalListTests(): void
{
    suite(
        nameof(AlphabeticalList),
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
             * Asserts that the specified unordered {@link items `items`} have been sorted and added to the {@link list `list`}.
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
                strictEqual(list.Count, items.length);

                for (let item of items)
                {
                    ok(list.Contains(item));
                    correctOrder.push(`${item}`);
                }

                correctOrder.sort();

                for (let i = 0; i < correctOrder.length; i++)
                {
                    strictEqual(`${list.Values[i]}`, correctOrder[i]);
                }
            }

            suite(
                nameof(AlphabeticalList.constructor),
                () =>
                {
                    test(
                        "Checking whether an empty list can be created…",
                        () =>
                        {
                            doesNotThrow(() => new AlphabeticalList());
                        });

                    test(
                        "Checking whether a list with predefined entries can be created…",
                        function()
                        {
                            this.slow(2 * 1000);
                            this.timeout(4 * 1000);
                            AssertItemsWithoutOrder(list, incorrectOrder);
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.Count),
                () =>
                {
                    test(
                        "Checking whether the count is computed correctly…",
                        function()
                        {
                            this.slow(2 * 1000);
                            this.timeout(4 * 1000);

                            for (let i = incorrectOrder.length; i > 0; i--)
                            {
                                strictEqual(list.Count, i);
                                list.RemoveAt(i - 1);
                            }

                            strictEqual(list.Count, 0);
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.Entries),
                () =>
                {
                    test(
                        "Checking whether the entries are generated correctly…",
                        function()
                        {
                            this.slow(2 * 1000);
                            this.timeout(4 * 1000);

                            let correctOrder = incorrectOrder.sort();

                            for (let i = 0; i < correctOrder.length; i++)
                            {
                                let entry = list.Entries[i];
                                strictEqual(entry[0], i);
                                strictEqual(entry[1], correctOrder[i]);
                            }
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.Add),
                () =>
                {
                    test(
                        "Checking whether new values can be added…",
                        () =>
                        {
                            let startCount = list.Count;
                            ok(!list.Contains(randomValue));
                            list.Add(randomValue);
                            ok(list.Contains(randomValue));
                            strictEqual(list.Count, startCount + 1);
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.AddRange),
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
                            strictEqual(list.Count, startCount + otherRange.length);

                            for (let item of otherRange)
                            {
                                ok(list.Contains(item));
                            }
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.Remove),
                () =>
                {
                    test(
                        "Checking whether items can be removed…",
                        () =>
                        {
                            list.Add(randomValue);
                            ok(list.Contains(randomValue));
                            doesNotThrow(() => list.Remove(randomValue));
                            ok(!list.Contains(randomValue));
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.RemoveAt),
                () =>
                {
                    test(
                        "Checking whether items can be removed by their index…",
                        () =>
                        {
                            list.Add(randomValue);
                            let index = list.Values.indexOf(randomValue);
                            ok(list.Contains(randomValue));
                            doesNotThrow(() => list.RemoveAt(index));
                            ok(!list.Contains(randomValue));
                        });

                    test(
                        "Checking whether the keys get reordered automatically…",
                        () =>
                        {
                            list.Add(randomValue);
                            let index = list.Values.indexOf(randomValue);
                            strictEqual(list.Entries[index][1], randomValue);
                            doesNotThrow(() => list.RemoveAt(index));
                            notStrictEqual(list.Entries[index]?.[1], randomValue);
                        });

                    test(
                        "Checking whether trying to remove an inexistent index throws an error…",
                        () =>
                        {
                            throws(() => list.RemoveAt(list.Count));
                        });
                });

            suite(
                nameof<AlphabeticalList<any>>((list) => list.Clear),
                () =>
                {
                    test(
                        "Checking whether the list can be emptied…",
                        () =>
                        {
                            doesNotThrow(() => list.Clear());
                            strictEqual(list.Count, 0);
                        });
                });
        });
}
