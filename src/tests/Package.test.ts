import { deepStrictEqual, doesNotThrow, notStrictEqual, ok, strictEqual } from "node:assert";
import { arch, platform } from "node:os";
import { fileURLToPath, URL } from "node:url";
import { TempFile } from "@manuth/temp-files";
import fs from "fs-extra";
import gitRemoteOriginUrl from "git-remote-origin-url";
import gitRootDir from "git-root-dir";
import githubUrlFromGit from "github-url-from-git";
import readmeFilename from "readme-filename";
import stringify from "stringify-author";
import upath from "upath";
import { Dictionary } from "../Collections/Dictionary.js";
import { List } from "../Collections/List.js";
import { GenerationLogic } from "../GenerationLogic.js";
import { IPackageMetadata } from "../IPackageMetadata.js";
import { BugInfo } from "../Management/BugInfo.js";
import { IBugInfo } from "../Management/IBugInfo.js";
import { IPerson } from "../Management/IPerson.js";
import { IRepository } from "../Management/IRepository.js";
import { PackagePerson } from "../Management/PackagePerson.js";
import { Person } from "../Management/Person.js";
import { Package } from "../Package.js";
import { PackageType } from "../PackageType.js";
import { JSONObject } from "../Utilities/JSONObject.js";
import { PropertyChecker } from "./PropertyChecker.js";
import { TestContext } from "./TestContext.js";
import { TestPackage } from "./TestPackage.js";

const { readdir, readFile, remove, statSync, writeJSON } = fs;
const { join, parse } = upath;

/**
 * Registers tests for the {@link Package `Package`} class.
 *
 * @param context
 * The test-context.
 */
export function PackageTests(context: TestContext): void
{
    suite(
        nameof(Package),
        () =>
        {
            let metadata: IPackageMetadata;
            let npmPackage: TestPackage;

            /**
             * Asserts the contents of a dictionary.
             *
             * @template TKey
             * The type of the keys of the specified {@link actualDictionary `actualDictionary`}.
             *
             * @template TValue
             * The type of the values of the specified {@link actualDictionary `actualDictionary`}.
             *
             * @param actualDictionary
             * The actual dictionary.
             *
             * @param expected
             * The expected contents of the dictionary.
             */
            function AssertDictionary<TKey extends string | number | symbol, TValue>(actualDictionary: Dictionary<TKey, TValue>, expected: Record<TKey, TValue>): void
            {
                deepStrictEqual(actualDictionary.ToJSON(), expected);
            }

            /**
             * Asserts the contents of a list.
             *
             * @template T
             * The type of the items of the specified {@link actualList `actualList`}.
             *
             * @param actualList
             * The actual list.
             *
             * @param expected
             * The expected contents of the list.
             */
            function AssertList<T>(actualList: List<T>, expected: T[]): void
            {
                deepStrictEqual(actualList.ToJSON(), expected);
            }

            /**
             * Asserts the info about a {@link Person `Person`}.
             *
             * @param actual
             * The actual person.
             *
             * @param expected
             * The expected person.
             */
            function AssertPerson(actual: Person, expected: IPerson | string): void
            {
                deepStrictEqual(actual.ToJSON(), new Person(expected).ToJSON());
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
                deepStrictEqual(actual.keys(), expected.keys());

                for (let key of expected.keys())
                {
                    AssertPerson(actual[key], expected[key]);
                }
            }

            /**
             * Asserts the contents of a {@link BugInfo `BugInfo`} object.
             *
             * @param actual
             * The actual bug-info.
             *
             * @param expected
             * The expected bug-info.
             */
            function AssertBugInfo(actual: BugInfo, expected: string | IBugInfo): void
            {
                deepStrictEqual(actual.ToJSON(), new BugInfo(expected).ToJSON());
            }

            /**
             * Generates a random person.
             */
            function* RandomPersonGenerator(): Generator<IPerson, IPerson>
            {
                while (true)
                {
                    yield {
                        name: context.Random.string(10),
                        email: context.Random.string(10),
                        url: context.Random.string(10)
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
                        return context.Random.string(length);
                    }

                    /**
                     * Generates a random digit.
                     *
                     * @returns
                     * A random digit.
                     */
                    function digit(): number
                    {
                        return context.Random.integer(0, 9);
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
                        type: context.Random.bool() ? PackageType.CommonJS : PackageType.ESModule,
                        private: context.Random.bool(),
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
                        license: context.Random.pick(
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
                        exports: {
                            ".": {
                                import: text(),
                                require: text(),
                                types: text(),
                                default: text()
                            }
                        },
                        imports: {
                            "#dep": {
                                import: text(),
                                require: text(),
                                default: text()
                            }
                        },
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
             * Asserts the contents of the {@link npmPackage `npmPackage`}.
             *
             * @param metadata
             * The expected meta-data.
             */
            function AssertPackageMeta(metadata: IPackageMetadata): void
            {
                strictEqual(npmPackage.Name, metadata.name);
                strictEqual(npmPackage.Version, metadata.version);
                strictEqual(npmPackage.Type, metadata.type);
                strictEqual(npmPackage.Private, metadata.private);
                strictEqual(npmPackage.Description, metadata.description);
                AssertPerson(npmPackage.Author, metadata.author ?? "");
                AssertPersonList(npmPackage.Maintainers, metadata.maintainers ?? []);
                AssertPersonList(npmPackage.Contributors, metadata.contributors ?? []);
                strictEqual(npmPackage.License, metadata.license);
                deepStrictEqual(npmPackage.Keywords, metadata.keywords);
                AssertDictionary(npmPackage.Engines, metadata.engines ?? {});
                deepStrictEqual(npmPackage.OS, metadata.os);
                deepStrictEqual(npmPackage.CPU, metadata.cpu);
                deepStrictEqual(npmPackage.Exports, metadata.exports);
                deepStrictEqual(npmPackage.Imports, metadata.imports);
                strictEqual(npmPackage.Main, metadata.main);
                strictEqual(npmPackage.Types, metadata.types);
                deepStrictEqual(npmPackage.Browser, metadata.browser);
                deepStrictEqual(npmPackage.Binaries, metadata.bin);
                deepStrictEqual(npmPackage.Manuals, metadata.man);
                deepStrictEqual(npmPackage.Files, metadata.files);
                deepStrictEqual(npmPackage.Directories, metadata.directories);
                strictEqual(npmPackage.Homepage, metadata.homepage);
                deepStrictEqual(npmPackage.Repository, metadata.repository);
                AssertBugInfo(npmPackage.Bugs, metadata.bugs ?? {});
                deepStrictEqual(npmPackage.Config, metadata.config);
                deepStrictEqual(npmPackage.PublishConfig, metadata.publishConfig);
                AssertDictionary(npmPackage.Scripts, metadata.scripts ?? {});
                AssertDictionary(npmPackage.Dependencies, metadata.dependencies ?? {});
                AssertDictionary(npmPackage.DevelopmentDependencies, metadata.devDependencies ?? {});
                AssertDictionary(npmPackage.PeerDependencies, metadata.peerDependencies ?? {});
                AssertDictionary(npmPackage.OptionalDependencies, metadata.optionalDependencies ?? {});
                deepStrictEqual(npmPackage.BundledDependencies.ToJSON(), metadata.bundledDependencies);
            }

            suite(
                nameof(Package.constructor),
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
                                    doesNotThrow(
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
                             * Asserts the default value of a package-property.
                             *
                             * @param key
                             * The key of the property to check.
                             *
                             * @param expected
                             * The expected default value.
                             *
                             * @param propertyChecker
                             * A component for checking the validity of a property.
                             *
                             * @param overwriteUndefined
                             * A value indicating whether `undefined`s are being overwritten.
                             */
                            function AssertDefault<TMetaKey extends keyof IPackageMetadata, TKey extends keyof Package>(key: TKey, expected: any, propertyChecker?: PropertyChecker<Package[TKey], any>, overwriteUndefined = true): void
                            {
                                let packageOptions = new JSONObject(metadata);

                                let optionsKey = new Map(
                                    Array.from(npmPackage.PropertyMap).map(
                                        (entry) => [entry[1], entry[0]])).get(key);

                                let checker = propertyChecker ?? (
                                    (x, y) =>
                                    {
                                        deepStrictEqual(x, y);
                                    });

                                ok(optionsKey);

                                /**
                                 * Asserts the value of a property.
                                 *
                                 * @param expected
                                 * The expected value of the setting.
                                 */
                                function AssertValue(expected: IPackageMetadata[TMetaKey]): void
                                {
                                    checker(new TestPackage(packageOptions.ToJSON())[key], expected);
                                }

                                packageOptions.Remove(optionsKey);
                                AssertValue(expected);

                                if (overwriteUndefined)
                                {
                                    packageOptions.Add(optionsKey, undefined as any);
                                    AssertValue(expected);
                                }
                            }

                            test(
                                "Checking whether default values are set as expected…",
                                function()
                                {
                                    /**
                                     * Represents an assertion of the value of a property.
                                     */
                                    type PropertyAssertion<T extends keyof Package> = [T, any, PropertyChecker<Package[T], any>?];

                                    let assertions = [
                                        [nameof<Package>((pkg) => pkg.Name), undefined],
                                        [nameof<Package>((pkg) => pkg.Version), undefined],
                                        [nameof<Package>((pkg) => pkg.Type), undefined],
                                        [nameof<Package>((pkg) => pkg.Private), false],
                                        [nameof<Package>((pkg) => pkg.Description), undefined],
                                        [nameof<Package>((pkg) => pkg.Author), {} as PackagePerson, AssertPerson],
                                        [nameof<Package>((pkg) => pkg.Maintainers), []],
                                        [nameof<Package>((pkg) => pkg.Contributors), []],
                                        [nameof<Package>((pkg) => pkg.License), undefined],
                                        [nameof<Package>((pkg) => pkg.Keywords), []],
                                        [nameof<Package>((pkg) => pkg.Engines), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.OS), undefined],
                                        [nameof<Package>((pkg) => pkg.CPU), undefined],
                                        [nameof<Package>((pkg) => pkg.Main), undefined],
                                        [nameof<Package>((pkg) => pkg.Types), undefined],
                                        [nameof<Package>((pkg) => pkg.Browser), {}],
                                        [nameof<Package>((pkg) => pkg.Binaries), {}],
                                        [nameof<Package>((pkg) => pkg.Manuals), []],
                                        [nameof<Package>((pkg) => pkg.Files), undefined],
                                        [nameof<Package>((pkg) => pkg.Directories), {}],
                                        [nameof<Package>((pkg) => pkg.Homepage), undefined],
                                        [nameof<Package>((pkg) => pkg.Repository), undefined],
                                        [nameof<Package>((pkg) => pkg.Bugs), {}, AssertBugInfo],
                                        [nameof<Package>((pkg) => pkg.Config), {}],
                                        [nameof<Package>((pkg) => pkg.PublishConfig), {}],
                                        [nameof<Package>((pkg) => pkg.Scripts), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.Dependencies), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.DevelopmentDependencies), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.PeerDependencies), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.OptionalDependencies), {}, AssertDictionary],
                                        [nameof<Package>((pkg) => pkg.BundledDependencies), [], AssertList]
                                    ] as Array<PropertyAssertion<keyof Package>>;

                                    this.slow(2 * 1000);
                                    this.timeout(4 * 1000);

                                    for (let assertion of assertions)
                                    {
                                        AssertDefault(...assertion);
                                    }
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
                                `Checking whether values are loaded from the \`${Package.FileName}\` file correctly…`,
                                () =>
                                {
                                    AssertPackageMeta(metadata);
                                });

                            test(
                                `Checking whether the \`${nameof<Package>((pkg) => pkg.FileName)}\` is set to the path of the source-file…`,
                                () =>
                                {
                                    strictEqual(npmPackage.FileName, tempFile.FullName);
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
                                    testValue = context.Random.string(20);
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
                                    notStrictEqual(npmPackage.Name, metadata.name);
                                    ok(npmPackage.Name === null || npmPackage.Name === undefined);
                                });

                            test(
                                "Checking whether passing inexistent file-names doesn't throw an error…",
                                () =>
                                {
                                    doesNotThrow(() => new TestPackage(inexistentFile.FullName, {}));
                                });

                            test(
                                `Checking whether the metadata is loaded from the \`${nameof(Object)}\`…`,
                                () =>
                                {
                                    npmPackage = new TestPackage(inexistentFile.FullName, { name: testValue });
                                    strictEqual(npmPackage.Name, testValue);
                                });
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.Normalize),
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
                            let gitDir = await gitRootDir(fileURLToPath(new URL(".", import.meta.url)));
                            ok(gitDir);
                            gitRoot = gitDir;

                            let url = githubUrlFromGit(
                                await gitRemoteOriginUrl(
                                    {
                                        cwd: gitRoot
                                    }));

                            ok(url);
                            url = `${url}.git`;
                            gitRemoteUrl = new URL(url);
                            webUrl = new URL(url);
                            webUrl.protocol = "https";
                            webUrl.pathname = webUrl.pathname.replace(/\.git$/, "");
                            homepage = `${webUrl}#readme`;
                            bugUrl = `${webUrl}/issues`;
                        });

                    setup(
                        async () =>
                        {
                            npmPackage = new TestPackage();
                            npmPackage.FileName = join(gitRoot, Package.FileName);
                            await npmPackage.Normalize();
                        });

                    test(
                        "Checking whether the git-info are applied correctly…",
                        () =>
                        {
                            ok(typeof npmPackage.Repository !== "string");
                            strictEqual(npmPackage.Repository?.url, `git+${gitRemoteUrl}`);
                            strictEqual(npmPackage.Homepage, homepage);
                            strictEqual(npmPackage.Bugs.URL, bugUrl);
                        });

                    test(
                        `Checking whether the \`${nameof<Package>((p) => p.Description)}\` is generated correctly…`,
                        async () =>
                        {
                            ok(npmPackage.Description);
                            ok((await readFile(await readmeFilename(gitRoot))).toString().includes(npmPackage.Description));
                        });

                    test(
                        `Checking whether the \`${nameof<Package>((p) => p.Repository)}.${nameof<IRepository>((r) => r.directory)}-option is applied correctly…`,
                        async () =>
                        {
                            ok(npmPackage.FileName);
                            let parsedPath = parse(npmPackage.FileName);
                            let subDirectories = (await readdir(gitRoot)).filter((entry) => statSync(entry).isDirectory());
                            let directory = context.Random.pick(subDirectories);
                            let fileName = join(parsedPath.dir, directory, parsedPath.base);
                            npmPackage = new TestPackage();
                            npmPackage.FileName = fileName;
                            await npmPackage.Normalize();
                            ok(typeof npmPackage.Repository !== "string");
                            strictEqual(npmPackage.Repository?.directory, directory);
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.ToJSON),
                () =>
                {
                    let generatedMeta: IPackageMetadata;

                    setup(
                        () =>
                        {
                            generatedMeta = npmPackage.ToJSON();
                        });

                    test(
                        "Checking whether important properties are present even if they're empty…",
                        () =>
                        {
                            let importantKeys = [
                                nameof<IPackageMetadata>((metadata) => metadata.scripts)
                            ] as Array<keyof IPackageMetadata>;

                            generatedMeta = new TestPackage().ToJSON();

                            ok(
                                importantKeys.every(
                                    (key) =>
                                    {
                                        return Object.keys(generatedMeta).includes(key);
                                    }));
                        });

                    test(
                        `Checking whether the behavior of the \`${nameof(Object)}\`-creation can be changed by manipulating the \`${nameof<Package>((p) => p.GenerationLogics)}\`…`,
                        () =>
                        {
                            let property = nameof<IPackageMetadata>((metadata) => metadata.name) as keyof IPackageMetadata;
                            npmPackage = new TestPackage();
                            npmPackage.GenerationLogics.set(property, GenerationLogic.Always);
                            ok(property in npmPackage.ToJSON());
                        });

                    test(
                        `Checking whether \`${nameof.full(GenerationLogic.Truthy)}\` causes properties to be added only if they are truthy…`,
                        () =>
                        {
                            let property = nameof<IPackageMetadata>((metadata) => metadata.private) as keyof IPackageMetadata;
                            npmPackage = new TestPackage();
                            npmPackage.GenerationLogics.set(property, GenerationLogic.Truthy);
                            npmPackage.Private = true;
                            ok(property in npmPackage.ToJSON());
                            npmPackage.Private = false;
                            ok(!(property in npmPackage.ToJSON()));
                        });

                    test(
                        "Checking whether additional properties persist…",
                        () =>
                        {
                            let testKey = context.Random.string(20);
                            let testValue = context.Random.string(10);
                            npmPackage = new TestPackage(
                                {
                                    [testKey]: testValue
                                });

                            ok(testKey in npmPackage.ToJSON());
                            strictEqual(npmPackage.ToJSON()[testKey], testValue);
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.LoadObject),
                () =>
                {
                    test(
                        "Checking whether reference values are begin cloned…",
                        () =>
                        {
                            for (let value of [[], {}])
                            {
                                deepStrictEqual(value, npmPackage.LoadObject(value));
                                notStrictEqual(value, npmPackage.LoadObject(value));
                            }
                        });

                    test(
                        `Checking whether \`${null}\`-ish values are replaced with \`${undefined}\`…`,
                        () =>
                        {
                            for (let value of [null, undefined] as any[])
                            {
                                strictEqual(npmPackage.LoadObject(value), undefined);
                            }
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.LoadDictionary),
                () =>
                {
                    let randomKey: string;
                    let randomValue: string;

                    setup(
                        () =>
                        {
                            randomKey = context.Random.string(10);
                            randomValue = context.Random.string(10);
                        });

                    test(
                        `Checking whether \`${nameof(Object)}\`s are converted to \`${nameof(Dictionary)}\`s correctly…`,
                        () =>
                        {
                            let dictionary = npmPackage.LoadDictionary({ [randomKey]: randomValue });
                            deepStrictEqual(dictionary.Keys, [randomKey]);
                            strictEqual(dictionary.Get(randomKey), randomValue);
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.LoadPerson),
                () =>
                {
                    let personOptions: IPerson;

                    setup(
                        () =>
                        {
                            personOptions = GetRandomPerson();
                        });

                    test(
                        `Checking whether \`${nameof<IPerson>()}\`-objects are loaded correctly…`,
                        () =>
                        {
                            AssertPerson(npmPackage.LoadPerson(personOptions), personOptions);
                        });

                    test(
                        `Checking whether \`${nameof(String)}\`s are loaded correctly…`,
                        () =>
                        {
                            AssertPerson(npmPackage.LoadPerson(stringify(personOptions)), personOptions);
                        });
                });

            suite(
                nameof<TestPackage>((pkg) => pkg.LoadPersonList),
                () =>
                {
                    /**
                     * Asserts the equality of loaded person-lists and the passed {@link personList `personList`}.
                     *
                     * @param personList
                     * The list to test.
                     */
                    function AssertLoadedList(personList: Array<IPerson | string>): void
                    {
                        AssertPersonList(npmPackage.LoadPersonList(personList), personList);
                    }

                    test(
                        `Checking whether \`${nameof(Array)}\`s of \`${nameof<IPerson>()}\`-objects are loaded correctly…`,
                        () =>
                        {
                            AssertLoadedList([GetRandomPerson(), GetRandomPerson()]);
                        });

                    test(
                        `Checking whether \`${nameof(Array)}\`s of \`${nameof(String)}\` are loaded correctly…`,
                        () =>
                        {
                            AssertLoadedList([stringify(GetRandomPerson()), stringify(GetRandomPerson())]);
                        });

                    test(
                        `Checking whether mixed \`${nameof(Array)}\`s are loaded correctly…`,
                        () =>
                        {
                            AssertLoadedList([GetRandomPerson(), stringify(GetRandomPerson())]);
                        });
                });
        });
}
