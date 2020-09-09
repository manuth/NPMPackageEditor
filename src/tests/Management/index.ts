import { BugInfoTests } from "./BugInfo.test";
import { DependencyCollectionTests } from "./DependencyCollection.test";
import { PersonTests } from "./Person.test";

/**
 * Registers tests for management-components.
 */
export function ManagementTests(): void
{
    suite(
        "Management",
        async () =>
        {
            BugInfoTests();
            PersonTests();
            DependencyCollectionTests();
        });
}
