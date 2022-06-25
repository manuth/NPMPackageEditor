import { CollectionTests } from "./Collections/index.test.js";
import { ManagementTests } from "./Management/index.test.js";
import { PackageTests } from "./Package.test.js";
import { TestContext } from "./TestContext.js";
import { UtilityTests } from "./Utilities/index.test.js";

suite(
    "NPMPackageEditor",
    () =>
    {
        let context = new TestContext();
        CollectionTests(context);
        UtilityTests(context);
        ManagementTests(context);
        PackageTests(context);
    });
