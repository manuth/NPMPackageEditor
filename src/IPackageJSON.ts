import { IPackageMetadata } from "./IPackageMetadata";

/**
 * Represents the content of a `package.json` file.
 */
export interface IPackageJSON extends IPackageMetadata
{
    /**
     * A set of additional properties.
     */
    [key: string]: any;
}
