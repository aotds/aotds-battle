export const matches = (conditions) => (target) =>
    Object.entries(conditions).every(([key, value]) =>
        typeof value === 'function'
            ? value(target[key])
            : target[key] === value,
    );
