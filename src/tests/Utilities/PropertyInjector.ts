import { JSONObject } from "../../Utilities/JSONObject";

/**
 * Provides the functionality to inject values into `JSONObject`s.
 */
export type PropertyInjector<T extends Record<never, never>> =
    /**
     * Injects a property with the specified `value`.
     *
     * @param jsonObject
     * The json-object to inject the property into.
     *
     * @param key
     * The key of the property to inject.
     *
     * @param value
     * The value of the property to inject.
     */
    <TKey extends keyof T>(jsonObject: JSONObject, key: TKey, value: T[TKey]) => void;
