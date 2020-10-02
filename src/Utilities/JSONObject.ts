import { JSONObjectBase } from "./JSONObjectBase";

/**
 * Represents a json-object.
 */
export class JSONObject<T extends Record<never, never> = Record<string, unknown>> extends JSONObjectBase<Partial<T>>
{
    /**
     * The internal object.
     */
    private object: Partial<T> = {};

    /**
     * Initializes a new instance of the `JSONObject` class.
     */
    public constructor();

    /**
     * Initializes a new instance of the `JSONObject` class.
     *
     * @param base
     * The base values of the object.
     */
    public constructor(base: Partial<T>);

    /**
     * Initializes a new instance of the `JSONObject` class.
     *
     * @param base
     * The base values of the object.
     */
    public constructor(base?: Partial<T>)
    {
        super();
        this.object = { ...(base ?? {}) };
    }

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
        if (value !== null && value !== undefined)
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
                    isEmpty = Object.keys(value ?? {}).length === 0;
                }
                break;
        }

        if (!isEmpty)
        {
            this.AddIfNotNull(key, value);
        }
    }

    /**
     * Checks whether the object has a property with the specified `key`.
     *
     * @param key
     * The key of the property to check.
     *
     * @returns
     * A value indicating whether the object has a property with the specified `key`.
     */
    public Has(key: keyof T): boolean
    {
        return key in this.object;
    }

    /**
     * Removes the property with the specified `key` from the object.
     *
     * @param key
     * The key of the property to remove.
     */
    public Remove(key: keyof T): void
    {
        if (this.Has(key))
        {
            let result: Partial<T> = {};

            for (let ownKey of Object.keys(this.object) as Array<keyof T>)
            {
                if (ownKey !== key)
                {
                    result[ownKey] = this.object[ownKey];
                }
            }

            this.object = result;
        }
        else
        {
            throw new RangeError();
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
        return {
            ...this.object
        };
    }
}
