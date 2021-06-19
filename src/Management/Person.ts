import parse = require("parse-author");
import stringify = require("stringify-author");
import { JSONObjectBase } from "../Utilities/JSONObjectBase";
import { IPerson } from "./IPerson";

/**
 * Represents a person.
 */
export class Person extends JSONObjectBase<string>
{
    /**
     * Gets or sets the name of the person.
     */
    public Name: string;

    /**
     * Gets or sets the email-address of the person.
     */
    public EMail: string;

    /**
     * Gets or sets the url to the website of the person.
     */
    public URL: string;

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

        this.Name = info.name ?? null;
        this.EMail = info.email ?? null;
        this.URL = info.url ?? null;
    }

    /**
     * Gets a json-object representing the person.
     *
     * @returns
     * A json-object representing the person.
     */
    public ToJSON(): string
    {
        let result = stringify(
            {
                name: this.Name,
                email: this.EMail,
                url: this.URL
            });

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
