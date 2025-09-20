import { RefObject } from 'react';

/*

By default, we listen to the DnD events on the whole webpage, but sometimes
we want drag&drop to work only on a specific region.

 */

export interface BoundariesProps {
    boundaries?: RefObject<HTMLElement> | null;
}

export function testBoundaries(target: EventTarget | null, boundaries: BoundariesProps['boundaries']) {
    // Return true if no boundaries are set, meaning we can drag anywhere
    if (boundaries == null || boundaries.current == null) return true;

    return target instanceof Node ? boundaries.current.contains(target) : false;
}