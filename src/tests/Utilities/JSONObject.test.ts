import Assert = require("assert");
import { isNullOrUndefined } from "util";
import { Random } from "random-js";
import { IPerson } from "../../Management/IPerson";
import { JSONObject } from "../../Utilities/JSONObject";
import { PropertyInjector } from "./PropertyInjector";

/**
 * Registers tests for the `JSONObject` class.
 */
export function JSONObjectTests(): void
{
    suite(
        "JSONObject",
        () =>
        {
            let random: Random;
            let jsonObject: JSONObject<ITest>;
            let options: IPerson;
            let randomKeyGenerator: Generator<keyof IPerson, keyof IPerson>;
            let randomKey: keyof IPerson;
            let randomValue: string;
            let objectKey = "object" as const;
            let arrayKey = "array" as const;

            /**
             * Represents a test-interface.
             */
            interface ITest extends IPerson
            {
                /**
                 * A test-object.
                 */
                [objectKey]: Record<string, any>;

                /**
                 * A test-array.
                 */
                [arrayKey]: any[];
            }

            suiteSetup(
                () =>
                {
                    random = new Random();
                    randomKeyGenerator = (
                        function* ble()
                        {
                            while (true)
                            {
                                yield random.pick(Object.keys(options)) as keyof IPerson;
                            }
                        })();

                    options = {
                        name: "",
                        email: "",
                        url: ""
                    };
                });

            setup(
                () =>
                {
                    jsonObject = new JSONObject();
                    randomKey = randomKeyGenerator.next().value;
                    randomValue = random.string(10);
                });

            /**
             * Asserts whether nullish values are present in the `jsonObject` object.
             *
             * @param propertyInjector
             * A method for injecting properties.
             *
             * @param present
             * A value indicating whether nullish values are supposed to be present.
             */
            function AssertNullishPresence(propertyInjector: PropertyInjector<ITest>, present: boolean): void
            {
                for (let value of [undefined, null, randomValue])
                {
                    AssertPropertyPresence(propertyInjector, randomKeyGenerator.next().value, value, !isNullOrUndefined(value) || present);
                }
            }

            /**
             * Asserts the presence of a property.
             *
             * @param propertyInjector
             * A method for injecting properties.
             *
             * @param key
             * The key of the property to add.
             *
             * @param value
             * The value of the property to add.
             *
             * @param present
             * A value indicating whether the property is supposed to be present.
             */
            function AssertPropertyPresence<TKey extends keyof ITest>(propertyInjector: PropertyInjector<ITest>, key: TKey, value: ITest[TKey], present: boolean): void
            {
                propertyInjector(jsonObject, key, value);
                Assert.strictEqual(key in jsonObject.ToJSON(), present);

                if (jsonObject.Has(key))
                {
                    jsonObject.Remove(key);
                }
            }

            suite(
                "constructor",
                () =>
                {
                    setup(
                        () =>
                        {
                            jsonObject = new JSONObject(
                                {
                                    [randomKey]: randomValue
                                });
                        });

                    test(
                        "Checking whether base-values are loaded correctly…",
                        () =>
                        {
                            Assert.strictEqual(jsonObject.ToJSON()[randomKey], randomValue);
                        });
                });

            suite(
                "Add",
                () =>
                {
                    test(
                        "Checking whether new properties can be added…",
                        () =>
                        {
                            jsonObject.Add(randomKey, randomValue);
                            Assert.strictEqual(jsonObject.ToJSON()[randomKey], randomValue);
                        });

                    test(
                        "Checking whether `null` and `undevined`-values presist…",
                        () =>
                        {
                            AssertNullishPresence((object, key, value) => object.Add(key, value), true);
                        });
                });

            suite(
                "AddIfNotNull",
                () =>
                {
                    test(
                        "Checking whether properties are added only if the value neither equals `null` nor `undefined`…",
                        () =>
                        {
                            AssertNullishPresence((object, key, value) => object.AddIfNotNull(key, value), false);
                        });
                });

            suite(
                "AddIfNotEmpty",
                () =>
                {
                    let propertyInjector: PropertyInjector<ITest>;

                    suiteSetup(
                        () =>
                        {
                            propertyInjector = (object, key, value) => object.AddIfNotEmpty(key, value);
                        });

                    /**
                     * Asserts the presence of an `object` after adding it as a property.
                     *
                     * @param object
                     * The object to inject into the `jsonObject`.
                     *
                     * @param present
                     * A value indicating whether the property is expected to be present.
                     */
                    function AssertObjectPresence(object: Record<string, any>, present: boolean): void
                    {
                        AssertPropertyPresence(propertyInjector, objectKey, object, present);
                    }

                    /**
                     * Asserts the presence of an `array` after adding it as a property.
                     *
                     * @param array
                     * The array to inject into the `jsonObject`.
                     *
                     * @param present
                     * A value indicating whether the property is expected to be present.
                     */
                    function AssertArrayPresence(array: any[], present: boolean): void
                    {
                        AssertPropertyPresence(propertyInjector, arrayKey, array, present);
                    }

                    test(
                        "Checking whether objects are only added if they have at least one property…",
                        () =>
                        {
                            AssertObjectPresence({}, false);
                            AssertObjectPresence({ [randomKey]: "" }, true);
                        });

                    test(
                        "Checking whether arrays are only added if they have at least one item…",
                        () =>
                        {
                            AssertArrayPresence([], false);
                            AssertArrayPresence([""], true);
                        });

                    test(
                        "Checking whether other sorts of properties are added only if they neither equal `null` nor `undefined`…",
                        () =>
                        {
                            AssertNullishPresence(propertyInjector, false);
                        });
                });

            suite(
                "Has",
                () =>
                {
                    test(
                        "Checking whether properties are checked for existence correctly…",
                        () =>
                        {
                            Assert.ok(!jsonObject.Has(randomKey));
                            jsonObject.Add(randomKey, randomValue);
                            Assert.ok(jsonObject.Has(randomKey));
                        });
                });

            suite(
                "Remove",
                () =>
                {
                    test(
                        "Checking whether properties can be removed from the object…",
                        () =>
                        {
                            jsonObject.Add(randomKey, randomValue);
                            Assert.ok(jsonObject.Has(randomKey));
                            Assert.doesNotThrow(() => jsonObject.Remove(randomKey));
                            Assert.ok(!jsonObject.Has(randomKey));
                        });

                    test(
                        "Checking whether trying to remove an inexistent property throws an error…",
                        () =>
                        {
                            Assert.throws(() => jsonObject.Remove(randomKey));
                        });
                });
        });
}
