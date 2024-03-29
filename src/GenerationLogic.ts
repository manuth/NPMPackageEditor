/**
 * Represents a logic for generating properties.
 */
export enum GenerationLogic
{
    /**
     * Indicates that properties should be generated if they do not equal `null`.
     */
    Default,

    /**
     * Indicates that properties should be generated if they do not equal `null`.
     */
    NonNull = Default,

    /**
     * Indicates that properties should be generated if they aren't empty.
     */
    NonEmpty,

    /**
     * Indicates that properties should be generated if they are truthy.
     */
    Truthy,

    /**
     * Indicates that properties always should be added regardless of their values.
     */
    Always
}
