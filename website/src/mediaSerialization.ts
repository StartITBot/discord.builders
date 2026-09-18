export function withMediaProxyUrls(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(withMediaProxyUrls);
    if (value === null || typeof value !== 'object') return value;

    return Object.fromEntries(Object.entries(value).map(([key, inner]) => {
        if (
            (key === 'media' || key === 'file') &&
            inner !== null &&
            typeof inner === 'object' &&
            'url' in inner &&
            typeof inner.url === 'string' &&
            !inner.url.startsWith('attachment://')
        ) {
            return [key, {
                ...inner,
                proxy_url: inner.url,
            }];
        }

        return [key, withMediaProxyUrls(inner)];
    }));
}

export function migrateMediaUrls(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(migrateMediaUrls);
    if (value === null || typeof value !== 'object') return value;

    return Object.fromEntries(Object.entries(value).map(([key, inner]) => {
        if (
            (key === 'media' || key === 'file') &&
            inner !== null &&
            typeof inner === 'object' &&
            !('url' in inner) &&
            'proxy_url' in inner &&
            typeof inner.proxy_url === 'string'
        ) {
            return [key, {...inner, url: inner.proxy_url}];
        }

        return [key, migrateMediaUrls(inner)];
    }));
}
