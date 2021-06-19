/**
 * Represents a collection of dependencies.
 */
export interface IDependencyCollectionOptions
{
    /**
     * A set of dependencies of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
     */
    dependencies?: Record<string, string>;

    /**
     * A set of development-dependencies of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#devdependencies
     */
    devDependencies?: Record<string, string>;

    /**
     * A set of peer-dependencies of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependencies
     */
    peerDependencies?: Record<string, string>;

    /**
     * A set of optional dependencies of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#optionaldependencies
     */
    optionalDependencies?: Record<string, string>;

    /**
     * A set of dependencies to include into `.tgz`-packages.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bundleddependencies
     */
    bundledDependencies?: string[];
}
