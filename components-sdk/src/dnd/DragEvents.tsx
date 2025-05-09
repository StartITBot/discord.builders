import { FC, ReactNode, useEffect } from 'react';
import { StateManager } from '../polyfills/StateManager';
import { DragContextType } from './types';

import { useDragContext } from './DragContext';
import { handleDragDrop } from './handleDragDrop';
import { handleDragOver } from './handleDragOver';

const handleDragStart = (e: DragEvent) => {
    // Some items (like images) have a default dragstart event that we need to prevent
    e.preventDefault();
};

const handleDragEnd = (
    e: DragEvent,
    {
        setVisible,
    }: {
        setVisible: DragContextType['setVisible'];
    }
) => {
    e.preventDefault();
    setVisible(null);
};

export const DragEvents: FC<{
    children: ReactNode;
    stateManager: StateManager;
}> = ({ children, stateManager }) => {
    const { refs, visible, setVisible, keyToDelete } = useDragContext();

    useEffect(() => {
        const onDragOver = (e: DragEvent) => handleDragOver(e, {
            refs,
            visible,
            setVisible,
        });
        const onDragStart = (e: DragEvent) => handleDragStart(e);
        const onDragEnd = (e: DragEvent) => handleDragEnd(e, { setVisible });
        const onDragDrop = (e: DragEvent) => handleDragDrop(e, {
            visible,
            setVisible,
            stateManager,
            keyToDelete,
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
        visible, stateManager,
    ]);

    return <>{children}</>;
};
