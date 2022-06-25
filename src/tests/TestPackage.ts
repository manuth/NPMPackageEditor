import { Dictionary } from "../Collections/Dictionary.js";
import { GenerationLogic } from "../GenerationLogic.js";
import { IPackageMetadata } from "../IPackageMetadata.js";
import { IPerson } from "../Management/IPerson.js";
import { Person } from "../Management/Person.js";
import { Package } from "../Package.js";

/**
 * Provides an implementation of the {@link Package `Package`} class for testing.
 */
export class TestPackage extends Package
{
    /**
     * @inheritdoc
     */
    public override get PropertyMap(): Map<keyof IPackageMetadata, keyof Package>
    {
        return super.PropertyMap;
    }

    /**
     * @inheritdoc
     */
    public override get GenerationLogics(): Map<keyof IPackageMetadata, GenerationLogic>
    {
        return super.GenerationLogics;
    }

    /**
     * @inheritdoc
     *
     * @param object
     * The object to load.
     *
     * @returns
     * The loaded object.
     */
    public override LoadObject(object: any): any
    {
        return super.LoadObject(object);
    }

    /**
     * @inheritdoc
     *
     * @template T
     * The type of the collection to load.
     *
     * @param collection
     * The collection to load.
     *
     * @returns
     * The loaded dictionary.
     */
    public override LoadDictionary<T>(collection: T): Dictionary<keyof T, T[keyof T]>
    {
        return super.LoadDictionary(collection);
    }

    /**
     * @inheritdoc
     *
     * @param person
     * The person to load.
     *
     * @returns
     * The loaded person.
     */
    public override LoadPerson(person: IPerson | string): Person
    {
        return super.LoadPerson(person);
    }

    /**
     * @inheritdoc
     *
     * @param personList
     * The person-list to load.
     *
     * @returns
     * The loaded list.
     */
    public override LoadPersonList(personList: Array<IPerson | string>): Person[]
    {
        return super.LoadPersonList(personList);
    }
}
