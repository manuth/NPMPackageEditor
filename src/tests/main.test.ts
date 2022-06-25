import { CollectionTests } from "./Collections/index.js";
import { ManagementTests } from "./Management/index.js";
import { PackageTests } from "./Package.test.js";
import { TestContext } from "./TestContext.js";
import { UtilityTests } from "./Utilities/index.js";

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
