/**
 * Provides the functionality to check the validity of a property.
 */
export type PropertyChecker<T1, T2> =
    /**
     * Checks the validity of a property.
     *
     * @param x
     * The value of the property.
     *
     * @param y
     * The value to check the property against.
     */
    (x: T1, y: T2) => void;
