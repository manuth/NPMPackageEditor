import { ok, strictEqual } from "assert";
import { Collection } from "../../Collections/Collection.js";
import { TestContext } from "../TestContext.js";
import { TestCollection } from "./TestCollection.js";

/**
 * Registers tests for the {@link Collection `Collection<TKey, TValue>`} class.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext): void
{
    suite(
        nameof(Collection),
        () =>
        {
            let randomMap: Array<[string, number]>;
            let collection: Collection<string, number>;

            suiteSetup(
                () =>
                {
                    randomMap = [];

                    for (let i = context.Random.integer(1, 10); i > 0; i--)
                    {
                        randomMap.push([context.Random.string(10), context.Random.int32()]);
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
