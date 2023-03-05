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
                                    strictEqual(bugInfo.URL, undefined);
                                    strictEqual(bugInfo.EMail, undefined);
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
                            strictEqual(bugInfo.ToJSON()?.url, bugInfo.URL);
                            strictEqual(bugInfo.ToJSON()?.email, bugInfo.EMail);
                        });

                    test(
                        "Checking whether empty properties are excluded from the JSON-object…",
                        () =>
                        {
                            let keyMap: Array<[keyof BugInfo, keyof IBugInfo]> = [
                                [
                                    nameof<BugInfo>((info) => info.EMail) as any,
                                    nameof<IBugInfo>((info) => info.email) as any
                                ],
                                [
                                    nameof<BugInfo>((info) => info.URL) as any,
                                    nameof<IBugInfo>((info) => info.url) as any
                                ]
                            ];

                            for (let currentEntry of keyMap)
                            {
                                for (let entry of keyMap)
                                {
                                    (bugInfo as any)[entry[0]] = undefined;
                                }

                                (bugInfo as any)[currentEntry[0]] = bugInfoOptions[currentEntry[1]];
                                let result = bugInfo.ToJSON();

                                ok(result);

                                for (let entry of keyMap)
                                {
                                    if (entry[1] !== currentEntry[1])
                                    {
                                        ok(!(entry[1] in result));
                                    }
                                }

                                ok(currentEntry[1] in result);
                            }
                        });

                    test(
                        `Checking whether an empty \`${nameof(BugInfo)}\`-instance equals \`${null}\`…`,
                        () =>
                        {
                            bugInfo.URL = undefined;
                            bugInfo.EMail = undefined;
                            strictEqual(bugInfo.ToJSON(), null);
                        });
                });
        });
}
