import {atom} from "recoil";

export const exampleAtom = atom<Array<string>>({
    key: 'example',
    default: ['a', 'b', 'c']
});