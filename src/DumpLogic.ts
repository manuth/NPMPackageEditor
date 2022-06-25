// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONObject as JSONObjectClass } from "./Utilities/JSONObject.js";

/**
 * Represents a logic for dumping properties.
 */
export enum DumpLogic
{
    /**
     * Indicates a plain object-dump.
     */
    Default,

    /**
     * Indicates a plain object-dump.
     */
    Plain = Default,

    /**
     * Indicates a dump using the {@link JSONObjectClass `JSONObject`}'s {@link JSONObjectClass.ToJSON `ToJSON`}-method.
     */
    JSONObject,

    /**
     * Indicates a dump of an array of {@link JSONObjectClass `JSONObject`}s using their {@link JSONObjectClass.ToJSON `ToJSON`}-method.
     */
    JSONObjectArray
}
