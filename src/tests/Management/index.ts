import { basename } from "path";
import { TestContext } from "../TestContext";
import { BugInfoTests } from "./BugInfo.test";
import { DependencyCollectionTests } from "./DependencyCollection.test";
import { PackageDependencyCollectionTests } from "./PackageDependencyCollection.test";
import { PersonTests } from "./Person.test";

/**
 * Registers tests for management-components.
 *
 * @param context
 * The test-context.
 */
export function ManagementTests(context: TestContext): void
{
    suite(
        basename(__dirname),
        async () =>
        {
            BugInfoTests(context);
            PersonTests(context);
            DependencyCollectionTests(context);
            PackageDependencyCollectionTests(context);
        });
}
