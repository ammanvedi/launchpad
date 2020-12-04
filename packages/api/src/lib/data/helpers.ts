type ObjectWithId<T = string> = {
    id: T
};
type KeyedObj<R extends Object, KEY = string> = {
    [key: string]: R
}
const arrayToObjectById = <R extends ObjectWithId<ID_TYPE>,
    ID_TYPE extends string | number>(arr: Array<R>): KeyedObj<R, ID_TYPE> => {
    return arr.reduce((prev, curr, ix, arr) => {
        return {
            ...prev,
            [curr.id]: curr
        }
    }, {})
}
export const alignResponsesToBatchKeys = <R extends ObjectWithId<ID_TYPE>,
    KEY_TYPE extends string | number,
    ID_TYPE extends string | number = string>(
    keys: Readonly<Array<KEY_TYPE>>,
    responses: Array<R>,
    getError: (key: KEY_TYPE) => Error
): Array<R | Error> => {
    const mapped = arrayToObjectById(
        responses
    );

    return keys.map(key => {
        return mapped[key] || getError(key)
    })
}