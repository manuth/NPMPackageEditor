import { Dictionary } from "../Collections/Dictionary";
import { GenerationLogic } from "../GenerationLogic";
import { IPackageMetadata } from "../IPackageMetadata";
import { IPerson } from "../Management/IPerson";
import { Person } from "../Management/Person";
import { Package } from "../Package";

/**
 * Provides an implementation of the `Package` class for testing.
 */
export class TestPackage extends Package
{
    /**
     * @inheritdoc
     */
    public get PropertyMap(): Array<[keyof IPackageMetadata, keyof Package]>
    {
        return super.PropertyMap;
    }

    /**
     * @inheritdoc
     */
    public get GenerationLogics(): Map<keyof IPackageMetadata, GenerationLogic>
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
    public LoadObject(object: any): any
    {
        return super.LoadObject(object);
    }

    /**
     * @inheritdoc
     *
     * @param collection
     * The collection to load.
     *
     * @returns
     * The loaded dictionary.
     */
    public LoadDictionary<T>(collection: T): Dictionary<keyof T, T[keyof T]>
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
    public LoadPerson(person: IPerson | string): Person
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
    public LoadPersonList(personList: Array<IPerson | string>): Person[]
    {
        return super.LoadPersonList(personList);
    }
}
