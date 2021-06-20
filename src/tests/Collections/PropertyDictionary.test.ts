import { doesNotThrow, ok, strictEqual } from "assert";
import { Random } from "random-js";
import { PropertyDictionary } from "../../Collections/PropertyDictionary";

/**
 * Registers tests for the {@link PropertyDictionary `PropertyDictionary<T>`} class.
 */
export function PropertyDictionaryTests(): void
{
    suite(
        nameof(PropertyDictionary),
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
                                `Checking whether a \`${nameof(PropertyDictionary)}\` can be created based on an object…`,
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
