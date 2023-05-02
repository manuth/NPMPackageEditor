import { DependencyCollection } from "./DependencyCollection.js";
import { KeyOfType } from "./KeyOfType.js";
import { PackageDependencyCollectionOptions } from "./PackageDependencyCollectionOptions.js";
import { Dictionary } from "../Collections/Dictionary.js";
import { Package } from "../Package.js";

/**
 * Provides a set of dependencies which are loaded from a package.
 */
export class PackageDependencyCollection extends DependencyCollection
{
    /**
     * The package to load the dependencies from.
     */
    private sourcePackage: Package;

    /**
     * The names of the dependencies to load from the {@link PackageDependencyCollection.sourcePackage `sourcePackage`};
     */
    private dependencyNames: PackageDependencyCollectionOptions;

    /**
     * Initializes a new instance of the {@link PackageDependencyCollection `PackageDependencyCollection`} class.
     *
     * @param sourcePackage
     * The package to load the specified {@link dependencies `dependencies`} from.
     *
     * @param dependencies
     * The dependencies to load from the specified {@link sourcePackage `sourcePackage`}.
     */
    public constructor(sourcePackage: Package, dependencies: PackageDependencyCollectionOptions)
    {
        super();
        this.sourcePackage = sourcePackage;
        this.dependencyNames = dependencies;
    }

    /**
     * Gets the package to load the dependencies with the specified {@link PackageDependencyCollection.DependencyNames `DependencyNames`} from.
     */
    protected get Package(): Package
    {
        return this.sourcePackage;
    }

    /**
     * Gets the dependencies to load from the specified {@link PackageDependencyCollection.Package `Package`}.
     */
    protected get DependencyNames(): PackageDependencyCollectionOptions
    {
        return this.dependencyNames;
    }

    /**
     * @inheritdoc
     */
    public override get Dependencies(): Dictionary<string, string>
    {
        return this.LoadDependencies(
            nameof<PackageDependencyCollectionOptions>((o) => o.dependencies) as keyof PackageDependencyCollectionOptions);
    }

    /**
     * @inheritdoc
     */
    public override get DevelopmentDependencies(): Dictionary<string, string>
    {
        return this.LoadDependencies(
            nameof<PackageDependencyCollectionOptions>((o) => o.devDependencies) as keyof PackageDependencyCollectionOptions);
    }

    /**
     * @inheritdoc
     */
    public override get PeerDependencies(): Dictionary<string, string>
    {
        return this.LoadDependencies(
            nameof<PackageDependencyCollectionOptions>((o) => o.peerDependencies) as keyof PackageDependencyCollectionOptions);
    }

    /**
     * @inheritdoc
     */
    public override get OptionalDependencies(): Dictionary<string, string>
    {
        return this.LoadDependencies(
            nameof<PackageDependencyCollectionOptions>((o) => o.optionalDependencies) as keyof PackageDependencyCollectionOptions);
    }

    /**
     * Loads the dependencies specified in the list with the specified {@link listName `listName`} from the specified {@link packageListName `packageListName`} in the {@link PackageDependencyCollection.Package `Package`}.
     *
     * @param listName
     * The name of the list of dependency-names to load.
     *
     * @param packageListName
     * The name of the list of the package to load the dependency-versions from.
     *
     * @returns
     * The loaded dependencies.
     */
    protected LoadDependencies(listName: keyof PackageDependencyCollectionOptions, packageListName?: KeyOfType<DependencyCollection, Dictionary<string, string>>): Dictionary<string, string>
    {
        return this.LoadPackageDependencies(this.DependencyNames[listName] ?? [], packageListName);
    }

    /**
     * Loads the specified {@link dependencies `dependencies`} from the specified {@link packageListName `packageListName`} of the {@link PackageDependencyCollection.Package `Package`}.
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
    protected LoadPackageDependencies(dependencies: string[], packageListName = nameof<DependencyCollection>((c) => c.AllDependencies) as KeyOfType<DependencyCollection, Dictionary<string, string>>): Dictionary<string, string>
    {
        return new Dictionary(
            dependencies.map(
                (dependency) =>
                {
                    return [
                        dependency,
                        this.Package[packageListName].Get(dependency)
                    ];
                }));
    }
}
