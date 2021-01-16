export const urlEncodeObject = (record: Record<string, string>) => {
    const recordKeys = Object.keys(record);
    return recordKeys.reduce((queryString, key) => {
        const newKey = `${key}=${encodeURIComponent(record[key])}`;
        return queryString + (queryString ? '&' : '') + newKey;
    }, '');
};
