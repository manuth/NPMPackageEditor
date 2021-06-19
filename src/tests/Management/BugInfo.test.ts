import { ok, strictEqual } from "assert";
import { Random } from "random-js";
import { BugInfo } from "../../Management/BugInfo";
import { IBugInfo } from "../../Management/IBugInfo";

/**
 * Registers tests for the {@link BugInfo `BugInfo`} class.
 */
export function BugInfoTests(): void
{
    suite(
        "BugInfo",
        () =>
        {
            let random: Random;
            let bugInfo: BugInfo;
            let bugInfoOptions: IBugInfo;

            suiteSetup(
                () =>
                {
                    random = new Random();

                    bugInfoOptions = {
                        url: random.string(10),
                        email: random.string(10)
                    };
                });

            setup(
                () =>
                {
                    bugInfo = new BugInfo(bugInfoOptions);
                });

            suite(
                "constructor",
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
                "constructor",
                () =>
                {
                    setup(
                        () =>
                        {
                            bugInfo = new BugInfo(bugInfoOptions.url);
                        });

                    test(
                        "Checking whether the object is created as expected…",
                        () =>
                        {
                            strictEqual(bugInfo.URL, bugInfoOptions.url);
                        });
                });

            suite(
                "constructor",
                () =>
                {
                    setup(
                        () =>
                        {
                            bugInfo = new BugInfo(bugInfoOptions.url, bugInfoOptions.email);
                        });

                    test(
                        "Checking whether the object is created as expected…",
                        () =>
                        {
                            strictEqual(bugInfo.URL, bugInfoOptions.url);
                            strictEqual(bugInfo.EMail, bugInfoOptions.email);
                        });
                });

            suite(
                "ToJSON",
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
                            key = "url";
                            ok(!(key in bugInfo.ToJSON()));
                            bugInfo.URL = bugInfoOptions.url;
                            bugInfo.EMail = null;
                            key = "email";
                            ok(!(key in bugInfo.ToJSON()));
                        });

                    test(
                        "Checking whether an empty bug-info object equals `null`…",
                        () =>
                        {
                            bugInfo.URL = null;
                            bugInfo.EMail = null;
                            strictEqual(bugInfo.ToJSON(), null);
                        });
                });
        });
}
