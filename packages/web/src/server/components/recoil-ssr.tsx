import { Snapshot, useRecoilSnapshot } from 'recoil';

type RecoilStateGrabberProps = {
    onSnapshot: (snapshot: Snapshot) => void;
};

export const RecoilStateGrabber = ({ onSnapshot }: RecoilStateGrabberProps) => {
    const snapshot = useRecoilSnapshot();
    onSnapshot(snapshot);
    return null;
};

type RecoilPreloadedState = {
    [key: string]: any;
};

export const serializeRecoilState = (snapshot: Snapshot | null): string => {
    if (!snapshot) {
        return '';
    }

    const nodes = Array.from(snapshot.getNodes_UNSTABLE());

    const recoilState = nodes.reduce<RecoilPreloadedState>((state, node) => {
        const loadable = snapshot.getLoadable(node);
        if (loadable.state === 'hasValue') {
            state[node.key] = loadable.contents;
        }
        return state;
    }, {});

    return JSON.stringify(recoilState);
};
