import Assert = require("assert");
import { Random } from "random-js";
import { Collection } from "../../Collections/Collection";
import { TestCollection } from "./TestCollection";

suite(
    "Collection<TKey, TValue>",
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
            "int Count",
            () =>
            {
                test(
                    "Checking whether `Count` returns the number of entries…",
                    () =>
                    {
                        Assert.strictEqual(randomMap.length, collection.Count);
                    });
            });

        suite(
            "TKey[] Keys",
            () =>
            {
                test(
                    "Checking whether all keys are present…",
                    () =>
                    {
                        Assert.ok(
                            randomMap.every(
                                (entry) =>
                                {
                                    return collection.Keys.includes(entry[0]);
                                }));
                    });
            });

        suite(
            "TValue[] Values",
            () =>
            {
                test(
                    "Checking whether all values are present…",
                    () =>
                    {
                        Assert.ok(
                            randomMap.every(
                                (entry) =>
                                {
                                    return collection.Values.includes(entry[1]);
                                }));
                    });
            });
    });
