import { fileURLToPath } from "node:url";
import { findUp } from "find-up";
import fs from "fs-extra";
import RandExp from "randexp";
import { Random } from "random-js";
import { PropertyDictionary } from "../Collections/PropertyDictionary.js";
import { IPackageMetadata } from "../IPackageMetadata.js";
import { Package } from "../Package.js";

const { readFile } = fs;
const { randexp } = RandExp;

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
     *
     * @returns The names of the dependencies of the package.
     */
    public async GetDependencies(): Promise<string[]>
    {
        if (this.dependencies === null)
        {
            let npmPackage: IPackageMetadata = JSON.parse(
                (await readFile(
                    await findUp(
                        Package.FileName,
                        {
                            cwd: fileURLToPath(new URL(".", import.meta.url))
                        }))).toString());

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
     *
     * @returns A component for generating random dependencies.
     */
    public async *GetDependencyGenerator(): AsyncGenerator<string, string>
    {
        while (true)
        {
            yield this.Random.pick(await this.GetDependencies());
        }
    }

    /**
     * Gets a component for generating random dependency-lists.
     *
     * @returns A component for generating random dependency-lists.
     */
    public async *GetDependencyListGenerator(): AsyncGenerator<string[], string[]>
    {
        while (true)
        {
            yield this.Random.sample(
                await this.GetDependencies(),
                this.Random.integer(1, (await this.GetDependencies()).length - 1));
        }
    }

    /**
     * Gets a component for generating random dependency-sets.
     *
     * @returns A component for generating random dependency-sets.
     */
    public async *GetDependencySetGenerator(): AsyncGenerator<Record<string, string>, Record<string, string>>
    {
        while (true)
        {
            let result: Record<string, string> = {};

            for (let dependency of (await this.GetDependencyListGenerator().next()).value)
            {
                result[dependency] = randexp(/\d+\.\d+\.\d+/);
            }

            yield result;
        }
    }

    /**
     * Gets a random dependency-name.
     *
     * @returns A random dependency-name.
     */
    public async GetRandomDependencyName(): Promise<string>
    {
        return (await this.GetDependencyGenerator().next()).value;
    }

    /**
     * Gets a random dependency.
     *
     * @returns A random dependency.
     */
    public async GetRandomDependency(): Promise<[string, string]>
    {
        return this.Random.pick(new PropertyDictionary(await this.GetRandomDependencySet()).Entries);
    }

    /**
     * Gets a random dependency-list.
     *
     * @returns A random dependency-list.
     */
    public async GetRandomDependencyList(): Promise<string[]>
    {
        return (await this.GetDependencyListGenerator().next()).value;
    }

    /**
     * Gets a random dependency-set.
     *
     * @returns A random dependency-set.
     */
    public async GetRandomDependencySet(): Promise<Record<string, string>>
    {
        return (await this.GetDependencySetGenerator().next()).value;
    }
}
