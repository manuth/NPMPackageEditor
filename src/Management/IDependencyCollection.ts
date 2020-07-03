import { Dictionary } from "../Collections/Dictionary";

/**
 * Represents a set of dependencies.
 */
export interface IDependencyCollection
{
    /**
     * Gets a set of dependencies.
     */
    readonly Dependencies: Dictionary<string, string>;

    /**
     * Gets a set dependencies for development purposes.
     */
    readonly DevelpomentDependencies: Dictionary<string, string>;

    /**
     * Gets a set of peer-dependencies.
     */
    readonly PeerDependencies: Dictionary<string, string>;

    /**
     * Gets a set of optional dependencies.
     */
    readonly OptionalDependencies: Dictionary<string, string>;

    /**
     * Gets a set of dependencies to include into `.tgz`-packages.
     */
    readonly BundledDependencies: string[];

    /**
     * Registers dependencies from another `collection`.
     *
     * @param collection
     * The collection to register.
     */
    Register(collection: IDependencyCollection): void;
}
