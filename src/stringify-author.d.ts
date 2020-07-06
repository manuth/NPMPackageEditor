declare module "stringify-author"
{
    /**
     * Represents a person.
     */
    interface IPerson
    {
        /**
         * The name of the person.
         */
        name?: string;

        /**
         * The mail-address of the person.
         */
        email?: string;

        /**
         * The url to the website of the person.
         */
        url?: string;
    }

    /**
     * Converts the specified `person` to a string.
     *
     * @param person
     * The person to convert.
     *
     * @returns
     * A string representing the specified `person`.
     */
    function StringifyAuthor(person: IPerson): string;

    export = StringifyAuthor;
}
