import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { randexp } from "randexp";
import { Dictionary } from "../../Collections/Dictionary";
import { PropertyDictionary } from "../../Collections/PropertyDictionary";
import { DependencyCollection } from "../../Management/DependencyCollection";
import { KeyOfType } from "../../Management/KeyOfType";
import { PackageDependencyCollection } from "../../Management/PackageDependencyCollection";
import { PackageDependencyCollectionOptions } from "../../Management/PackageDependencyCollectionOptions";
import { Package } from "../../Package";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link PackageDependencyCollection `PackageDependencyCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function PackageDependencyCollectionTests(context: TestContext): void
{
    /**
     * Provides an implementation of the {@link PackageDependencyCollection `PackageDependencyCollection`} class for testing.
     */
    class TestPackageDependencyCollection extends PackageDependencyCollection
    {
        /**
         * Initializes a new instance of the {@link TestPackageDependencyCollection `TestPackageDependencyCollection`} class.
         *
         * @param sourcePackage
         * The package to load the specified {@link dependencies `dependencies`} from.
         *
         * @param dependencies
         * The dependencies to load from the specified {@link sourcePackage `sourcePackage`}.
         */
        public constructor(sourcePackage: Package, dependencies: PackageDependencyCollectionOptions)
        {
            super(sourcePackage, dependencies);
        }

        /**
         * @inheritdoc
         */
        public override get Package(): Package
        {
            return super.Package;
        }

        /**
         * @inheritdoc
         */
        public override get DependencyNames(): PackageDependencyCollectionOptions
        {
            return super.DependencyNames;
        }

        /**
         * @inheritdoc
         *
         * @param dependencies
         * The dependencies to load.
         *
         * @param packageListName
         * The name of the dependency-list in the package to load the specified {@link dependencies `dependencies`} from.
         *
         * @returns
         * The loaded dependencies.
         */
        public override LoadPackageDependencies(dependencies: string[], packageListName?: KeyOfType<DependencyCollection, Dictionary<string, string>>): Dictionary<string, string>
        {
            return super.LoadPackageDependencies(dependencies, packageListName);
        }
    }

    suite(
        nameof(PackageDependencyCollection),
        () =>
        {
            let npmPackage: Package;
            let randomDependencies: Record<string, string>;
            let collectionOptions: PackageDependencyCollectionOptions;
            let collection: TestPackageDependencyCollection;

            setup(
                async () =>
                {
                    npmPackage = new Package();
                    randomDependencies = await context.GetRandomDependencySet();

                    collectionOptions = {
                        dependencies: [],
                        devDependencies: [],
                        optionalDependencies: [],
                        peerDependencies: []
                    };

                    for (let dependency of new PropertyDictionary(randomDependencies).Entries)
                    {
                        context.Random.pick(
                            [
                                npmPackage.Dependencies,
                                npmPackage.DevelopmentDependencies,
                                npmPackage.OptionalDependencies,
                                npmPackage.PeerDependencies
                            ]).Add(
                                dependency[0],
                                dependency[1]);

                        context.Random.pick(
                            [
                                collectionOptions.dependencies,
                                collectionOptions.devDependencies,
                                collectionOptions.peerDependencies,
                                collectionOptions.optionalDependencies
                            ]).push(dependency[0]);
                    }

                    collection = new TestPackageDependencyCollection(npmPackage, collectionOptions);
                });

            suite(
                nameof<TestPackageDependencyCollection>((c) => c.DependencyNames),
                () =>
                {
                    let injectedDependency: string;
                    let injectedVersion: string;

                    /**
                     * Provides the functionality to test the injection of dependencies.
                     */
                    class InjectedPackageDependencyCollection extends TestPackageDependencyCollection
                    {
                        /**
                         * @inheritdoc
                         */
                        public override get DependencyNames(): PackageDependencyCollectionOptions
                        {
                            let result = super.DependencyNames;

                            return {
                                ...result,
                                dependencies: [
                                    ...(result.dependencies ?? []),
                                    injectedDependency
                                ]
                            };
                        }
                    }

                    setup(
                        () =>
                        {
                            injectedDependency = randexp(/[a-zA-Z]{10}/);
                            injectedVersion = randexp(/\d+\.\d+\.\d+/);
                            npmPackage.Dependencies.Add(injectedDependency, injectedVersion);
                            collection = new InjectedPackageDependencyCollection(npmPackage, collectionOptions);
                        });

                    test(
                        `Checking whether dependencies can be injected using the \`${nameof<TestPackageDependencyCollection>((c) => c.DependencyNames)}\`-property…`,
                        function()
                        {
                            this.slow(5 * 1000);
                            this.timeout(10 * 1000);

                            ok(
                                Object.keys(collectionOptions).every(
                                    (key) =>
                                    {
                                        return collectionOptions[key as keyof PackageDependencyCollectionOptions].every(
                                            (dependency) =>
                                            {
                                                return collection.AllDependencies.Has(dependency);
                                            });
                                    }));

                            ok(collection.AllDependencies.Has(injectedDependency));
                            strictEqual(collection.AllDependencies.Get(injectedDependency), injectedVersion);
                        });
                });

            suite(
                nameof<TestPackageDependencyCollection>((c) => c.LoadPackageDependencies),
                () =>
                {
                    test(
                        `Checking whether dependencies are loaded from \`${nameof<PackageDependencyCollection>((c) => c.AllDependencies)}\` by default…`,
                        function()
                        {
                            this.slow(5 * 1000);
                            this.timeout(10 * 1000);

                            for (let dependency of npmPackage.AllDependencies.Keys)
                            {
                                strictEqual(
                                    collection.AllDependencies.Get(dependency),
                                    npmPackage.AllDependencies.Get(dependency));
                            }
                        });

                    test(
                        "Checking whether dependencies can be loaded from a specific list…",
                        () =>
                        {
                            let listNames = [
                                nameof<DependencyCollection>((c) => c.Dependencies),
                                nameof<DependencyCollection>((c) => c.DevelopmentDependencies),
                                nameof<DependencyCollection>((c) => c.PeerDependencies),
                                nameof<DependencyCollection>((c) => c.OptionalDependencies)
                            ] as Array<KeyOfType<DependencyCollection, Dictionary<string, string>>>;

                            for (let listName of listNames)
                            {
                                for (let dependency of npmPackage[listName].Entries)
                                {
                                    for (let innerListName of listNames)
                                    {
                                        if (innerListName === listName)
                                        {
                                            doesNotThrow(
                                                () =>
                                                {
                                                    collection.LoadPackageDependencies(
                                                        [
                                                            dependency[0]
                                                        ],
                                                        innerListName);
                                                });

                                            strictEqual(
                                                collection.LoadPackageDependencies(
                                                    [
                                                        dependency[0]
                                                    ],
                                                    innerListName).Get(dependency[0]),
                                                dependency[1]);
                                        }
                                        else
                                        {
                                            throws(
                                                () =>
                                                {
                                                    collection.LoadPackageDependencies(
                                                        [
                                                            dependency[0]
                                                        ],
                                                        innerListName);
                                                });
                                        }
                                    }
                                }
                            }
                        });

                    test(
                        `Checking whether changes made to the \`${nameof<TestPackageDependencyCollection>((c) => c.Package)}\` take affect immediately…`,
                        () =>
                        {
                            let randomDependencyName = context.Random.string(10);
                            npmPackage.Dependencies.Add(randomDependencyName, randexp(/\d+\.\d+\.\d+/));

                            doesNotThrow(
                                () =>
                                {
                                    collection.LoadPackageDependencies(
                                        [
                                            randomDependencyName
                                        ]);
                                });
                        });
                });
        });
}
