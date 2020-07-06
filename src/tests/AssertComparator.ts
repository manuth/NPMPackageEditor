/**
 * Provides the functionality to assert the equality of two objects.
 */
export type AssertComparator<T1, T2> =
    /**
     * Asserts the equality of two objects.
     *
     * @param x
     * The first object to compare.
     *
     * @param y
     * The second object to compare.
     */
    (x: T1, y: T2) => void;
