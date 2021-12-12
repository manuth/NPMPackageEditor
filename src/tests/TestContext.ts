import { findUpSync } from "find-up";
import { readFileSync } from "fs-extra";
import { randexp } from "randexp";
import { Random } from "random-js";
import { PropertyDictionary } from "../Collections/PropertyDictionary";
import { IPackageMetadata } from "../IPackageMetadata";
import { Package } from "../Package";

/**
 * Provides a context for testing the package.
 */
export class TestContext
{
    /**
     * The dependencies of the package.
     */
    private dependencies: string[] = null;

    /**
     * A component for creating random data.
     */
    private random = new Random();

    /**
     * Initializes a new instance of the {@link TestContext `TestContext`}.
     */
    public constructor()
    { }

    /**
     * Gets a component for creating random data.
     */
    public get Random(): Random
    {
        return this.random;
    }

    /**
     * Gets the names of the dependencies of the package.
     */
    public get Dependencies(): string[]
    {
        if (this.dependencies === null)
        {
            let npmPackage: IPackageMetadata = JSON.parse(readFileSync(findUpSync(Package.FileName, { cwd: __dirname })).toString());

            this.dependencies = [
                ...Object.keys(
                    {
                        ...npmPackage.dependencies,
                        ...npmPackage.devDependencies,
                        ...npmPackage.optionalDependencies,
                        ...npmPackage.peerDependencies
                    }),
                ...(npmPackage.bundledDependencies ?? [])
            ];
        }

        return this.dependencies;
    }

    /**
     * Gets a component for generating random dependencies.
     */
    public get DependencyGenerator(): Generator<string, string>
    {
        let self = this;

        return (
            function*()
            {
                while (true)
                {
                    yield self.Random.pick(self.Dependencies);
                }
            })();
    }

    /**
     * Gets a component for generating random dependency-lists.
     */
    public get DependencyListGenerator(): Generator<string[], string[]>
    {
        let self = this;

        return (
            function*()
            {
                while (true)
                {
                    yield self.Random.sample(self.Dependencies, self.Random.integer(1, self.Dependencies.length - 1));
                }
            })();
    }

    /**
     * Gets a component for generating random dependency-sets.
     */
    public get DependencySetGenerator(): Generator<Record<string, string>, Record<string, string>>
    {
        let self = this;

        return (
            function*()
            {
                while (true)
                {
                    let result: Record<string, string> = {};

                    for (let dependency of self.DependencyListGenerator.next().value)
                    {
                        result[dependency] = randexp(/\d+\.\d+\.\d+/);
                    }

                    yield result;
                }
            })();
    }

    /**
     * Gets a random dependency-name.
     */
    public get RandomDependencyName(): string
    {
        return this.DependencyGenerator.next().value;
    }

    /**
     * Gets a random dependency.
     */
    public get RandomDependency(): [string, string]
    {
        return this.Random.pick(new PropertyDictionary(this.RandomDependencySet).Entries);
    }

    /**
     * Gets a random dependency-list.
     */
    public get RandomDependencyList(): string[]
    {
        return this.DependencyListGenerator.next().value;
    }

    /**
     * Gets a random dependency-set.
     */
    public get RandomDependencySet(): Record<string, string>
    {
        return this.DependencySetGenerator.next().value;
    }
}
