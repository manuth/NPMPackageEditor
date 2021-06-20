import { ok, strictEqual } from "assert";
import { Random } from "random-js";
import { Collection } from "../../Collections/Collection";
import { TestCollection } from "./TestCollection";

/**
 * Registers tests for the {@link Collection `Collection<TKey, TValue>`} class.
 */
export function CollectionTests(): void
{
    suite(
        nameof(Collection),
        () =>
        {
            let random: Random;
            let randomMap: Array<[string, number]>;
            let collection: Collection<string, number>;

            suiteSetup(
                () =>
                {
                    random = new Random();
                    randomMap = [];

                    for (let i = random.integer(1, 10); i > 0; i--)
                    {
                        randomMap.push([random.string(10), random.int32()]);
                    }
                });

            setup(
                () =>
                {
                    collection = new TestCollection(randomMap);
                });

            suite(
                nameof<Collection<any, any>>((collection) => collection.Count),
                () =>
                {
                    test(
                        `Checking whether \`${nameof<Collection<any, any>>((c) => c.Count)}\` returns the number of entries…`,
                        () =>
                        {
                            strictEqual(randomMap.length, collection.Count);
                        });
                });

            suite(
                nameof<Collection<any, any>>((collection) => collection.Keys),
                () =>
                {
                    test(
                        "Checking whether all keys are present…",
                        () =>
                        {
                            ok(
                                randomMap.every(
                                    (entry) =>
                                    {
                                        return collection.Keys.includes(entry[0]);
                                    }));
                        });
                });

            suite(
                nameof<Collection<any, any>>((collection) => collection.Values),
                () =>
                {
                    test(
                        "Checking whether all values are present…",
                        () =>
                        {
                            ok(
                                randomMap.every(
                                    (entry) =>
                                    {
                                        return collection.Values.includes(entry[1]);
                                    }));
                        });
                });
        });
}
