import { CollectionTests } from "./Collections";
import { ManagementTests } from "./Management";
import { PackageTests } from "./Package.test";
import { UtilityTests } from "./Utilities";

suite(
    "NPMPackageEditor",
    async () =>
    {
        CollectionTests();
        UtilityTests();
        ManagementTests();
        PackageTests();
    });
