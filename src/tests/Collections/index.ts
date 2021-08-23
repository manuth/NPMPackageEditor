import { basename } from "path";
import { TestContext } from "../TestContext";
import { AlphabeticalDictionaryTests } from "./AlphabeticalDictionary.test";
import { AlphabeticalListTests } from "./AlphabeticalList.test";
import { CollectionTests as RegisterCollectionTests } from "./Collection.test";
import { DictionaryTests } from "./Dictionary.test";
import { ListTests } from "./List.test";
import { PropertyDictionaryTests } from "./PropertyDictionary.test";

/**
 * Registers tests for collections.
 *
 * @param context
 * The test-context.
 */
export function CollectionTests(context: TestContext): void
{
    suite(
        basename(__dirname),
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
