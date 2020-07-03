import Assert = require("assert");
import { platform, arch } from "os";
import { writeJSON } from "fs-extra";
import { Random } from "random-js";
import stringify = require("stringify-author");
import { TempFile } from "temp-filesystem";
import { Dictionary } from "../Collections/Dictionary";
import { GenerationLogic } from "../GenerationLogic";
import { IPackageJSON } from "../IPackageJSON";
import { BugInfo } from "../Management/BugInfo";
import { IBugInfo } from "../Management/IBugInfo";
import { IPerson } from "../Management/IPerson";
import { PackagePerson } from "../Management/PackagePerson";
import { Person } from "../Management/Person";
import { Package } from "../Package";
import { JSONObject } from "../Utilities/JSONObject";
import { AssertComparator } from "./AssertComparator";
import { TestPackage } from "./TestPackage";

suite(
    "Package",
    () =>
    {
        let random: Random;
        let packageJSON: IPackageJSON;
        let npmPackage: TestPackage;

        /**
         * Asserts the contents of a dictionary.
         *
         * @param actual
         * The actual dictionary.
         *
         * @param expected
         * The expected contents of the dictionary.
         */
        function AssertDictionary<TKey extends string | number | symbol, TValue>(actual: Dictionary<TKey, TValue>, expected: Record<TKey, TValue>): void
        {
            Assert.deepStrictEqual(actual.ToJSON(), expected);
        }

        /**
         * Asserts the info about a person.
         *
         * @param actual
         * The actual person.
         *
         * @param expected
         * The expected person.
         */
        function AssertPerson(actual: Person, expected: IPerson | string): void
        {
            Assert.strictEqual(actual.ToJSON(), new Person(expected).ToJSON());
        }

        /**
         * Asserts the contents of a person-list.
         *
         * @param actual
         * The actual person-list.
         *
         * @param expected
         * The expected person-list.
         */
        function AssertPersonList(actual: Person[], expected: Array<IPerson | string>): void
        {
            Assert.deepStrictEqual(actual.keys(), expected.keys());

            for (let key of expected.keys())
            {
                AssertPerson(actual[key], expected[key]);
            }
        }

        /**
         * Asserts the contents of a bug-info object.
         *
         * @param actual
         * The actual bug-info.
         *
         * @param expected
         * The expected bug-info.
         */
        function AssertBugInfo(actual: BugInfo, expected: string | IBugInfo): void
        {
            Assert.deepStrictEqual(actual.ToJSON(), new BugInfo(expected).ToJSON());
        }

        /**
         * Generates a random person.
         */
        function* RandomPersonGenerator(): Generator<IPerson, IPerson>
        {
            while (true)
            {
                yield {
                    name: random.string(10),
                    email: random.string(10),
                    url: random.string(10)
                } as IPerson;
            }
        }

        /**
         * Generates a random person.
         *
         * @returns
         * The generated person.
         */
        function GetRandomPerson(): IPerson
        {
            return RandomPersonGenerator().next().value;
        }

        suiteSetup(
            () =>
            {
                random = new Random();

                /**
                 * Generates a random text.
                 *
                 * @param length
                 * The length of the text to return.
                 *
                 * @returns
                 * A random text.
                 */
                function text(length = 15): string
                {
                    return random.string(length);
                }

                /**
                 * Generates a random digit.
                 *
                 * @returns
                 * A random digit.
                 */
                function digit(): number
                {
                    return random.integer(0, 9);
                }

                /**
                 * Generates a random person.
                 *
                 * @returns
                 * A random person.
                 */
                function person(): IPerson
                {
                    return {
                        name: text(),
                        email: "test@example.com",
                        url: text()
                    };
                }

                packageJSON = {
                    name: text(),
                    version: `${digit()}.${digit()}.${digit()}`,
                    private: random.bool(),
                    description: text(100),
                    author: person(),
                    maintainers: [
                        person(),
                        person()
                    ],
                    contributors: [
                        person(),
                        person()
                    ],
                    license: random.pick(
                        [
                            "MIT",
                            "Apache-2.0",
                            "GPL"
                        ]),
                    keywords: [
                        text(),
                        text()
                    ],
                    engines: {
                        node: "*"
                    },
                    os: [
                        platform()
                    ],
                    cpu: [
                        arch()
                    ],
                    main: "./lib/index.js",
                    types: "./lib/index.d.ts",
                    browser: text(),
                    bin: text(),
                    man: text(),
                    files: [
                        "./index.js",
                        "./example.js"
                    ],
                    directories: {
                        lib: "./lib",
                        bin: "./bin",
                        man: "./man",
                        doc: "./docs",
                        example: "./examples",
                        test: "./tests"
                    },
                    homepage: text(),
                    repository: "https://github.com/example/example.git",
                    bugs: "https://github.com/example/example/issues",
                    config: {
                        example: text()
                    },
                    publishConfig: {
                        publishExample: text()
                    },
                    scripts: {
                        test: "eslint"
                    },
                    dependencies: {
                        lodash: "*"
                    },
                    devDependencies: {
                        eslint: "7"
                    },
                    peerDependencies: {
                        typescript: "*"
                    },
                    optionalDependencies: {
                        tslint: "*"
                    },
                    bundledDependencies: [
                        "typescript"
                    ]
                };
            });

        setup(
            () =>
            {
                npmPackage = new TestPackage(packageJSON);
            });

        /**
         * Asserts the contents of the `npmPackage`.
         *
         * @param packageJSON
         * The expected meta-data.
         */
        function AssertPackageMeta(packageJSON: IPackageJSON): void
        {
            Assert.strictEqual(npmPackage.Name, packageJSON.name);
            Assert.strictEqual(npmPackage.Version, packageJSON.version);
            Assert.strictEqual(npmPackage.Private, packageJSON.private);
            Assert.strictEqual(npmPackage.Description, packageJSON.description);
            AssertPerson(npmPackage.Author, packageJSON.author);
            AssertPersonList(npmPackage.Maintainers, packageJSON.maintainers);
            AssertPersonList(npmPackage.Contributors, packageJSON.contributors);
            Assert.strictEqual(npmPackage.License, packageJSON.license);
            Assert.deepStrictEqual(npmPackage.Keywords, packageJSON.keywords);
            AssertDictionary(npmPackage.Engines, packageJSON.engines);
            Assert.deepStrictEqual(npmPackage.OS, packageJSON.os);
            Assert.deepStrictEqual(npmPackage.CPU, packageJSON.cpu);
            Assert.strictEqual(npmPackage.Main, packageJSON.main);
            Assert.strictEqual(npmPackage.Types, packageJSON.types);
            Assert.deepStrictEqual(npmPackage.Browser, packageJSON.browser);
            Assert.deepStrictEqual(npmPackage.Binaries, packageJSON.bin);
            Assert.deepStrictEqual(npmPackage.Manuals, packageJSON.man);
            Assert.deepStrictEqual(npmPackage.Files, packageJSON.files);
            Assert.deepStrictEqual(npmPackage.Directories, packageJSON.directories);
            Assert.strictEqual(npmPackage.Homepage, packageJSON.homepage);
            Assert.deepStrictEqual(npmPackage.Repository, packageJSON.repository);
            AssertBugInfo(npmPackage.Bugs, packageJSON.bugs);
            Assert.deepStrictEqual(npmPackage.Config, packageJSON.config);
            Assert.deepStrictEqual(npmPackage.PublishConfig, packageJSON.publishConfig);
            AssertDictionary(npmPackage.Scripts, packageJSON.scripts);
            AssertDictionary(npmPackage.Dependencies, packageJSON.dependencies);
            AssertDictionary(npmPackage.DevelpomentDependencies, packageJSON.devDependencies);
            AssertDictionary(npmPackage.PeerDependencies, packageJSON.peerDependencies);
            AssertDictionary(npmPackage.OptionalDependencies, packageJSON.optionalDependencies);
            Assert.deepStrictEqual(npmPackage.BundledDependencies, packageJSON.bundledDependencies);
        }

        suite(
            "constructor()",
            () =>
            {
                test(
                    "Checking whether the package can be constructed…",
                    () =>
                    {
                        Assert.doesNotThrow(
                            () =>
                            {
                                npmPackage = new TestPackage();
                            });
                    });
            });

        suite(
            "constructor(IPackageJSON packageJSON)",
            () =>
            {
                suite(
                    "Testing basic functionality…",
                    () =>
                    {
                        test(
                            "Checking whether the values are loaded correctly…",
                            () =>
                            {
                                AssertPackageMeta(packageJSON);
                            });
                    });

                suite(
                    "Checking default values…",
                    () =>
                    {
                        /**
                         * Asserts the default value of a package-porperty.
                         *
                         * @param key
                         * The key of the property to check.
                         *
                         * @param expected
                         * The expected default value.
                         *
                         * @param comparator
                         * A component for comparing the objects.
                         *
                         * @param overwriteUndefined
                         * A value indicating whether `undefined`s are being overwritten.
                         */
                        function AssertDefault<TOptionsKey extends keyof IPackageJSON, TKey extends keyof Package>(key: TKey, expected: any, comparator?: AssertComparator<Package[TKey], any>, overwriteUndefined = true): void
                        {
                            let optionsKey = new Map(npmPackage.PropertyMap.map((entry) => [entry[1], entry[0]])).get(key);
                            let packageOptions = new JSONObject(packageJSON);

                            comparator = comparator ?? (
                                (x, y) =>
                                {
                                    Assert.deepStrictEqual(x, y);
                                });

                            /**
                             * Asserts the value of a property.
                             *
                             * @param expected
                             * The expected value of the setting.
                             */
                            function AssertValue(expected: IPackageJSON[TOptionsKey]): void
                            {
                                comparator(new TestPackage(packageOptions.ToJSON())[key], expected);
                            }

                            packageOptions.Remove(optionsKey);
                            npmPackage = new TestPackage(packageOptions.ToJSON());
                            AssertValue(expected);

                            if (overwriteUndefined)
                            {
                                packageOptions.Add(optionsKey, undefined);
                                AssertValue(expected);
                            }
                        }

                        test(
                            "Checking whether default values are set as expected…",
                            () =>
                            {
                                AssertDefault("Name", null);
                                AssertDefault("Version", null);
                                AssertDefault("Private", null);
                                AssertDefault("Description", null);
                                AssertDefault("Author", {} as PackagePerson, AssertPerson);
                                AssertDefault("Maintainers", []);
                                AssertDefault("Contributors", []);
                                AssertDefault("License", null);
                                AssertDefault("Keywords", []);
                                AssertDefault("Engines", {}, AssertDictionary);
                                AssertDefault("OS", null);
                                AssertDefault("CPU", null);
                                AssertDefault("Main", null);
                                AssertDefault("Types", null);
                                AssertDefault("Browser", {});
                                AssertDefault("Binaries", {});
                                AssertDefault("Manuals", []);
                                AssertDefault("Files", null);
                                AssertDefault("Directories", {});
                                AssertDefault("Homepage", null);
                                AssertDefault("Repository", null);
                                AssertDefault("Bugs", {}, AssertBugInfo);
                                AssertDefault("Config", {});
                                AssertDefault("PublishConfig", {});
                                AssertDefault("Scripts", {}, AssertDictionary);
                                AssertDefault("Dependencies", {}, AssertDictionary);
                                AssertDefault("DevelpomentDependencies", {}, AssertDictionary);
                                AssertDefault("PeerDependencies", {}, AssertDictionary);
                                AssertDefault("OptionalDependencies", {}, AssertDictionary);
                                AssertDefault("BundledDependencies", []);
                            });
                    });
            });

        suite(
            "constructor(string path)",
            () =>
            {
                let tempFile: TempFile;

                suiteSetup(
                    async () =>
                    {
                        tempFile = new TempFile();
                        await writeJSON(tempFile.FullName, packageJSON);
                    });

                suiteTeardown(
                    () =>
                    {
                        tempFile.Dispose();
                    });

                setup(
                    () =>
                    {
                        npmPackage = new TestPackage(tempFile.FullName);
                    });

                test(
                    "Checking whether values are loaded from the `package.json` file correctly…",
                    () =>
                    {
                        AssertPackageMeta(packageJSON);
                    });
            });

        suite(
            "IPackageJSON ToJSON()",
            () =>
            {
                let generatedPackage: IPackageJSON;

                setup(
                    () =>
                    {
                        generatedPackage = npmPackage.ToJSON();
                    });

                test(
                    "Checking whether only important properties are present even if they're empty…",
                    () =>
                    {
                        let importantKeys: Array<keyof IPackageJSON> = [
                            "scripts",
                            "dependencies",
                            "devDependencies"
                        ];

                        generatedPackage = new TestPackage().ToJSON();

                        Assert.ok(
                            Object.keys(generatedPackage).every(
                                (key: keyof IPackageJSON) =>
                                {
                                    return importantKeys.includes(key);
                                }));
                    });

                test(
                    "Checking whether the behavior of the object-creation can be changed by manipulating `GeneratorLogics`…",
                    () =>
                    {
                        let property: keyof IPackageJSON = "name";
                        npmPackage = new TestPackage();
                        npmPackage.GenerationLogics.set(property, GenerationLogic.Always);
                        Assert.ok(property in npmPackage.ToJSON());
                    });
            });

        suite(
            "any LoadObject(any object)",
            () =>
            {
                test(
                    "Checking whether reference values are begin cloned…",
                    () =>
                    {
                        for (let value of [[], {}])
                        {
                            Assert.deepStrictEqual(value, npmPackage.LoadObject(value));
                            Assert.notStrictEqual(value, npmPackage.LoadObject(value));
                        }
                    });

                test(
                    "Checking whether `null`-ish values are replaced by `null`…",
                    () =>
                    {
                        for (let value of [null, undefined] as any[])
                        {
                            Assert.strictEqual(null, npmPackage.LoadObject(value));
                        }
                    });
            });

        suite(
            "Dictionary<keyof T, T[keyof T]> LoadDictionary<T>(T collection)",
            () =>
            {
                let randomKey: string;
                let randomValue: string;

                setup(
                    () =>
                    {
                        randomKey = random.string(10);
                        randomValue = random.string(10);
                    });

                test(
                    "Checking whether objects are converted to dictionaries correctly…",
                    () =>
                    {
                        let dictionary = npmPackage.LoadDictionary({ [randomKey]: randomValue });
                        Assert.deepStrictEqual(dictionary.Keys, [randomKey]);
                        Assert.strictEqual(dictionary.Get(randomKey), randomValue);
                    });
            });

        suite(
            "Person LoadPerson(IPerson | string person)",
            () =>
            {
                let personOptions: IPerson;

                setup(
                    () =>
                    {
                        personOptions = GetRandomPerson();
                    });

                test(
                    "Checking whether person-objects are loaded correctly…",
                    () =>
                    {
                        AssertPerson(npmPackage.LoadPerson(personOptions), personOptions);
                    });

                test(
                    "Checking whether strings are loaded correctly…",
                    () =>
                    {
                        AssertPerson(npmPackage.LoadPerson(stringify(personOptions)), personOptions);
                    });
            });

        suite(
            "Person[] LoadPersonList(Array<IPerson | string> personList)",
            () =>
            {
                /**
                 * Asserts the equality of loaded person-lists and the passed `personList`.
                 *
                 * @param personList
                 * The list to test.
                 */
                function AssertLoadedList(personList: Array<IPerson | string>): void
                {
                    AssertPersonList(npmPackage.LoadPersonList(personList), personList);
                }

                test(
                    "Checking whether arrays of person-objects are loaded correctly…",
                    () =>
                    {
                        AssertLoadedList([GetRandomPerson(), GetRandomPerson()]);
                    });

                test(
                    "Checking whether arrays of strings are loaded correctly…",
                    () =>
                    {
                        AssertLoadedList([stringify(GetRandomPerson()), stringify(GetRandomPerson())]);
                    });

                test(
                    "Checking whether mixed arrays are loaded correctly…",
                    () =>
                    {
                        AssertLoadedList([GetRandomPerson(), stringify(GetRandomPerson())]);
                    });
            });
    });
