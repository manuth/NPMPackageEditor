import { ok, strictEqual } from "node:assert";
import { BugInfo } from "../../Management/BugInfo.js";
import { IBugInfo } from "../../Management/IBugInfo.js";
import { TestContext } from "../TestContext.js";

/**
 * Registers tests for the {@link BugInfo `BugInfo`} class.
 *
 * @param context
 * The test-context.
 */
export function BugInfoTests(context: TestContext): void
{
    suite(
        nameof(BugInfo),
        () =>
        {
            let bugInfo: BugInfo;
            let bugInfoOptions: IBugInfo;

            suiteSetup(
                () =>
                {
                    bugInfoOptions = {
                        url: context.Random.string(10),
                        email: context.Random.string(10)
                    };
                });

            setup(
                () =>
                {
                    bugInfo = new BugInfo(bugInfoOptions);
                });

            suite(
                nameof(BugInfo.constructor),
                () =>
                {
                    suite(
                        `Testing the parameterless \`${nameof(BugInfo.constructor)}\`…`,
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    bugInfo = new BugInfo();
                                });

                            test(
                                "Checking whether the object is created correctly…",
                                () =>
                                {
                                    strictEqual(bugInfo.URL, null);
                                    strictEqual(bugInfo.EMail, null);
                                });
                        });

                    suite(
                        `Testing the \`${nameof(BugInfo.constructor)}\` with one parameter…`,
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    bugInfo = new BugInfo(bugInfoOptions.url);
                                });

                            test(
                                `Checking whether the \`${nameof(Object)}\` is created as expected…`,
                                () =>
                                {
                                    strictEqual(bugInfo.URL, bugInfoOptions.url);
                                });
                        });

                    suite(
                        `Testing the \`${nameof(BugInfo.constructor)}\` with two parameters…`,
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    bugInfo = new BugInfo(bugInfoOptions.url, bugInfoOptions.email);
                                });

                            test(
                                `Checking whether the \`${nameof(Object)}\` is created as expected…`,
                                () =>
                                {
                                    strictEqual(bugInfo.URL, bugInfoOptions.url);
                                    strictEqual(bugInfo.EMail, bugInfoOptions.email);
                                });
                        });
                });

            suite(
                nameof<BugInfo>((bugInfo) => bugInfo.ToJSON),
                () =>
                {
                    test(
                        "Checking whether properties are added correctly…",
                        () =>
                        {
                            strictEqual(bugInfo.ToJSON().url, bugInfo.URL);
                            strictEqual(bugInfo.ToJSON().email, bugInfo.EMail);
                        });

                    test(
                        "Checking whether empty properties are excluded from the JSON-object…",
                        () =>
                        {
                            let key: keyof IBugInfo;
                            bugInfo.URL = null;
                            key = nameof<IBugInfo>((info) => info.url) as keyof IBugInfo;
                            ok(!(key in bugInfo.ToJSON()));
                            bugInfo.URL = bugInfoOptions.url;
                            bugInfo.EMail = null;
                            key = nameof<IBugInfo>((info) => info.email) as keyof IBugInfo;
                            ok(!(key in bugInfo.ToJSON()));
                        });

                    test(
                        `Checking whether an empty \`${nameof(BugInfo)}\`-instance equals \`${null}\`…`,
                        () =>
                        {
                            bugInfo.URL = null;
                            bugInfo.EMail = null;
                            strictEqual(bugInfo.ToJSON(), null);
                        });
                });
        });
}
