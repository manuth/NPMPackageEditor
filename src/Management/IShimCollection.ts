/**
 * A set of browser-shims.
 */
export interface IShimCollection
{
    /**
     * A browser-shim.
     */
    [name: string]: string | boolean;
}
