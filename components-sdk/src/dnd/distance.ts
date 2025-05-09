import { ClosestState, ClosestType, DistanceProps, DistanceReturn } from './types';

export const MOVE_THRESHOLD: 10 = 10;


export function distanceHorizontal({
    closest,
    closestDistance,
    ref,
    visible,
    activeDistance,
    mouseY,
}: DistanceProps): DistanceReturn {
    const rect = ref.element!.getBoundingClientRect();
    const distanceTop = Math.abs(rect.top - mouseY);
    const distanceBottom = Math.abs(rect.bottom - mouseY);

    if (distanceTop < closestDistance) {
        closest = {
            ref,
            type: ClosestType.UP,
        } as ClosestState;
        closestDistance = distanceTop;
    }

    if (distanceBottom < closestDistance) {
        closest = {
            ref,
            type: ClosestType.DOWN,
        } as ClosestState;
        closestDistance = distanceBottom;
    }

    if (visible && ref.element! === visible.ref.element) {
        activeDistance = visible.type === ClosestType.UP ? distanceTop : distanceBottom;
    }

    return {
        closest,
        closestDistance,
        activeDistance,
    };
}

export function distanceVertical({
    closest,
    closestDistance,
    ref,
    visible,
    activeDistance,
    mouseY,
    mouseX,
}: DistanceProps): DistanceReturn {
    const rect = ref.element!.getBoundingClientRect();

    const topOrBottom = Math.min(Math.abs(rect.top - mouseY), Math.abs(rect.bottom - mouseY));

    const distanceLeft = Math.sqrt(topOrBottom ** 2 + (rect.left - mouseX) ** 2) - 2 * MOVE_THRESHOLD;
    const distanceRight = Math.sqrt(topOrBottom ** 2 + (rect.right - mouseX) ** 2) - 2 * MOVE_THRESHOLD;

    if (distanceLeft < closestDistance) {
        closest = {
            ref,
            type: ClosestType.LEFT,
        } as ClosestState;
        closestDistance = distanceLeft;
    }

    if (distanceRight < closestDistance) {
        closest = {
            ref,
            type: ClosestType.RIGHT,
        } as ClosestState;
        closestDistance = distanceRight;
    }

    if (visible && ref.element! === visible.ref.element) {
        activeDistance = visible.type === ClosestType.LEFT ? distanceLeft : distanceRight;
    }

    return {
        closest,
        closestDistance,
        activeDistance,
    };
}

export function distanceCenter({
    closest,
    closestDistance,
    ref,
    visible,
    activeDistance,
    mouseY,
    mouseX,
}: DistanceProps): DistanceReturn {
    const rect = ref.element!.getBoundingClientRect();

    const dx = Math.max(rect.left - mouseX, 0, mouseX - rect.right);
    const dy = Math.max(rect.top - mouseY, 0, mouseY - rect.bottom);
    const delta = Math.sqrt(dx * dx + dy * dy);

    if (delta < closestDistance) {
        closest = { ref, type: ClosestType.CENTER } as ClosestState;
        closestDistance = delta;
    }

    if (visible && ref.element! === visible.ref.element) {
        activeDistance = delta;
    }

    return {closest, closestDistance, activeDistance}
}