import { strictEqual } from "assert";
import { Random } from "random-js";
import stringify = require("stringify-author");
import { IPerson } from "../../Management/IPerson";
import { Person } from "../../Management/Person";

/**
 * Registers tests for the {@link Person `Person`} class.
 */
export function PersonTests(): void
{
    suite(
        nameof(Person),
        () =>
        {
            let random: Random;
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
                    random = new Random();

                    personOptions = {
                        name: random.string(10),
                        email: random.string(10),
                        url: random.string(10)
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
                    test(
                        "Checking whether the object is created correctly…",
                        () =>
                        {
                            AssertPerson(personOptions);
                        });
                });

            suite(
                nameof(Person.constructor),
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

            suite(
                nameof<Person>((person) => person.ToJSON),
                () =>
                {
                    test(
                        "Checking whether this method returns `null` for persons without any information…",
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
