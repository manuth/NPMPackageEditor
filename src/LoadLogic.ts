/**
 * Represents a logic for loading properties.
 */
export enum LoadLogic
{
    /**
     * Indicates that the value isn't assigned.
     */
    None,

    /**
     * Indicates a plain assignment.
     */
    Plain,

    /**
     * Indicates the generation of a dictionary.
     */
    Dictionary,

    /**
     * Indicates the generation of a person-object.
     */
    Person,

    /**
     * Indicates the generation of a person-list.
     */
    PersonList,

    /**
     * Indicates the generation of a bug-info object.
     */
    BugInfo
}
