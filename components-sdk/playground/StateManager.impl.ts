import { stateKeyType, StateManager } from '../src/polyfills/StateManager';

export class DummyStateManager implements StateManager {
    deleteKey(props: {
        key: stateKeyType;
        decoupleFrom?: string | undefined;
        removeKeyParent?: stateKeyType | undefined;
    }) {
        console.log('deleteKey', props);
    }

    appendKey<T>(props: { key: stateKeyType; value: T }) {
        console.log('appendKey', props);
    }

    setKey<T>(props: { key: stateKeyType; value: T }) {
        console.log('setKey', props);
    }

    wrapKey<T>(props: { key: stateKeyType; toArray: boolean; innerKey: string; value: T }) {
        console.log('wrapKey', props);
    }
}
