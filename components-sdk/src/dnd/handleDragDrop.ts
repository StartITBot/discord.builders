import { ClosestType, DragContextType } from './types';
import { StateManager } from '../polyfills/StateManager';
import { customDropActions, getValidObj } from './components';
import { default_settings } from '../Capsule';
import { TextDisplayComponent } from '../utils/componentTypes';
import { BoundariesProps, testBoundaries } from './boundaries';

function assertValidJSON(arg: unknown): asserts arg is object {
    if (typeof arg !== 'object' || arg === null) throw new Error('Invalid component type');
    if (Array.isArray(arg)) throw new Error('Invalid component type');
}

function getJSON(dataTransfer: DataTransfer | null): object | null {
    if (!dataTransfer) return null;

    const data = dataTransfer.getData('application/json') || dataTransfer.getData('text/plain');
    // if (!data) return null;

    let jsonData;
    try {
        jsonData = JSON.parse(data);
        assertValidJSON(jsonData);
    } catch (e) {
        jsonData = {
            ...default_settings.TextDisplay(),
            content: data,
        } as TextDisplayComponent;
    }

    return jsonData;
}

export const handleDragDrop = (
    e: DragEvent,
    {
        visible,
        setVisible,
        stateManager,
        keyToDelete: keyToDeleteRef,
        boundaries,
    }: {
        visible: DragContextType['visible'];
        setVisible: DragContextType['setVisible'];
        stateManager: StateManager;
        keyToDelete: DragContextType['keyToDelete'];
    } & BoundariesProps
) => {
    if (!testBoundaries(e.target, boundaries)) return;

    /*

    Warning! When data is dropped from external sources, dragOverEvent hadn't accessed the data to validate it.
    You have to validate them once again here.

     */

    if (!visible) return;
    if (!e.dataTransfer) return;

    const transferSessionId = e.dataTransfer.getData('application/x-dsc-builders-id');
    let keyToDelete = e.dataTransfer.dropEffect === 'copy' ? null : keyToDeleteRef.current;
    if (keyToDelete?.sessionId !== transferSessionId || !transferSessionId) keyToDelete = null;

    const comp = getJSON(e.dataTransfer);
    if (!comp) return;

    const value = getValidObj(comp, visible.ref.droppableId, e.dataTransfer.dropEffect === 'copy');
    if (value === null) return;

    e.preventDefault();
    setVisible(null);

    if (
        customDropActions({
            stateManager,
            keyToDelete,
            droppableId: visible.ref.droppableId,
            key: visible.ref.stateKey,
            value,
        })
    )
        return;

    let key = visible.ref.stateKey;
    let index = 0;

    if (typeof key[key.length - 1] === 'number') {
        index = key[key.length - 1] as number;
        key = key.slice(0, -1);
        if (visible.type === ClosestType.DOWN) index += 1;
        else if (visible.type === ClosestType.RIGHT) index += 1;
    }

    stateManager.addKey({
        key,
        index,
        value,
        deleteKey: keyToDelete?.stateKey,
        removeKeyParent: keyToDelete?.removeKeyParent,
        decoupleFrom: keyToDelete?.decoupleFrom,
    });
};
