/**
 * Represents a directory-structure of a package.
 */
export interface IDirectoryStructure
{
    /**
     * The location of the library-files.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories
     */
    lib?: string;

    /**
     * The location of the executable files to add to `PATH`.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directoriesbin
     */
    bin?: string;

    /**
     * The location of the man-pages.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directoriesman
     */
    man?: string;

    /**
     * The location of the docs.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories
     */
    doc?: string;

    /**
     * The location of the example-scripts.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories
     */
    example?: string;

    /**
     * The location of the test-files.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories
     */
    test?: string;
}
