import { CollectionTests } from "./Collections";
import { ManagementTests } from "./Management";
import { PackageTests } from "./Package.test";
import { TestContext } from "./TestContext";
import { UtilityTests } from "./Utilities";

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
