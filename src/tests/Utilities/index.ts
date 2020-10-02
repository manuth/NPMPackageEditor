import { JSONObjectTests } from "./JSONObject.test";

/**
 * Registers tests for utilities.
 */
export function UtilityTests(): void
{
    suite(
        "Utilities",
        () =>
        {
            JSONObjectTests();
        });
}
