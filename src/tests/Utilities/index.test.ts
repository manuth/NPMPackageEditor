import { basename } from "node:path";
import { TestContext } from "../TestContext.js";
import { JSONObjectTests } from "./JSONObject.test.js";

/**
 * Registers tests for utilities.
 *
 * @param context
 * The test-context.
 */
export function UtilityTests(context: TestContext): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            JSONObjectTests(context);
        });
}
