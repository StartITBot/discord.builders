export type stateKeyType = (string | number)[]


export type wrapKeyType<T> = {
    key: stateKeyType;
    toArray: boolean;
    innerKey: string;
    value: T;
};

export type setKeyType<T> = {
    key: stateKeyType;
    value: T;
};

export type addKeyType<T> = {
    key: stateKeyType;
    index: number;
    value: T;
    deleteKey?: stateKeyType;
    decoupleFrom?: string | undefined;
    removeKeyParent?: stateKeyType | undefined;
};

export type appendKeyType<T> = {
    key: stateKeyType;
    value: T;
};

export type deleteKeyType = {
    key: stateKeyType;
    decoupleFrom?: string | undefined;
    removeKeyParent?: stateKeyType | undefined;
};

export interface StateManager {
    deleteKey({key, decoupleFrom, removeKeyParent}: deleteKeyType): void,
    appendKey<T>({key, value}: appendKeyType<T>): void,
    addKey<T>({key, index, value}: addKeyType<T>): void,
    setKey<T>({key, value}: setKeyType<T>): void,
    wrapKey<T>({key, toArray, innerKey, value}: wrapKeyType<T>): void,
}

