// This comment is required by one of the rendering modes /** @module @std/assert/almost-equals */
// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion_error.ts";

/**
 * Make an assertion that `actual` and `expected` are almost equal numbers
 * through a given tolerance. It can be used to take into account IEEE-754
 * double-precision floating-point representation limitations. If the values
 * are not almost equal then throw.
 *
 * The default tolerance is one hundred thousandth of a percent of the
 * expected value.
 *
 * @example Usage
 * ```ts ignore
 * import { assertAlmostEquals } from "@std/assert";
 *
 * assertAlmostEquals(0.01, 0.02); // Throws
 * assertAlmostEquals(1e-8, 1e-9); // Throws
 * assertAlmostEquals(1.000000001e-8, 1.000000002e-8); // Doesn't throw
 * assertAlmostEquals(0.01, 0.02, 0.1); // Doesn't throw
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-16); // Doesn't throw
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-17); // Throws
 * ```
 *
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param tolerance The tolerance to consider the values almost equal. The
 * default is one hundred thousandth of a percent of the expected value.
 * @param msg The optional message to include in the error.
 */
export function assertAlmostEquals(
  actual: number,
  expected: number,
  tolerance?: number,
  msg?: string,
) {
  if (Object.is(actual, expected)) {
    return;
  }
  const delta = Math.abs(expected - actual);
  if (tolerance === undefined) {
    tolerance = isFinite(expected) ? Math.abs(expected * 1e-7) : 1e-7;
  }
  if (delta <= tolerance) {
    return;
  }

  const msgSuffix = msg ? `: ${msg}` : ".";
  const f = (n: number) => Number.isInteger(n) ? n : n.toExponential();
  throw new AssertionError(
    `Expected actual: "${f(actual)}" to be close to "${f(expected)}": \
delta "${f(delta)}" is greater than "${f(tolerance)}"${msgSuffix}`,
  );
}
