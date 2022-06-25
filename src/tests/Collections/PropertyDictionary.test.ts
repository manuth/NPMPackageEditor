import { doesNotThrow, ok, strictEqual } from "node:assert";
import { PropertyDictionary } from "../../Collections/PropertyDictionary.js";
import { TestContext } from "../TestContext.js";

/**
 * Registers tests for the {@link PropertyDictionary `PropertyDictionary<T>`} class.
 *
 * @param context
 * The test-context.
 */
export function PropertyDictionaryTests(context: TestContext): void
{
    suite(
        nameof(PropertyDictionary),
        () =>
        {
            let randomData: Record<string, number>;
            let dictionary: PropertyDictionary<Record<string, number>>;

            suiteSetup(
                () =>
                {
                    randomData = {};

                    for (let i = context.Random.integer(1, 10); i > 0; i--)
                    {
                        randomData = {
                            ...randomData,
                            [context.Random.string(i)]: context.Random.int32()
                        };
                    }
                });

            setup(
                () =>
                {
                    dictionary = new PropertyDictionary(randomData);
                });

            suite(
                nameof(PropertyDictionary.constructor),
                () =>
                {
                    suite(
                        `Initializing a \`${nameof(PropertyDictionary.constructor)}\` without any parameters…`,
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    dictionary = new PropertyDictionary();
                                });

                            test(
                                `Checking whether a \`${nameof(PropertyDictionary)}\` can be created without passing arguments…`,
                                () =>
                                {
                                    doesNotThrow(() => new PropertyDictionary());
                                });
                        });

                    suite(
                        `Initializing a \`${nameof(PropertyDictionary.constructor)}\` with an \`${nameof(Object)}\`…`,
                        () =>
                        {
                            test(
                                `Checking whether a \`${nameof(PropertyDictionary)}\` can be created based on an \`${nameof(Object)}\`…`,
                                () =>
                                {
                                    strictEqual(dictionary.Count, Object.keys(randomData).length);

                                    ok(
                                        dictionary.Entries.every(
                                            (entry) =>
                                            {
                                                return randomData[entry[0]] === entry[1];
                                            }));
                                });
                        });
                });
        });
}
