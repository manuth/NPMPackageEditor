import { IDependencyCollectionOptions } from "./IDependencyCollectionOptions.js";
import { KeyOfType } from "./KeyOfType.js";

/**
 * Represents lists of dependency-names.
 */
export type PackageDependencyCollectionOptions = {
    [K in KeyOfType<IDependencyCollectionOptions, Record<string, string>>]?: string[]
};
