function flattenErrorsInt(obj: Record<string, unknown>): string[] {
    if ('_errors' in obj && Array.isArray(obj._errors)) {
        return (obj._errors as Array<{
            message: string
        }>).map(o => o.message);
    }

    return Object.values(obj)
        .filter((value): value is Record<string, unknown> =>
            value !== null && typeof value === 'object' && !Array.isArray(value))
        .reduce((acc: string[], value) => {
            return [...acc, ...flattenErrorsInt(value)];
        }, []);
}

export function flattenErrors(errors: Record<string, unknown>): string[] {
    // Deduplicate errors
    const uniqueErrors = new Set<string>();
    const flattenedErrors = flattenErrorsInt(errors);
    for (const error of flattenedErrors) {
        uniqueErrors.add(error);
    }
    return Array.from(uniqueErrors);
}

export function hasErrorsWithoutComponents(
    errors: Record<string, unknown>
): boolean {
    if ("components" in errors) return Object.keys(errors).length > 1;
    return Object.keys(errors).length > 0;
}

export function flattenErrorsWithoutComponents(
    errors: Record<string, unknown>
): string[] {
    const newErrors = { ...errors };
    if ("components" in newErrors) delete newErrors.components;

    return flattenErrors(newErrors);
}