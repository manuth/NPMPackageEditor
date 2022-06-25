import { Dictionary } from "../Collections/Dictionary.js";
import { List } from "../Collections/List.js";

/**
 * Represents a set of dependencies.
 */
export interface IDependencyCollection
{
    /**
     * Gets the normal dependencies.
     */
    readonly Dependencies: Dictionary<string, string>;

    /**
     * Gets the dependencies for development purposes.
     */
    readonly DevelopmentDependencies: Dictionary<string, string>;

    /**
     * Gets the peer-dependencies.
     */
    readonly PeerDependencies: Dictionary<string, string>;

    /**
     * Gets the optional dependencies.
     */
    readonly OptionalDependencies: Dictionary<string, string>;

    /**
     * Gets all normal, optional and development dependencies.
     */
    readonly AllDependencies: Dictionary<string, string>;

    /**
     * Gets a set of dependencies to include into `.tgz`-packages.
     */
    readonly BundledDependencies: List<string>;

    /**
     * Registers dependencies from the specified {@link collection `collection`}.
     *
     * @param collection
     * The collection to register.
     *
     * @param overwrite
     * A value indicating whether existing dependencies should be overwritten.
     */
    Register(collection: IDependencyCollection, overwrite?: boolean): void;
}
