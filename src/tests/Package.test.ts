import Assert = require("assert");
import { arch, platform } from "os";
import { URL } from "url";
import { isNullOrUndefined } from "util";
import { readdir, readFile, remove, statSync, writeJSON } from "fs-extra";
import gitRemoteOriginUrl = require("git-remote-origin-url");
import gitRootDir = require("git-root-dir");
import { Random } from "random-js";
import readmeFilename = require("readme-filename");
import stringify = require("stringify-author");
import { TempFile } from "temp-filesystem";
import Path = require("upath");
import { Dictionary } from "../Collections/Dictionary";
import { List } from "../Collections/List";
import { GenerationLogic } from "../GenerationLogic";
import { IPackageMetadata } from "../IPackageMetadata";
import { BugInfo } from "../Management/BugInfo";
import { IBugInfo } from "../Management/IBugInfo";
import { IPerson } from "../Management/IPerson";
import { PackagePerson } from "../Management/PackagePerson";
import { Person } from "../Management/Person";
import { Package } from "../Package";
import { JSONObject } from "../Utilities/JSONObject";
import { AssertComparator } from "./AssertComparator";
import { TestPackage } from "./TestPackage";

/**
 * Registers tests for the `Package` class.
 */
export function PackageTests(): void
{
    suite(
        "Package",
        () =>
        {
            let random: Random;
            let metadata: IPackageMetadata;
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
             * Asserts the contents of a list.
             *
             * @param actual
             * The actual list.
             *
             * @param expected
             * The expected contents of the list.
             */
            function AssertList<T>(actual: List<T>, expected: T[]): void
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

                    metadata = {
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
                    npmPackage = new TestPackage(metadata);
                });

            /**
             * Asserts the contents of the `npmPackage`.
             *
             * @param metadata
             * The expected meta-data.
             */
            function AssertPackageMeta(metadata: IPackageMetadata): void
            {
                Assert.strictEqual(npmPackage.Name, metadata.name);
                Assert.strictEqual(npmPackage.Version, metadata.version);
                Assert.strictEqual(npmPackage.Private, metadata.private);
                Assert.strictEqual(npmPackage.Description, metadata.description);
                AssertPerson(npmPackage.Author, metadata.author);
                AssertPersonList(npmPackage.Maintainers, metadata.maintainers);
                AssertPersonList(npmPackage.Contributors, metadata.contributors);
                Assert.strictEqual(npmPackage.License, metadata.license);
                Assert.deepStrictEqual(npmPackage.Keywords, metadata.keywords);
                AssertDictionary(npmPackage.Engines, metadata.engines);
                Assert.deepStrictEqual(npmPackage.OS, metadata.os);
                Assert.deepStrictEqual(npmPackage.CPU, metadata.cpu);
                Assert.strictEqual(npmPackage.Main, metadata.main);
                Assert.strictEqual(npmPackage.Types, metadata.types);
                Assert.deepStrictEqual(npmPackage.Browser, metadata.browser);
                Assert.deepStrictEqual(npmPackage.Binaries, metadata.bin);
                Assert.deepStrictEqual(npmPackage.Manuals, metadata.man);
                Assert.deepStrictEqual(npmPackage.Files, metadata.files);
                Assert.deepStrictEqual(npmPackage.Directories, metadata.directories);
                Assert.strictEqual(npmPackage.Homepage, metadata.homepage);
                Assert.deepStrictEqual(npmPackage.Repository, metadata.repository);
                AssertBugInfo(npmPackage.Bugs, metadata.bugs);
                Assert.deepStrictEqual(npmPackage.Config, metadata.config);
                Assert.deepStrictEqual(npmPackage.PublishConfig, metadata.publishConfig);
                AssertDictionary(npmPackage.Scripts, metadata.scripts);
                AssertDictionary(npmPackage.Dependencies, metadata.dependencies);
                AssertDictionary(npmPackage.DevelpomentDependencies, metadata.devDependencies);
                AssertDictionary(npmPackage.PeerDependencies, metadata.peerDependencies);
                AssertDictionary(npmPackage.OptionalDependencies, metadata.optionalDependencies);
                Assert.deepStrictEqual(npmPackage.BundledDependencies.ToJSON(), metadata.bundledDependencies);
            }

            suite(
                "constructor",
                () =>
                {
                    suite(
                        "Testing basic functionality…",
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

                            test(
                                "Checking whether the values are loaded correctly…",
                                () =>
                                {
                                    AssertPackageMeta(metadata);
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
                            function AssertDefault<TMetaKey extends keyof IPackageMetadata, TKey extends keyof Package>(key: TKey, expected: any, comparator?: AssertComparator<Package[TKey], any>, overwriteUndefined = true): void
                            {
                                let optionsKey = new Map(Array.from(npmPackage.PropertyMap).map((entry) => [entry[1], entry[0]])).get(key);
                                let packageOptions = new JSONObject(metadata);

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
                                function AssertValue(expected: IPackageMetadata[TMetaKey]): void
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
                                    AssertDefault("BundledDependencies", [], AssertList);
                                });
                        });

                    suite(
                        "Testing the feature to load values from files…",
                        () =>
                        {
                            let tempFile: TempFile;

                            suiteSetup(
                                async () =>
                                {
                                    tempFile = new TempFile();
                                    await writeJSON(tempFile.FullName, metadata);
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
                                    AssertPackageMeta(metadata);
                                });

                            test(
                                "Checking whether the `FileName` is set to the path of the source-file…",
                                () =>
                                {
                                    Assert.strictEqual(npmPackage.FileName, tempFile.FullName);
                                });
                        });

                    suite(
                        "Testing the feature to shim package-file contents…",
                        () =>
                        {
                            let tempFile: TempFile;
                            let inexistentFile: TempFile;
                            let testValue: string;

                            suiteSetup(
                                async () =>
                                {
                                    tempFile = new TempFile();
                                    inexistentFile = new TempFile();
                                    testValue = random.string(20);
                                    await writeJSON(tempFile.FullName, metadata);
                                    await remove(inexistentFile.FullName);
                                });

                            suiteTeardown(
                                () =>
                                {
                                    tempFile.Dispose();
                                    inexistentFile.Dispose();
                                });

                            setup(
                                () =>
                                {
                                    npmPackage = new TestPackage(tempFile.FullName, {});
                                });

                            test(
                                "Checking whether values aren't loaded from the file…",
                                () =>
                                {
                                    Assert.notStrictEqual(npmPackage.Name, metadata.name);
                                    Assert.ok(isNullOrUndefined(npmPackage.Name));
                                });

                            test(
                                "Checking whether passing inexistent file-names doesn't throw an error…",
                                () =>
                                {
                                    Assert.doesNotThrow(() => new TestPackage(inexistentFile.FullName, {}));
                                });

                            test(
                                "Checking whether the metadata is loaded from the object…",
                                () =>
                                {
                                    npmPackage = new TestPackage(inexistentFile.FullName, { name: testValue });
                                    Assert.strictEqual(npmPackage.Name, testValue);
                                });
                        });
                });

            suite(
                "Normalize",
                () =>
                {
                    let gitRoot: string;
                    let gitRemoteUrl: URL;
                    let webUrl: URL;
                    let homepage: string;
                    let bugUrl: string;

                    suiteSetup(
                        async () =>
                        {
                            gitRoot = await gitRootDir(__dirname);
                            gitRemoteUrl = new URL(await gitRemoteOriginUrl(gitRoot));
                            webUrl = new URL(await gitRemoteOriginUrl(gitRoot));
                            webUrl.protocol = "https";
                            webUrl.pathname = webUrl.pathname.replace(/\.git$/, "");
                            homepage = `${webUrl}#readme`;
                            bugUrl = `${webUrl}/issues`;
                        });

                    setup(
                        async () =>
                        {
                            npmPackage = new TestPackage();
                            npmPackage.FileName = Path.join(gitRoot, "package.json");
                            await npmPackage.Normalize();
                        });

                    test(
                        "Checking whether the git-info are applied correctly…",
                        () =>
                        {
                            Assert.ok(typeof npmPackage.Repository !== "string");
                            Assert.strictEqual(npmPackage.Repository.url, `git+${gitRemoteUrl}`);
                            Assert.strictEqual(npmPackage.Homepage, homepage);
                            Assert.strictEqual(npmPackage.Bugs.URL, bugUrl);
                        });

                    test(
                        "Checking whether the description is generated correctly…",
                        async () =>
                        {
                            Assert.ok((await readFile(await readmeFilename(gitRoot))).toString().includes(npmPackage.Description));
                        });

                    test(
                        "Checking whether sub-directories are applied correctly…",
                        async () =>
                        {
                            let parsedPath = Path.parse(npmPackage.FileName);
                            let subDirectories = (await readdir(gitRoot)).filter((entry) => statSync(entry).isDirectory());
                            let directory = random.pick(subDirectories);
                            let fileName = Path.join(parsedPath.dir, directory, parsedPath.base);
                            npmPackage = new TestPackage();
                            npmPackage.FileName = fileName;
                            await npmPackage.Normalize();
                            Assert.ok(typeof npmPackage.Repository !== "string");
                            Assert.strictEqual(npmPackage.Repository.directory, directory);
                        });
                });

            suite(
                "ToJSON",
                () =>
                {
                    let generatedMeta: IPackageMetadata;

                    setup(
                        () =>
                        {
                            generatedMeta = npmPackage.ToJSON();
                        });

                    test(
                        "Checking whether only important properties are present even if they're empty…",
                        () =>
                        {
                            let importantKeys: Array<keyof IPackageMetadata> = [
                                "scripts",
                                "dependencies",
                                "devDependencies"
                            ];

                            generatedMeta = new TestPackage().ToJSON();

                            Assert.ok(
                                Object.keys(generatedMeta).every(
                                    (key: keyof IPackageMetadata) =>
                                    {
                                        return importantKeys.includes(key);
                                    }));
                        });

                    test(
                        "Checking whether the behavior of the object-creation can be changed by manipulating `GeneratorLogics`…",
                        () =>
                        {
                            let property: keyof IPackageMetadata = "name";
                            npmPackage = new TestPackage();
                            npmPackage.GenerationLogics.set(property, GenerationLogic.Always);
                            Assert.ok(property in npmPackage.ToJSON());
                        });

                    test(
                        "Checking whether additional properties presist…",
                        () =>
                        {
                            let testKey = random.string(20);
                            let testValue = random.string(10);
                            npmPackage = new TestPackage(
                                {
                                    [testKey]: testValue
                                });

                            Assert.ok(testKey in npmPackage.ToJSON());
                            Assert.strictEqual(npmPackage.ToJSON()[testKey], testValue);
                        });
                });

            suite(
                "LoadObject",
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
                "LoadDictionary",
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
                "LoadPerson",
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
                "LoadPersonList",
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
}
