import {
    Component,
    ComponentType,
    ComponentTypeUnofficial,
    MediaGalleryComponent,
    MediaGalleryItem,
    parseComponent,
    StringSelectComponent,
    StringSelectComponentOption,
} from '../utils/componentTypes';
import { SECTIONABLE } from '../Capsule';
import { uuidv4 } from '../utils/randomGen';
import { DistanceProps, DistanceReturn, KeyToDeleteType } from './types';
import { distanceCenter, distanceHorizontal, distanceVertical } from './distance';
import { stateKeyType, StateManager } from '../polyfills/StateManager';
import { parseModalComponent } from '../utils/componentTypesModal';

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
    MODAL_TOP_LEVEL,
}



export function getDroppableOrientation(droppableId: DroppableID): (props: DistanceProps) => DistanceReturn {
    switch (droppableId) {
        case DroppableID.TOP_LEVEL:
        case DroppableID.MODAL_TOP_LEVEL:
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
                return compType === null || [
                    ComponentType.ACTION_ROW, ComponentType.BUTTON, ComponentType.STRING_SELECT, ComponentType.SECTION,
                    ComponentType.TEXT_DISPLAY, ComponentType.THUMBNAIL, ComponentType.MEDIA_GALLERY, ComponentType.FILE,
                    ComponentType.SEPARATOR, ComponentType.CONTAINER, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM,
                    ComponentTypeUnofficial.STRING_SELECT_OPTION, ComponentType.LABEL,
                ].includes(compType as any);
            case DroppableID.MODAL_TOP_LEVEL:
                return compType === null || [
                    ComponentType.ACTION_ROW, ComponentType.STRING_SELECT, ComponentType.TEXT_INPUT, ComponentType.LABEL,
                    ComponentType.FILE_UPLOAD, ComponentTypeUnofficial.STRING_SELECT_OPTION, ComponentType.TEXT_DISPLAY,
                    ComponentType.SECTION
                ].includes(compType as any);
            case DroppableID.BUTTON:
                return compType == ComponentType.BUTTON;
            case DroppableID.SECTION_ADD_ACCESSORY:
            case DroppableID.SECTION_EDIT_ACCESSORY:
                return [ComponentType.BUTTON, ComponentType.THUMBNAIL, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM].includes(compType as any)
            case DroppableID.STRING_SELECT:
                return compType == ComponentTypeUnofficial.STRING_SELECT_OPTION
            case DroppableID.CONTAINER:
                return compType === null || [
                    ComponentType.ACTION_ROW, ComponentType.BUTTON, ComponentType.STRING_SELECT, ComponentType.SECTION,
                    ComponentType.TEXT_DISPLAY, ComponentType.THUMBNAIL, ComponentType.MEDIA_GALLERY, ComponentType.FILE,
                    ComponentType.SEPARATOR, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM, ComponentTypeUnofficial.STRING_SELECT_OPTION,
                    ComponentType.LABEL,
                ].includes(compType as any);
            case DroppableID.SECTION_CONTENT:
                return SECTIONABLE.includes(compType as any)
            case DroppableID.GALLERY_ITEM:
                return [ComponentType.THUMBNAIL, ComponentTypeUnofficial.MEDIA_GALLERY_ITEM].includes(compType as any)
            default:
                unknownComponent(droppableId);
        }
    };
}

export function randomizeIds(data: object): object;
export function randomizeIds(data: unknown): unknown {
    if (Array.isArray(data)) {
        return data.map(randomizeIds);
    } else if (data && typeof data === 'object') {
        // "value" in TextInput should not be randomized
        const val = "type" in data && data.type == ComponentType.TEXT_INPUT ? ['custom_id'] : ['custom_id', 'value'];

        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                val.includes(key) ? uuidv4() : randomizeIds(value),
            ])
        );
    }
    return data;
}

export function isOfficialComponent(arg: object): arg is Component {
    return 'type' in arg && typeof arg.type === 'number' && arg.type in ComponentType;
}

export function isStringSelectComponentOption(arg: object): arg is StringSelectComponentOption {
    return 'label' in arg && typeof arg.label === 'string' && 'value' in arg && typeof arg.value === 'string';
}

export function isMediaGalleryItem(arg: object): arg is MediaGalleryItem {
    return (
        'media' in arg &&
        typeof arg.media === 'object' &&
        arg.media !== null &&
        !Array.isArray(arg.media) &&
        'url' in arg.media &&
        typeof arg.media.url === 'string'
    )
}

export function guessComponentType(arg: object): ComponentType | ComponentTypeUnofficial | null {
    if (isOfficialComponent(arg)) return arg.type;
    if (isStringSelectComponentOption(arg)) return ComponentTypeUnofficial.STRING_SELECT_OPTION;
    if (isMediaGalleryItem(arg)) return ComponentTypeUnofficial.MEDIA_GALLERY_ITEM;
    return null;
}


export function getValidObj(comp_: object, droppableId: DroppableID, randomizeId: boolean) {
    const comp = randomizeId ? randomizeIds(comp_) : comp_;
    const isOfficial = isOfficialComponent(comp);
    const isMediaItem = isMediaGalleryItem(comp);
    const isStringOption = isStringSelectComponentOption(comp);

    if (isMediaItem || (isOfficial && comp.type === ComponentType.THUMBNAIL)) {
        if ([DroppableID.SECTION_ADD_ACCESSORY, DroppableID.SECTION_EDIT_ACCESSORY].includes(droppableId))
            return parseComponent[ComponentType.THUMBNAIL](comp) ?? null;

        else if (droppableId === DroppableID.GALLERY_ITEM)
            return parseComponent[ComponentTypeUnofficial.MEDIA_GALLERY_ITEM](comp) ?? null;

        return parseComponent[ComponentType.MEDIA_GALLERY]({
            items: [comp],
            type: ComponentType.MEDIA_GALLERY,
        } as MediaGalleryComponent) ?? null;
    }

    if (isStringOption) {
        if (droppableId === DroppableID.STRING_SELECT)
            return parseComponent[ComponentTypeUnofficial.STRING_SELECT_OPTION](comp) ?? null;

        return parseComponent[ComponentType.ACTION_ROW]({
            components: [{
                type: ComponentType.STRING_SELECT,
                custom_id: uuidv4(),
                options: [
                    comp
                ]
            } as StringSelectComponent],
            type: ComponentType.ACTION_ROW,
        } as Component) ?? null;
    }

    if (!isOfficial) return null;

    // Only official components beyond this point

    if (comp.type === ComponentType.BUTTON) {
        if (
            [DroppableID.BUTTON, DroppableID.SECTION_ADD_ACCESSORY, DroppableID.SECTION_EDIT_ACCESSORY]
            .includes(droppableId)
        )
            return parseComponent[ComponentType.BUTTON](comp) ?? null;

        return parseComponent[ComponentType.ACTION_ROW]({
            components: [comp],
            type: ComponentType.ACTION_ROW,
        } as Component) ?? null;
    }

    if (comp.type === ComponentType.STRING_SELECT) {
        return parseComponent[ComponentType.ACTION_ROW]({
            components: [comp],
            type: ComponentType.ACTION_ROW,
        } as Component) ?? null;
    }

    // Select compatibility with modal components
    if (comp.type === ComponentType.LABEL) {
        const label = parseModalComponent[ComponentType.LABEL](comp);
        if (label !== null && label.component.type === ComponentType.STRING_SELECT) {
            return parseComponent[ComponentType.ACTION_ROW]({
                components: [label.component],
                type: ComponentType.ACTION_ROW,
            } as Component) ?? null;
        }
        return null;
    }

    return parseComponent[comp.type](comp) ?? null;
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