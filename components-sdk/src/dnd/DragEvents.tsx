import { FC, ReactNode, useEffect } from 'react';
import { StateManager } from '../polyfills/StateManager';
import { DragContextType } from './types';

import { useDragContext } from './DragContext';
import { handleDragDrop } from './handleDragDrop';
import { handleDragOver } from './handleDragOver';
import { BoundariesProps, testBoundaries } from './boundaries';
import { RenderMode } from '../utils/componentTypes';

const handleDragStart = (e: DragEvent, { boundaries }: BoundariesProps) => {
    if (!testBoundaries(e.target, boundaries)) return;

    // Some items (like images) have a default dragstart event that we need to prevent
    e.preventDefault();
};

const handleDragEnd = (
    e: DragEvent,
    {
        setVisible,
        boundaries
    }: {
        setVisible: DragContextType['setVisible'];
    } & BoundariesProps
) => {
    if (!testBoundaries(e.target, boundaries)) return;

    e.preventDefault();
    setVisible(null);
};

export const DragEvents: FC<{
    children: ReactNode;
    stateManager: StateManager;
    renderMode: RenderMode;
} & BoundariesProps> = ({ children, stateManager, boundaries, renderMode }) => {
    const { refs, visible, setVisible, keyToDelete } = useDragContext();

    useEffect(() => {
        const onDragOver = (e: DragEvent) => handleDragOver(e, {
            refs,
            visible,
            setVisible,
            boundaries
        });
        const onDragStart = (e: DragEvent) => handleDragStart(e, {boundaries });
        const onDragEnd = (e: DragEvent) => handleDragEnd(e, { setVisible, boundaries });
        const onDragDrop = (e: DragEvent) => handleDragDrop(e, {
            visible,
            setVisible,
            stateManager,
            renderMode,
            keyToDelete,
            boundaries: boundaries
        });
        const onMouseUp = () => setVisible(null);

        window.addEventListener('dragstart', onDragStart);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('dragend', onDragEnd);
        window.addEventListener('drop', onDragDrop);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('dragstart', onDragStart);
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('dragend', onDragEnd);
            window.removeEventListener('drop', onDragDrop);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        visible, stateManager, renderMode,
    ]);

    return <>{children}</>;
};
