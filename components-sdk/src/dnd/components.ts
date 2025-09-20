import {
    Component,
    ComponentType,
    ComponentTypeUnofficial,
    parseComponent,
    StringSelectComponent,
} from '../utils/componentTypes';
import { SECTIONABLE } from '../Capsule';
import { uuidv4 } from '../utils/randomGen';
import { DistanceProps, DistanceReturn, KeyToDeleteType } from './types';
import { distanceCenter, distanceHorizontal, distanceVertical } from './distance';
import { stateKeyType, StateManager } from '../polyfills/StateManager';

/*
    * This file gathers all configuration how components can be dragged and dropped
    * I want a single file to manage all drag and drop logic, so it's easier to maintain when new components are added
 */

export enum DroppableID {
    TOP_LEVEL,
    BUTTON,
    SECTION_EDIT_ACCESSORY,
    SECTION_ADD_ACCESSORY,
    SECTION_CONTENT,
    GALLERY_ITEM,
    STRING_SELECT,
    CONTAINER,
}



export function getDroppableOrientation(droppableId: DroppableID): (props: DistanceProps) => DistanceReturn {
    switch (droppableId) {
        case DroppableID.TOP_LEVEL:
        case DroppableID.STRING_SELECT:
        case DroppableID.CONTAINER:
        case DroppableID.SECTION_CONTENT:
            return distanceHorizontal
        case DroppableID.BUTTON:
        case DroppableID.SECTION_ADD_ACCESSORY:
        case DroppableID.GALLERY_ITEM:
            return distanceVertical
        case DroppableID.SECTION_EDIT_ACCESSORY:
            return distanceCenter
        default:
            unknownComponent(droppableId);
    }
}

function unknownComponent(p: never): never;
function unknownComponent(p: DroppableID) {
    throw new Error('Unknown component: ' + p.toString());
}

export function isValidLocation(compType: ComponentType | ComponentTypeUnofficial | null) {
    // compType === null is only on dragOver event (when we don't know the type of the component)

    return (droppableId: DroppableID) => {
        switch (droppableId) {
            case DroppableID.TOP_LEVEL:
                return true;
            case DroppableID.BUTTON:
                return compType == ComponentType.BUTTON;
            case DroppableID.SECTION_ADD_ACCESSORY:
            case DroppableID.SECTION_EDIT_ACCESSORY:
                return [ComponentType.BUTTON, ComponentType.THUMBNAIL, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM].includes(compType as any)
            case DroppableID.STRING_SELECT:
                return compType == ComponentTypeUnofficial.STRING_SELECT_OPTION
            case DroppableID.CONTAINER:
                return compType === null || compType !== ComponentType.CONTAINER;
            case DroppableID.SECTION_CONTENT:
                return SECTIONABLE.includes(compType as any)
            case DroppableID.GALLERY_ITEM:
                return [ComponentType.THUMBNAIL, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM].includes(compType as any)
            default:
                unknownComponent(droppableId);
        }
    };
}

function randomizeIds(data: any): any {
    if (Array.isArray(data)) {
        return data.map(randomizeIds);
    } else if (data && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                ['custom_id', 'value'].includes(key) ? uuidv4() : randomizeIds(value),
            ])
        );
    }
    return data;
}

export function guessComponentType(arg: object): ComponentType | ComponentTypeUnofficial | null {
    if ('type' in arg && typeof arg.type === 'number' && arg.type in ComponentType) {
        return arg.type;
    }
    if ('label' in arg && typeof arg.label === 'string' && 'value' in arg && typeof arg.value === 'string') {
        return ComponentTypeUnofficial.STRING_SELECT_OPTION;
    }
    if (
        'media' in arg &&
        typeof arg.media === 'object' &&
        arg.media !== null &&
        !Array.isArray(arg.media) &&
        'url' in arg.media &&
        typeof arg.media.url === 'string'
    ) {
        return ComponentTypeUnofficial.MEDIA_GALLERY_ITEM;
    }
    return null;
}

export function getValidObj(comp: object, droppableId: DroppableID, randomizeId: boolean) {
    let compValid;

    const compType = guessComponentType(comp);
    if (!compType) return null;

    // Don't assume that component matches the droppableId as it's not always the case
    if (!isValidLocation(compType)(droppableId)) return null;

    if (randomizeId) comp = randomizeIds(comp);

    if (
        compType === ComponentType.BUTTON &&
        ![DroppableID.BUTTON, DroppableID.SECTION_ADD_ACCESSORY, DroppableID.SECTION_EDIT_ACCESSORY].includes(
            droppableId
        )
    ) {
        compValid = parseComponent[ComponentType.ACTION_ROW]({
            components: [comp],
            type: ComponentType.ACTION_ROW,
        } as Component);
    } else if (compType === ComponentType.STRING_SELECT) { // Not possible via UI
        compValid = parseComponent[ComponentType.ACTION_ROW]({
            components: [comp],
            type: ComponentType.ACTION_ROW,
        } as Component);
    } else if (compType === ComponentTypeUnofficial.STRING_SELECT_OPTION && droppableId !== DroppableID.STRING_SELECT) {
        compValid = parseComponent[ComponentType.ACTION_ROW]({
            components: [{
                type: ComponentType.STRING_SELECT,
                custom_id: uuidv4(),
                options: [
                    comp
                ]
            } as StringSelectComponent],
            type: ComponentType.ACTION_ROW,
        } as Component);
    } else if ([ComponentType.THUMBNAIL, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM].includes(compType)) {
        if ([DroppableID.SECTION_ADD_ACCESSORY, DroppableID.SECTION_EDIT_ACCESSORY].includes(droppableId)) {
            compValid = parseComponent[ComponentType.THUMBNAIL](comp);
        } else if (droppableId === DroppableID.GALLERY_ITEM) {
            compValid = parseComponent[ComponentTypeUnofficial.MEDIA_GALLERY_ITEM](comp);
        } else {
            compValid = parseComponent[ComponentType.MEDIA_GALLERY]({
                items: [comp],
                type: ComponentType.MEDIA_GALLERY,
            } as Component);
        }
    } else {
        // @ts-ignore We trust that guessComponentType() will ensure that comp is a valid component
        compValid = parseComponent[compType](comp);
    }
    if (!compValid) return null;

    return compValid;
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

export function customDropActions({
    stateManager,
    keyToDelete,
    droppableId,
    key,
    value,
} : {
    stateManager: StateManager;
    keyToDelete: KeyToDeleteType | null;
    droppableId: DroppableID;
    key: stateKeyType,
    value: object
}) {
    if (droppableId === DroppableID.SECTION_ADD_ACCESSORY) {
        stateManager.wrapKey({
            key,
            toArray: true,
            innerKey: 'components',
            value: {
                type: 9,
                accessory: value,
            },
        });
        if (typeof keyToDelete?.stateKey !== 'undefined')
            stateManager.deleteKey({
                key: keyToDelete?.stateKey,
                removeKeyParent: keyToDelete?.removeKeyParent,
                decoupleFrom: keyToDelete?.decoupleFrom,
            });
        return true;
    } else if (droppableId === DroppableID.SECTION_EDIT_ACCESSORY) {
        stateManager.setKey({
            key,
            value: value,
        });
        if (typeof keyToDelete?.stateKey !== 'undefined') {
            if (arraysEqual(key.slice(0, -1), keyToDelete.stateKey)) {
                return true; // Prevent deleting yourself
            }

            stateManager.deleteKey({
                key: keyToDelete.stateKey,
                removeKeyParent: keyToDelete.removeKeyParent,
                decoupleFrom: keyToDelete.decoupleFrom,
            });
        }
        return true;
    }

    return false;
}