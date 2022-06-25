import { basename } from "node:path";
import { TestContext } from "../TestContext.js";
import { BugInfoTests } from "./BugInfo.test.js";
import { DependencyCollectionTests } from "./DependencyCollection.test.js";
import { PackageDependencyCollectionTests } from "./PackageDependencyCollection.test.js";
import { PersonTests } from "./Person.test.js";

/**
 * Registers tests for management-components.
 *
 * @param context
 * The test-context.
 */
export function ManagementTests(context: TestContext): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        async () =>
        {
            BugInfoTests(context);
            PersonTests(context);
            DependencyCollectionTests(context);
            PackageDependencyCollectionTests(context);
        });
}
