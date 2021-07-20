import { IDependencyCollectionOptions } from "./IDependencyCollectionOptions";
import { KeyOfType } from "./KeyOfType";

/**
 * Represents lists of dependency-names.
 */
export type PackageDependencyCollectionOptions = {
    [K in KeyOfType<IDependencyCollectionOptions, Record<string, string>>]?: string[]
};
