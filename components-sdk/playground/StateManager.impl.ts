import {
    addKeyType,
    appendKeyType,
    deleteKeyType,
    setKeyType,
    StateManager,
    wrapKeyType,
} from '../src/polyfills/StateManager';

export class DummyStateManager implements StateManager {
    deleteKey(props: deleteKeyType) {
        console.log('deleteKey', props);
    }

    appendKey<T>(props: appendKeyType<T>) {
        console.log('appendKey', props);
    }

    setKey<T>(props: setKeyType<T>) {
        console.log('setKey', props);
    }

    wrapKey<T>(props: wrapKeyType<T>) {
        console.log('wrapKey', props);
    }

    addKey<T>(props: addKeyType<T>) {
        console.log('addKey', props);
    }
}
