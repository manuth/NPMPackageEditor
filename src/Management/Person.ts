import parse from "parse-author";
import stringify from "stringify-author";
import { JSONObjectBase } from "../Utilities/JSONObjectBase.js";
import { IPerson } from "./IPerson.js";

/**
 * Represents a person.
 */
export class Person extends JSONObjectBase<string | null>
{
    /**
     * Gets or sets the name of the person.
     */
    public Name: string;

    /**
     * Gets or sets the email-address of the person.
     */
    public EMail?: string;

    /**
     * Gets or sets the url to the website of the person.
     */
    public URL?: string;

    /**
     * Initializes a new instance of the {@link Person `Person`} class.
     *
     * @param person
     * An object containing info about the person.
     */
    public constructor(person: IPerson);

    /**
     * Initializes a new instance of the {@link Person `Person`} class.
     *
     * @param person
     * A string containing info about the person.
     */
    public constructor(person: string);

    /**
     * Initializes a new instance of the {@link Person `Person`} class.
     *
     * @param person
     * A variable containing info about the person.
     */
    public constructor(person: string | IPerson);

    /**
     * Initializes a new instance of the {@link Person `Person`} class.
     *
     * @param person
     * A variable containing info about the person.
     */
    public constructor(person: string | IPerson)
    {
        super();
        let info: IPerson;

        if (typeof person === "string")
        {
            info = parse(person) as IPerson;
        }
        else
        {
            info = person;
        }

        this.Name = info.name;
        this.EMail = info.email;
        this.URL = info.url;
    }

    /**
     * Gets a json-object representing the person.
     *
     * @returns
     * A json-object representing the person.
     */
    public ToJSON(): string | null
    {
        let person: IPerson = {
            name: this.Name,
            email: this.EMail,
            url: this.URL
        };

        let result = stringify(person);

        if (result.length === 0)
        {
            return null;
        }
        else
        {
            return result;
        }
    }
}
