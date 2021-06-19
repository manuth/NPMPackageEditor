import { ok, strictEqual, throws } from "assert";
import findUp = require("find-up");
import { readFile } from "fs-extra";
import { Random } from "random-js";
import { Dictionary } from "../../Collections/Dictionary";
import { DependencyCollection } from "../../Management/DependencyCollection";
import { IDependencyCollectionOptions } from "../../Management/IDependencyCollectionOptions";
import { KeyOfType } from "../../Management/KeyOfType";

/**
 * Registers tests for the {@link DependencyCollection `DependencyCollection`} class.
 */
export function DependencyCollectionTests(): void
{
    suite(
        "DependencyCollection",
        () =>
        {
            let random: Random;
            let collectionOptions: IDependencyCollectionOptions;
            let collection: DependencyCollection;
            let dependencyGenerator: Generator<Record<string, string>, Record<string, string>>;

            suiteSetup(
                async () =>
                {
                    random = new Random();
                    dependencyGenerator = await GetDependencyGenerator();

                    collectionOptions = {
                        dependencies: GetRandomDependency(),
                        devDependencies: GetRandomDependency(),
                        peerDependencies: GetRandomDependency(),
                        optionalDependencies: GetRandomDependency(),
                        bundledDependencies: Object.keys(GetRandomDependency())
                    };
                });

            setup(
                () =>
                {
                    collection = new DependencyCollection(collectionOptions);
                });

            /**
             * Provides the functionality to generate dependencies.
             *
             * @returns
             * A component for generating dependencies.
             */
            async function GetDependencyGenerator(): Promise<Generator<Record<string, string>, Record<string, string>>>
            {
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

                let dependencies = Object.keys(
                    JSON.parse(
                        (await readFile(
                            (await findUp("package.json", { cwd: __dirname })))).toString()).dependencies);

                /**
                 * Creates the generator.
                 *
                 * @returns
                 * The new generator.
                 */
                let generator = function*(): Generator<Record<string, string>, Record<string, string>>
                {
                    while (true)
                    {
                        let result: Record<string, string> = {};

                        for (let name of random.sample(dependencies, random.integer(1, dependencies.length - 1)))
                        {
                            result[name] = `${digit()}.${digit()}.${digit()}`;
                        }

                        yield result;
                    }
                };

                return generator();
            }

            /**
             * Generates a random dependency.
             *
             * @returns
             * A set of random dependencies.
             */
            function GetRandomDependency(): Record<string, string>
            {
                return dependencyGenerator.next().value;
            }

            suite(
                "Register",
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
                            "Dependencies",
                            "DevelopmentDependencies",
                            "OptionalDependencies",
                            "PeerDependencies"
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
                        "Checking whether duplicate `BundledDependencies` are ignored…",
                        () =>
                        {
                            let otherCollection = new DependencyCollection();
                            let startLength = collection.BundledDependencies.Count;
                            otherCollection.BundledDependencies.Add(random.pick(collection.BundledDependencies.Values));
                            collection.Register(otherCollection);
                            strictEqual(collection.BundledDependencies.Count, startLength);
                        });
                });
        });
}
