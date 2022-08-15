/**
 * Represents an environment for resolving module-paths.
 */
export type ResolveEnvironment = "node" | "node-addons" | "import" | "require" | "types" | "default" | (string & {})