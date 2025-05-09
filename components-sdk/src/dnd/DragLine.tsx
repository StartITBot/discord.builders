import { DragEvent as ReactDragEvent, HTMLProps, ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';
import Styles from './DragLine.module.css';
import { stateKeyType } from '../polyfills/StateManager';
import { uuidv4 } from '../utils/randomGen';
import { ClosestType, DragContextType, DroppableState } from './types';
import { useDragContext } from './DragContext';
import { DroppableID, guessComponentType } from './components';
import Trash from '../icons/TrashWhite.svg';
import { ComponentsProps } from '../Capsule';
import DragHandler from '../icons/Draghandler.svg';

export function useDragLine({
    stateKey,
    droppableId,
}: {
    stateKey: stateKeyType;
    droppableId: DroppableID | null;
}): { ref: RefObject<HTMLDivElement> } & Pick<DragContextType, 'visible' | 'setVisible' | 'keyToDelete'> {
    const { register, unregister, visible, setVisible, keyToDelete } = useDragContext();
    const el = useRef<HTMLDivElement>();

    useEffect(() => {
        if (droppableId === null) return;

        const droppableState: DroppableState = {
            element: el.current || null,
            stateKey,
            droppableId,
        };

        register(droppableState);
        return () => unregister(droppableState);
    }, [register, unregister, droppableId, stateKey]);

    return { ref: el as RefObject<HTMLDivElement>, visible, setVisible, keyToDelete };
}

interface DragLinesProps {
    children: ReactNode,
    data: object,
    stateKey: stateKeyType,
    defaultType?: ClosestType,
    draggable?: boolean,
    dragDisabled?: boolean,
    droppableId: DroppableID | null   // Set to null to disable dropping
    removeKeyParent?: stateKeyType,
    dragKeyToDeleteOverwrite?: ComponentsProps['dragKeyToDeleteOverwrite'],
    className?: string,
}


export function DragLines(
    { children, data, stateKey, defaultType = ClosestType.UP, draggable = false, dragDisabled = false, droppableId, removeKeyParent, dragKeyToDeleteOverwrite, className = undefined } : DragLinesProps
) {
    const { ref: el, visible, setVisible, keyToDelete } = useDragLine({stateKey, droppableId});

    const onDragStart = useCallback((e: ReactDragEvent) => {
        const json = JSON.stringify(data, null, 4);
        // e.dataTransfer.setData("text/uri-list", "https://www.mozilla.org");
        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData("application/json", json);
        e.dataTransfer.setData("text/plain", json);
        const compType = guessComponentType(data);
        if (compType) e.dataTransfer.setData(`application/x-dsc-builders[${compType}]`, compType.toString());

        const sessionId = uuidv4();
        keyToDelete.current = typeof dragKeyToDeleteOverwrite !== "undefined" ? { sessionId, ...dragKeyToDeleteOverwrite } : { sessionId, stateKey, removeKeyParent };
        e.dataTransfer.setData("application/x-dsc-builders-id", sessionId);
        e.dataTransfer.setDragImage(el.current!, 0, 0);
        e.stopPropagation();
    }, [data, stateKey, removeKeyParent, dragKeyToDeleteOverwrite]);

    const onMouseDown = useCallback(() => {
        if (droppableId === null || typeof defaultType === "undefined") return;
        setVisible({
            ref: {
                element: el.current || null,
                stateKey,
                droppableId: droppableId,
            },
            type: defaultType,
        });
    }, [setVisible, el, droppableId]);

    const amIVisible = !!el.current && visible?.ref.element === el.current && droppableId !== null;

    const amIVisibleTop = amIVisible && visible.type === ClosestType.UP;
    const amIVisibleBottom = amIVisible && visible.type === ClosestType.DOWN;
    const amIVisibleLeft = amIVisible && visible.type === ClosestType.LEFT;
    const amIVisibleRight = amIVisible && visible.type === ClosestType.RIGHT;
    const amIVisibleCenter = amIVisible && visible.type === ClosestType.CENTER;

    const props: HTMLProps<HTMLDivElement> = !dragDisabled ? {
        onMouseDown,
        onDragStart,
        draggable: true,
    } : {}

    return (
        <div className={Styles.draglines + ' ' + className} data-image-role="drag">
            {!draggable && <div className={Styles.draghandler} {...props}>
                <img src={DragHandler} alt="" />
            </div>}
            <div ref={el} {...(draggable ? props : {})} data-image-role="drag">{children}</div>
            {amIVisibleTop && <div key={'top-dragline'} className={Styles.dragline} style={{top: -6}} />}
            {amIVisibleBottom && <div key={'bottom-dragline'} className={Styles.dragline} style={{bottom: -6}} />}
            {amIVisibleLeft && <div key={'left-dragline'} className={Styles.dragline_hor} style={{left: -6}} />}
            {amIVisibleRight && <div key={'right-dragline'} className={Styles.dragline_hor} style={{right: -6}} />}
            {amIVisibleCenter && <div key={'center-dragline'} className={Styles.dragline_cen}>
                <img src={Trash} alt="" />
            </div>}
        </div>
    );
}