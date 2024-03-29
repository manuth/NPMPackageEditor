import { IBinCollection } from "./Management/IBinCollection.js";
import { IBugInfo } from "./Management/IBugInfo.js";
import { IDependencyCollectionOptions } from "./Management/IDependencyCollectionOptions.js";
import { IDirectoryStructure } from "./Management/IDirectoryStructure.js";
import { IRepository } from "./Management/IRepository.js";
import { IShimCollection } from "./Management/IShimCollection.js";
import { PackagePerson } from "./Management/PackagePerson.js";
import { PackageType } from "./PackageType.js";
import { ResolveMatrix } from "./ResolveMatrix.js";

/**
 * Represents the metadata of a `package.json`-file.
 */
export interface IPackageMetadata extends IDependencyCollectionOptions
{
    /**
     * The name of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#name
     */
    name?: string;

    /**
     * The version of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#version
     */
    version?: string;

    /**
     * The type of the package.
     *
     * @see https://nodejs.org/api/packages.html#type
     */
    type?: PackageType;

    /**
     * A value indicating whether the package is private.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#private
     */
    private?: boolean;

    /**
     * The description of the package.
     *
     * This helps people discover your package, as it's listed in `npm search`.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#description
     */
    description?: string;

    /**
     * The author of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors
     */
    author?: PackagePerson;

    /**
     * The maintainers of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors
     */
    maintainers?: PackagePerson[];

    /**
     * The contributors of the project.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#people-fields-author-contributors
     */
    contributors?: PackagePerson[];

    /**
     * The license of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#license
     */
    license?: string;

    /**
     * The keywords of the package.
     *
     * This helps people discover your package, as it's listed in `npm search`.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#keywords
     */
    keywords?: string[];

    /**
     * A set of engines which are required for running the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines
     */
    engines?: Record<string, string>;

    /**
     * The operating-systems supported by this package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#os
     */
    os?: string[];

    /**
     * The CPU architectures supported by this package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#cpu
     */
    cpu?: string[];

    /**
     * The entry points of the package.
     *
     * @see https://nodejs.org/api/packages.html#exports
     */
    exports?: string | string[] | ResolveMatrix;

    /**
     * The subpath imports for this package.
     *
     * @see https://nodejs.org/api/packages.html#imports
     */
    imports?: ResolveMatrix;

    /**
     * The primary entry point of the program.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main
     */
    main?: string;

    /**
     * The path to the bundled declaration file.
     */
    types?: string;

    /**
     * A hint to javascript bundlers for packaging modules for client side use.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#browser
     */
    browser?: string | IShimCollection;

    /**
     * A set of executables to add to `PATH`.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin
     */
    bin?: string | IBinCollection;

    /**
     * Filenames to put in place for the `man` program to find.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#man
     */
    man?: string | string[];

    /**
     * A set of files to include into the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files
     */
    files?: string[];

    /**
     * The directory-structure of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#directories
     */
    directories?: IDirectoryStructure;

    /**
     * The url to the project homepage.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#homepage
     */
    homepage?: string;

    /**
     * The repository of the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#repository
     */
    repository?: string | IRepository;

    /**
     * The links for reporting bugs.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bugs
     */
    bugs?: string | IBugInfo;

    /**
     * A set of persistent configurations.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#config
     */
    config?: Record<string, any>;

    /**
     * The npm configuration to use while publishing.
     */
    publishConfig?: Record<string, any>;

    /**
     * A set of script-commands for the package.
     *
     * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-json#scripts
     */
    scripts?: Record<string, string>;
}
