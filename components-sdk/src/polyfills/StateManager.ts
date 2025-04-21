export type stateKeyType = (string | number)[];

export interface StateManager {
    deleteKey({
        key,
        decoupleFrom,
        removeKeyParent,
    }: {
        key: stateKeyType;
        decoupleFrom?: string;
        removeKeyParent?: stateKeyType;
    }): void;
    appendKey<T>({ key, value }: { key: stateKeyType; value: T }): void;
    setKey<T>({ key, value }: { key: stateKeyType; value: T }): void;
    wrapKey<T>({
        key,
        toArray,
        innerKey,
        value,
    }: {
        key: stateKeyType;
        toArray: boolean;
        innerKey: string;
        value: T;
    }): void;
}
