import { TestContext } from "../TestContext";
import { JSONObjectTests } from "./JSONObject.test";

/**
 * Registers tests for utilities.
 *
 * @param context
 * The test-context.
 */
export function UtilityTests(context: TestContext): void
{
    suite(
        "Utilities",
        () =>
        {
            JSONObjectTests(context);
        });
}
