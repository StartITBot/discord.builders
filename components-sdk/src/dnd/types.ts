import { stateKeyType } from '../polyfills/StateManager';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { DroppableID } from './components';

export interface KeyToDeleteType {
    readonly sessionId: string;
    readonly stateKey: stateKeyType;
    readonly removeKeyParent?: stateKeyType;
    readonly decoupleFrom?: string;
}

export interface DragContextType {
    refs: MutableRefObject<Set<DroppableState>>;
    visible: ClosestState | null;
    setVisible: Dispatch<SetStateAction<ClosestState | null>>;
    keyToDelete: MutableRefObject<KeyToDeleteType | null>;
    register: (state: DroppableState) => void;
    unregister: (state: DroppableState) => void;
}


export interface DroppableState {
    readonly element: HTMLElement | null;
    readonly stateKey: stateKeyType;
    readonly droppableId: DroppableID;
}

export enum ClosestType {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    CENTER,
}

export interface ClosestState {
    readonly ref: DroppableState;
    readonly type: ClosestType;
}


export interface DistanceProps {
    readonly closest: ClosestState | undefined;
    readonly closestDistance: number;
    readonly ref: DroppableState;
    readonly visible: ClosestState | null;
    readonly activeDistance: number;
    readonly mouseY: number;
    readonly mouseX: number;
}

export type DistanceReturn = Pick<DistanceProps, 'closest' | 'closestDistance' | 'activeDistance'>