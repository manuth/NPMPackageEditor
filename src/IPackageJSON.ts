import { IBinCollection } from "./Management/IBinCollection";
import { IBugInfo } from "./Management/IBugInfo";
import { IDirectoryStructure } from "./Management/IDirectoryStructure";
import { IRepository } from "./Management/IRepository";
import { IShimCollection } from "./Management/IShimCollection";
import { PackagePerson } from "./Management/PackagePerson";

/**
 * Represents a `package.json`-file.
 */
export interface IPackageJSON
{
    /**
     * The name of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#name
     */
    name?: string;

    /**
     * The version of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#version
     */
    version?: string;

    /**
     * The description of the package.
     *
     * This helps people discover your package, as it's listed in `npm search`.
     *
     * @see https://docs.npmjs.com/files/package.json#description-1
     */
    description?: string;

    /**
     * The author of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#people-fields-author-contributors
     */
    author?: PackagePerson;

    /**
     * The maintainers of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#people-fields-author-contributors
     */
    maintainers?: PackagePerson[];

    /**
     * The contributors of the project.
     *
     * @see https://docs.npmjs.com/files/package.json#people-fields-author-contributors
     */
    contributors?: PackagePerson[];

    /**
     * The license of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#license
     */
    license?: string;

    /**
     * The keywords of the package.
     *
     * This helps people discover your package, as it's listed in `npm search`.
     *
     * @see https://docs.npmjs.com/files/package.json#keywords
     */
    keywords?: string[];

    /**
     * The primary entry point of the program.
     *
     * @see https://docs.npmjs.com/files/package.json#main
     */
    main?: string;

    /**
     * The path to the bundled declaration file.
     */
    types?: string;

    /**
     * The url to the project homepage.
     *
     * @see https://docs.npmjs.com/files/package.json#homepage
     */
    homepage?: string;

    /**
     * The links for reporting bugs.
     *
     * @see https://docs.npmjs.com/files/package.json#bugs
     */
    bugs?: string | IBugInfo;

    /**
     * A set of files to include into the package.
     *
     * @see https://docs.npmjs.com/files/package.json#files
     */
    files?: string[];

    /**
     * A hint to javascript bundlers for packaging modules for client side use.
     *
     * @see https://docs.npmjs.com/files/package.json#browser
     */
    browser?: string | IShimCollection;

    /**
     * A set of executables to add to `PATH`.
     *
     * @see https://docs.npmjs.com/files/package.json#bin
     */
    bin?: string | IBinCollection;

    /**
     * Filenames to put in place for the `man` program to find.
     *
     * @see https://docs.npmjs.com/files/package.json#man
     */
    man?: string | string[];

    /**
     * The directory-structure of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#directories
     */
    directories?: IDirectoryStructure;

    /**
     * The repository of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#repository
     */
    repository?: string | IRepository;

    /**
     * A set of script-commands for the package.
     *
     * @see https://docs.npmjs.com/files/package.json#scripts
     */
    scripts?: Record<string, string>;

    /**
     * A set of persistent configurations.
     *
     * @see https://docs.npmjs.com/files/package.json#config
     */
    config?: Record<string, any>;

    /**
     * A set of dependencies of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#dependencies
     */
    dependencies?: Record<string, string>;

    /**
     * A set of development-dependencies of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#devdependencies
     */
    devDependencies?: Record<string, string>;

    /**
     * A set of peer-dependencies of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#peerdependencies
     */
    peerDependencies?: Record<string, string>;

    /**
     * A set of dependencies to include into `.tgz`-packages.
     *
     * @see https://docs.npmjs.com/files/package.json#bundleddependencies
     */
    bundledDependencies?: string[];

    /**
     * A set of optional dependencies of the package.
     *
     * @see https://docs.npmjs.com/files/package.json#optionaldependencies
     */
    optionalDependencies?: Record<string, string>;

    /**
     * A set of engines which are required for running the package.
     *
     * @see https://docs.npmjs.com/files/package.json#engines
     */
    engines?: Record<string, string>;

    /**
     * The operating-systems supported by this package.
     *
     * @see https://docs.npmjs.com/files/package.json#os
     */
    os?: string[];

    /**
     * The CPU architectures supported by this package.
     *
     * @see https://docs.npmjs.com/files/package.json#cpu
     */
    cpu?: string[];

    /**
     * A value indicating whether the package is private.
     *
     * @see https://docs.npmjs.com/files/package.json#private
     */
    private?: boolean;

    /**
     * The npm configuration to use while publishing.
     */
    publishConfig?: Record<string, any>;
}
