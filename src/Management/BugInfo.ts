import { JSONObject } from "../Utilities/JSONObject";
import { JSONObjectBase } from "../Utilities/JSONObjectBase";
import { IBugInfo } from "./IBugInfo";

/**
 * Provides info for reporting bugs.
 */
export class BugInfo extends JSONObjectBase<IBugInfo>
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
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class.
     */
    public constructor();

    /**
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class.
     *
     * @param bugInfo
     * The info for reporting bugs.
     */
    public constructor(bugInfo: IBugInfo);

    /**
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class with the specified {@link url `url`}.
     *
     * @param url
     * The url for reporting bugs.
     */
    public constructor(url: string);

    /**
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class with the specified {@link url `url`} and {@link email `email`}.
     *
     * @param url
     * The url for reporting bugs.
     *
     * @param email
     * An email-address for reporting bugs.
     */
    public constructor(url: string, email: string);

    /**
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class.
     *
     * @param bugInfo
     * The info for reporting bugs.
     */
    public constructor(bugInfo: string | IBugInfo);

    /**
     * Initializes a new instance of the {@link BugInfo `BugInfo`} class.
     *
     * @param args
     * The arguments which have been passed.
     */
    public constructor(...args: [] | [string | IBugInfo, string?] | [])
    {
        super();

        if (typeof args[0] === "string")
        {
            this.URL = args[0] ?? null;
            this.EMail = args[1] ?? null;
        }
        else
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
    public ToJSON(): IBugInfo
    {
        if (!this.EMail && !this.URL)
        {
            return null;
        }
        else
        {
            let bugInfo = new JSONObject<IBugInfo>();
            bugInfo.AddIfNotNull(nameof<IBugInfo>((info => info.url)) as keyof IBugInfo, this.URL);
            bugInfo.AddIfNotNull(nameof<IBugInfo>((info => info.email)) as keyof IBugInfo, this.EMail);
            return bugInfo.ToJSON();
        }
    }
}
