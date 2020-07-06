declare module "readme-filename"
{
    /**
     * Determines the path to a `README` file.
     *
     * @param root
     * The root to look for the `README` file.
     *
     * @returns
     * The path to the `README` file.
     */
    function readmeFilename(root: string): Promise<string>;

    export = readmeFilename;
}
