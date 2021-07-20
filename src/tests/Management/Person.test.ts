import { strictEqual } from "assert";
import stringify = require("stringify-author");
import { IPerson } from "../../Management/IPerson";
import { Person } from "../../Management/Person";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link Person `Person`} class.
 *
 * @param context
 * The test-context.
 */
export function PersonTests(context: TestContext): void
{
    suite(
        nameof(Person),
        () =>
        {
            let person: Person;
            let personOptions: IPerson;

            /**
             * Asserts the options of the {@link person `person`} variable.
             *
             * @param personOptions
             * The person-options to assert.
             */
            function AssertPerson(personOptions: IPerson): void
            {
                strictEqual(person.Name, personOptions.name);
                strictEqual(person.EMail, personOptions.email);
                strictEqual(person.URL, personOptions.url);
            }

            suiteSetup(
                () =>
                {
                    personOptions = {
                        name: context.Random.string(10),
                        email: context.Random.string(10),
                        url: context.Random.string(10)
                    };
                });

            setup(
                () =>
                {
                    person = new Person(personOptions);
                });

            suite(
                nameof(Person.constructor),
                () =>
                {
                    suite(
                        `Initializing a \`${nameof(Person)}\` using an \`${nameof(Object)}\`…`,
                        () =>
                        {
                            test(
                                "Checking whether the object is created correctly…",
                                () =>
                                {
                                    AssertPerson(personOptions);
                                });
                        });

                    suite(
                        `Initializing a \`${nameof(Person)}\` using an \`${nameof(String)}\`…`,
                        () =>
                        {
                            setup(
                                () =>
                                {
                                    new Person(stringify(personOptions));
                                });

                            test(
                                "Checking whether the text is parsed correctly…",
                                () =>
                                {
                                    AssertPerson(personOptions);
                                });
                        });
                });

            suite(
                nameof<Person>((person) => person.ToJSON),
                () =>
                {
                    test(
                        `Checking whether this method returns \`${null}\` for persons without any information…`,
                        () =>
                        {
                            person = new Person("");
                            strictEqual(person.ToJSON(), null);
                        });

                    test(
                        "Checking whether the person is represented correctly…",
                        () =>
                        {
                            strictEqual(person.ToJSON(), stringify(personOptions));
                        });
                });
        });
}
