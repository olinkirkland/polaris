export function getNestedValue(object: any, path: string): any {
    const value = path.split('.').reduce((acc, key) => acc?.[key], object);
    // console.log('@getNestedValue', path, value);
    return value;
}

export function setNestedValue(object: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const lastObj = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {}; // Create nested object if it doesn't exist
        return acc[key];
    }, object);
    lastObj[lastKey] = value;
    // console.log('@setNestedValue', path, value);
}
