import { exampleAtom } from 'state/atom/example';
import { RecoilState } from 'recoil';

const AllAtoms: { [key: string]: RecoilState<any> } = {
    example: exampleAtom,
};

export default AllAtoms;
