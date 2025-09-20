import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { uuidv4 } from './randomGen';
import {
    addKeyType,
    appendKeyType,
    deleteKeyType,
    setKeyType,
    StateManager,
    wrapKeyType
} from '../polyfills/StateManager';

const RandomStringContext = createContext<string>(uuidv4());

export function useRandomString(): string {
    const context = useContext(RandomStringContext);
    if (!context) {
        throw new Error('useRandomString must be used within a RegenerateContextProvider');
    }
    return context;
}

export const RegenerateContextProvider: FC<{ children: (stateMng: StateManager) => ReactNode; stateManager: StateManager }> = ({ children, stateManager }) => {
    const [randomString, setRandomString] = useState<string>(uuidv4);
    /** String is randomized to force re-render of components if not straightforward action is made */

    const stateMng: StateManager = useMemo(
        () => ({
            deleteKey({ key, decoupleFrom, removeKeyParent }: deleteKeyType) {
                stateManager.deleteKey({ key, decoupleFrom, removeKeyParent });
                setRandomString(uuidv4()); // Order is changed
            },

            addKey<T>({ key, index, value, deleteKey, decoupleFrom, removeKeyParent }: addKeyType<T>) {
                stateManager.addKey({ key, index, value, deleteKey, decoupleFrom, removeKeyParent });
                setRandomString(uuidv4()); // Order is changed
            },

            wrapKey<T>({ key, toArray, innerKey, value }: wrapKeyType<T>) {
                stateManager.wrapKey({ key, toArray, innerKey, value });
                // We probably don't need to regenerate components here
            },

            setKey<T>({ key, value }: setKeyType<T>) {
                stateManager.setKey({ key, value });
                // Set key is a simple action, don't need to regenerate components
            },

            appendKey<T>({ key, value }: appendKeyType<T>) {
                stateManager.appendKey({ key, value });
                // Append, unlike addKey, does not mess with the order of components
            },
        }),
        [stateManager]
    );

    return (
        <RandomStringContext.Provider value={randomString}>{children(stateMng)}</RandomStringContext.Provider>
    );
};