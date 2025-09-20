import { ClosestState, DragContextType, DroppableState, KeyToDeleteType } from './types';
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StateManager } from '../polyfills/StateManager';
import { DragEvents } from './DragEvents';
import { BoundariesProps } from './boundaries';

const DragContext = createContext<DragContextType | undefined>(undefined);

export function useDragContext(): DragContextType {
    const context = useContext(DragContext);
    if (!context) {
        throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider');
    }
    return context;
}

export const DragContextProvider: FC<{
    children: ReactNode;
    stateManager: StateManager
} & BoundariesProps> = ({
          children,
          stateManager,
          boundaries
      }) => {
    const refs = useRef<Set<DroppableState>>(new Set());

    const register = useCallback((ref: DroppableState) => {
        refs.current.add(ref);
    }, [refs]);

    const unregister = useCallback((ref: DroppableState) => {
        refs.current.delete(ref);
    }, [refs]);

    const [visible, setVisible] = useState<ClosestState | null>(null);
    const keyToDelete = useRef<KeyToDeleteType | null>(null);

    const value = useMemo<DragContextType>(() => ({
        refs,
        register,
        unregister,
        visible,
        setVisible,
        keyToDelete,
    }), [refs, register, unregister, visible, setVisible]);

    return (
        <DragContext.Provider value={value}>
            <DragEvents stateManager={stateManager} boundaries={boundaries}>{children}</DragEvents>
        </DragContext.Provider>
    );
};