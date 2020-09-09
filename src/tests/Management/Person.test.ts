import Assert = require("assert");
import { Random } from "random-js";
import StringifyAuthor = require("stringify-author");
import { IPerson } from "../../Management/IPerson";
import { Person } from "../../Management/Person";

/**
 * Registers tests for the `Person` class.
 */
export function PersonTests(): void
{
    suite(
        "Person",
        () =>
        {
            let random: Random;
            let person: Person;
            let personOptions: IPerson;

            /**
             * Âsserts the options of the `person` variable.
             *
             * @param personOptions
             * The person-options to assert.
             */
            function AssertPerson(personOptions: IPerson): void
            {
                Assert.strictEqual(person.Name, personOptions.name);
                Assert.strictEqual(person.EMail, personOptions.email);
                Assert.strictEqual(person.URL, personOptions.url);
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
                "constructor",
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
                "constructor",
                () =>
                {
                    setup(
                        () =>
                        {
                            new Person(StringifyAuthor(personOptions));
                        });

                    test(
                        "Checking whether the text is parsed correctly…",
                        () =>
                        {
                            AssertPerson(personOptions);
                        });
                });

            suite(
                "ToJSON",
                () =>
                {
                    test(
                        "Checking whether this method returns `null` for persons without any information…",
                        () =>
                        {
                            person = new Person("");
                            Assert.strictEqual(person.ToJSON(), null);
                        });

                    test(
                        "Checking whether the person is represented correctly…",
                        () =>
                        {
                            Assert.strictEqual(person.ToJSON(), StringifyAuthor(personOptions));
                        });
                });
        });
}
