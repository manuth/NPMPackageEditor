import { doesNotThrow, ok, strictEqual, throws } from "assert";
import { Random } from "random-js";
import { Dictionary } from "../../Collections/Dictionary.js";
import { DependencyCollection } from "../../Management/DependencyCollection.js";
import { IDependencyCollectionOptions } from "../../Management/IDependencyCollectionOptions.js";
import { KeyOfType } from "../../Management/KeyOfType.js";
import { TestContext } from "../TestContext.js";

/**
 * Registers tests for the {@link DependencyCollection `DependencyCollection`} class.
 *
 * @param context
 * The test-context.
 */
export function DependencyCollectionTests(context: TestContext): void
{
    suite(
        nameof(DependencyCollection),
        () =>
        {
            let random: Random;
            let collectionOptions: IDependencyCollectionOptions;
            let collection: DependencyCollection;

            suiteSetup(
                async () =>
                {
                    random = new Random();

                    collectionOptions = {
                        dependencies: await context.GetRandomDependencySet(),
                        devDependencies: await context.GetRandomDependencySet(),
                        peerDependencies: await context.GetRandomDependencySet(),
                        optionalDependencies: await context.GetRandomDependencySet(),
                        bundledDependencies: await context.GetRandomDependencyList()
                    };
                });

            setup(
                () =>
                {
                    collection = new DependencyCollection(collectionOptions);
                });

            suite(
                nameof<DependencyCollection>((collection) => collection.Register),
                () =>
                {
                    /**
                     * Gets the names of the dependency-sets.
                     *
                     * @returns
                     */
                    function GetDependencySetNames(): Array<KeyOfType<DependencyCollection, Dictionary<string, string>>>
                    {
                        return [
                            nameof<DependencyCollection>((collection) => collection.Dependencies),
                            nameof<DependencyCollection>((collection) => collection.DevelopmentDependencies),
                            nameof<DependencyCollection>((collection) => collection.OptionalDependencies),
                            nameof<DependencyCollection>((collection) => collection.PeerDependencies)
                        ] as Array<KeyOfType<DependencyCollection, Dictionary<string, string>>>;
                    }

                    /**
                     * Gets the dependency-sets of the {@link collection `collection`}.
                     *
                     * @returns
                     * The dependency-sets of the {@link collection `collection`}.
                     */
                    function GetDependencySets(): Array<Dictionary<string, string>>
                    {
                        return GetDependencySetNames().map(
                            (key) =>
                            {
                                return collection[key];
                            });
                    }

                    test(
                        "Checking whether additional dependencies can be added…",
                        () =>
                        {
                            let dependencyName = "additional-dependency";
                            let dependencyVersion = "*";

                            let dependency = {
                                [dependencyName]: dependencyVersion
                            };

                            collection.Register(
                                new DependencyCollection(
                                    {
                                        dependencies: dependency,
                                        devDependencies: dependency,
                                        peerDependencies: dependency,
                                        optionalDependencies: dependency,
                                        bundledDependencies: [dependencyName]
                                    }));

                            for (let dependencySet of GetDependencySets())
                            {
                                ok(dependencySet.Has(dependencyName));
                                strictEqual(dependencySet.Get(dependencyName), dependencyVersion);
                            }

                            ok(collection.BundledDependencies.Contains(dependencyName));
                        });

                    test(
                        "Checking whether adding duplicate dependencies to the dependency-sets throws an error…",
                        () =>
                        {
                            for (let dependencySet of GetDependencySetNames())
                            {
                                let otherCollection = new DependencyCollection();
                                let dependency = random.pick(collection[dependencySet].Keys);
                                otherCollection[dependencySet].Add(dependency, null);
                                throws(() => collection.Register(otherCollection));
                            }
                        });

                    test(
                        `Checking whether duplicate \`${nameof<DependencyCollection>((dc) => dc.BundledDependencies)}\` are ignored…`,
                        () =>
                        {
                            let otherCollection = new DependencyCollection();
                            let startLength = collection.BundledDependencies.Count;
                            otherCollection.BundledDependencies.Add(random.pick(collection.BundledDependencies.Values));
                            collection.Register(otherCollection);
                            strictEqual(collection.BundledDependencies.Count, startLength);
                        });
                });

            suite(
                nameof<DependencyCollection>((collection) => collection.AllDependencies),
                () =>
                {
                    let randomDependency: [string, string];

                    setup(
                        async () =>
                        {
                            randomDependency = await context.GetRandomDependency();
                        });

                    test(
                        "Checking whether all dependencies can be queried even if they are present in multiple sets…",
                        () =>
                        {
                            collection.Clear();
                            collection.DevelopmentDependencies.Add(randomDependency[0], randomDependency[1]);
                            collection.OptionalDependencies.Add(randomDependency[0], randomDependency[1]);
                            ok(collection.DevelopmentDependencies.Has(randomDependency[0]));
                            ok(collection.OptionalDependencies.Has(randomDependency[0]));
                            doesNotThrow(() => collection.AllDependencies);
                            ok(collection.AllDependencies.Has(randomDependency[0]));
                        });
                });
        });
}
