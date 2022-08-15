import { ResolveEnvironment } from "./ResolveEnvironment.js";

/**
 * Represents a matrix for providing information on how to resolve modules.
 */
export type ResolveMatrix = {
    /**
     * A path or a path-matrix for resolving modules.
     */
    [P in ResolveEnvironment]?: string | ResolveMatrix;
};
