/**
 * Represents a key of a dictionary-property.
 *
 * @template T
 * The type to get keys for.
 *
 * @template TType
 * The type of the properties to get the keys for.
 */
export type KeyOfType<T, TType> = { [K in keyof T]: T[K] extends TType ? K : never }[keyof T];
