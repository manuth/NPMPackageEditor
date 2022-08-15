/**
 * Represents an environment for resolving module-paths.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ResolveEnvironment = "node" | "node-addons" | "import" | "require" | "types" | "default" | (string & {});
