import Assert = require("assert");
import { Random } from "random-js";
import { PropertyDictionary } from "../../Collections/PropertyDictionary";

suite(
    "PropertyDictionary",
    () =>
    {
        let random: Random;
        let randomData: Record<string, number>;
        let dictionary: PropertyDictionary<Record<string, number>>;

        suiteSetup(
            () =>
            {
                random = new Random();
                randomData = {};

                for (let i = random.integer(1, 10); i > 0; i--)
                {
                    randomData = {
                        ...randomData,
                        [random.string(i)]: random.int32()
                    };
                }
            });

        setup(
            () =>
            {
                dictionary = new PropertyDictionary(randomData);
            });

        suite(
            "constructor()",
            () =>
            {
                setup(
                    () =>
                    {
                        dictionary = new PropertyDictionary();
                    });

                test(
                    "Checking whether a `PropertyDictionary` can be created without passing arguments…",
                    () =>
                    {
                        Assert.doesNotThrow(() => new PropertyDictionary());
                    });
            });

        suite(
            "constructor(T collection)",
            () =>
            {
                test(
                    "Checking whether a `PropertyDictionary` can be created based on an object…",
                    () =>
                    {
                        Assert.strictEqual(dictionary.Count, Object.keys(randomData).length);

                        Assert.ok(
                            dictionary.Entries.every(
                                (entry) =>
                                {
                                    return randomData[entry[0]] === entry[1];
                                }));
                    });
            });
    });
