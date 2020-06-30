/**
 * Represents a repository of a package.
 */
export interface IRepository
{
    /**
     * The type of the repository.
     */
    type: string;

    /**
     * The url to the repository.
     */
    url: string;

    /**
     * The directory of the package.
     */
    directory?: string;
}
