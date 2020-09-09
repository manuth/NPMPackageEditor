import { AlphabeticalDictionaryTests } from "./AlphabeticalDictionary.test";
import { AlphabeticalListTests } from "./AlphabeticalList.test";
import { CollectionTests as RegisterCollectionTests } from "./Collection.test";
import { DictionaryTests } from "./Dictionary.test";
import { ListTests } from "./List.test";
import { PropertyDictionaryTests } from "./PropertyDictionary.test";

/**
 * Registers tests for collections.
 */
export function CollectionTests(): void
{
    suite(
        "Collections",
        () =>
        {
            RegisterCollectionTests();
            ListTests();
            DictionaryTests();
            PropertyDictionaryTests();
            AlphabeticalDictionaryTests();
            AlphabeticalListTests();
        });
}
