/**
 * Represents a directory-structure of a package.
 */
export interface IDirectoryStructure
{
    /**
     * The location of the library-files.
     *
     * @see https://docs.npmjs.com/files/package.json#directorieslib
     */
    lib?: string;

    /**
     * The location of the executable files to add to `bin`.
     *
     * @see https://docs.npmjs.com/files/package.json#directoriesbin
     */
    bin?: string;

    /**
     * The location of the man-pages.
     *
     * @see https://docs.npmjs.com/files/package.json#directoriesman
     */
    man?: string;

    /**
     * The location of the docs.
     *
     * @see https://docs.npmjs.com/files/package.json#directoriesdoc
     */
    doc?: string;

    /**
     * The location of the example-scripts.
     *
     * @see https://docs.npmjs.com/files/package.json#directoriesexample
     */
    example?: string;

    /**
     * The location of the test-files.
     *
     * @see https://docs.npmjs.com/files/package.json#directoriestest
     */
    test?: string;
}
