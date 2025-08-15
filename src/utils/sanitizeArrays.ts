/**
 * Sanitizes arrays by removing undefined values to prevent JSON serialization errors
 * in Next.js getStaticProps
 *
 * @param array - Array to sanitize
 * @param context - Optional context for logging undefined values
 * @param logger - Optional logger function
 * @returns Array with undefined values removed
 */
export function sanitizeArray<T>(
  array: (T | undefined)[],
  context?: string,
  logger?: (message: string) => void
): T[] {
  const undefinedCount = array.filter((item) => item === undefined).length

  if (undefinedCount > 0 && logger && context) {
    const originalLength = array.length
    const sanitizedLength = array.length - undefinedCount
    logger(
      `Found ${undefinedCount} undefined value(s) in array for ${context}. Original length: ${originalLength}, sanitized length: ${sanitizedLength}`
    )
  }

  return array.filter((item): item is T => item !== undefined)
}

/**
 * Sanitizes objects by removing undefined values from arrays within the object
 * to prevent JSON serialization errors in Next.js getStaticProps
 *
 * @param obj - Object containing arrays that may have undefined values
 * @returns Object with sanitized arrays
 */
export function sanitizeObjectArrays<T extends Record<string, unknown>>(
  obj: T
): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeArray(sanitized[key] as unknown[]) as T[Extract<
        keyof T,
        string
      >]
    }
  }

  return sanitized
}
