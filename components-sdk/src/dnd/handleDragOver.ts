import { ClosestState, DistanceProps, DragContextType } from './types';
import { MOVE_THRESHOLD } from './distance';
import { getDroppableOrientation, isValidLocation } from './components';
import { ComponentType, ComponentTypeUnofficial } from '../utils/componentTypes';


const mimetypeRegex = /^application\/x-dsc-builders\[(.*)\]$/;

function getContentType(dataTransfer: DataTransfer | null): ComponentType | ComponentTypeUnofficial | null {
    if (!dataTransfer) return null;

    const mimetype = dataTransfer.types.find(str => mimetypeRegex.test(str));
    const matches = mimetype ? mimetype.match(mimetypeRegex) : null;
    const number = matches ? Number(matches[1]) : NaN;
    if (!(number in ComponentType) && !(number in ComponentTypeUnofficial)) return null;

    return number;
}

export const handleDragOver = (
    e: DragEvent,

    {
        refs,
        visible,
        setVisible,
    }: {
        refs: DragContextType['refs'];
        visible: DragContextType['visible'];
        setVisible: DragContextType['setVisible'];
    }
) => {
    if (!e.dataTransfer) return null;

    const comp = getContentType(e.dataTransfer);
    e.preventDefault();

    const mouseY: number = e.clientY;
    const mouseX: number = e.clientX;
    let closest: ClosestState | undefined;
    let closestDistance: number = +Infinity;
    let activeDistance: number = +Infinity;

    const locationChecker = isValidLocation(comp);
    refs.current.forEach((ref) => {
        if (ref.element === null || !document.body.contains(ref.element)) return; // skip if not in DOM
        if (!locationChecker(ref.droppableId)) return;

        const distanceProps = {
            closest,
            closestDistance,
            ref,
            visible,
            activeDistance,
            mouseY,
            mouseX,
        } as DistanceProps;
        const distanceFunc = getDroppableOrientation(ref.droppableId);
        ({ closest, closestDistance, activeDistance } = distanceFunc(distanceProps));
    });

    const hasChanged = closest?.ref?.element !== visible?.ref?.element || closest?.type !== visible?.type;
    const totalDistance = Math.abs(activeDistance - closestDistance);
    if (hasChanged && totalDistance > MOVE_THRESHOLD) setVisible(closest ?? null);
};