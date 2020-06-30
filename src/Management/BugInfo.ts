import { isNullOrUndefined } from "util";
import { JSONObject } from "../Utilities/JSONObject";
import { IBugInfo } from "./IBugInfo";

/**
 * Provides info for reporting bugs.
 */
export class BugInfo
{
    /**
     * Gets or sets the url to report bugs.
     */
    public URL: string;

    /**
     * An email-address for reporting bugs.
     */
    public EMail: string;

    /**
     * Initializes a new instance of the `BugInfo` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `BugInfo` class.
     *
     * @param bugInfo
     * The info for reporting bugs.
     */
    public constructor(bugInfo: IBugInfo);

    /**
     * Initializes a new instance of the `BugInfo` class with the specified `url`.
     *
     * @param url
     * The url for reporting bugs.
     */
    public constructor(url: string);

    /**
     * Initializes a new instance of the `BugInfo` class with the specified `url` and `email`.
     *
     * @param url
     * The url for reporting bugs.
     *
     * @param email
     * An email-address for reporting bugs.
     */
    public constructor(url: string, email: string);

    /**
     * Initializes a new instance of the `BugInfo` class.
     *
     * @param bugInfo
     * The info for reporting bugs.
     */
    public constructor(bugInfo: string | IBugInfo);

    /**
     * Initializes a new instance of the `BugInfo` class.
     *
     * @param args
     * The arguments which have been passed.
     */
    public constructor(...args: [] | [string | IBugInfo, string?] | [])
    {
        if (typeof args[0] === "string")
        {
            this.URL = args[0] ?? null;
            this.EMail = args[1] ?? null;
        }
        else if (typeof args[0] !== "undefined")
        {
            this.URL = args[0]?.url ?? null;
            this.EMail = args[0]?.email ?? null;
        }
    }

    /**
     * Gets an object representing the bug-infos.
     *
     * @returns
     * An object representing the bug-infos.
     */
    public ToJSON(): string | IBugInfo
    {
        if (isNullOrUndefined(this.EMail))
        {
            if (isNullOrUndefined(this.URL))
            {
                return null;
            }
            else
            {
                return this.URL;
            }
        }
        else
        {
            let bugInfo = new JSONObject<IBugInfo>();
            bugInfo.AddIfNotNull("url", this.URL);
            bugInfo.AddIfNotNull("email", this.EMail);
            return bugInfo.ToJSON();
        }
    }
}
