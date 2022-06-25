import { basename } from "node:path";
import { TestContext } from "../TestContext.js";
import { AlphabeticalDictionaryTests } from "./AlphabeticalDictionary.test.js";
import { AlphabeticalListTests } from "./AlphabeticalList.test.js";
import { CollectionTests as RegisterCollectionTests } from "./Collection.test.js";
import { DictionaryTests } from "./Dictionary.test.js";
import { ListTests } from "./List.test.js";
import { PropertyDictionaryTests } from "./PropertyDictionary.test.js";

/**
 * Registers tests for collections.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            RegisterCollectionTests(context);
            ListTests(context);
            DictionaryTests(context);
            PropertyDictionaryTests(context);
            AlphabeticalDictionaryTests(context);
            AlphabeticalListTests(context);
        });
}
