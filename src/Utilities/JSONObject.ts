import { isNullOrUndefined } from "util";

/**
 * Represents a json-object.
 */
export class JSONObject<T extends Record<never, never> = Record<string, unknown>>
{
    /**
     * The internal object.
     */
    private object: Partial<T> = {};

    /**
     * Adds a property to the object.
     *
     * @param key
     * The key of the property to add.
     *
     * @param value
     * The value of the property to add.
     */
    public Add<TKey extends keyof T>(key: TKey, value: T[TKey]): void
    {
        this.object[key] = value;
    }

    /**
     * Adds a property to the object if the `value` is not null.
     *
     * @param key
     * The key of the property to add.
     *
     * @param value
     * The value of the property to add.
     */
    public AddIfNotNull<TKey extends keyof T>(key: TKey, value: T[TKey]): void
    {
        if (!isNullOrUndefined(value))
        {
            this.Add(key, value);
        }
    }

    /**
     * Adds a property to the object if the `value` is not empty.
     *
     * @param key
     * The key of the property to add.
     *
     * @param value
     * The value of the property to add.
     */
    public AddIfNotEmpty<TKey extends keyof T>(key: TKey, value: T[TKey]): void
    {
        let isEmpty = false;

        switch (typeof value)
        {
            case "object":
                if (Array.isArray(value))
                {
                    isEmpty = value.length === 0;
                }
                else
                {
                    isEmpty = Object.keys(value).length === 0;
                }
                break;
        }

        if (!isEmpty)
        {
            this.AddIfNotNull(key, value);
        }
    }

    /**
     * Gets a JSON-object representing this object.
     *
     * @returns
     * A JSON-object representing this object.
     */
    public ToJSON(): Partial<T>
    {
        return this.object;
    }
}
