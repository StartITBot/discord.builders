import { BetterInput } from '../polyfills/BetterInput';
import { EmojiPicker } from '../polyfills/EmojiPicker';
import { EmojiShow } from '../polyfills/EmojiShow';
import { getFileType, setFileType } from '../polyfills/files';
import { ColorPicker } from '../polyfills/ColorPicker';

// This fragment of code is written in dedication to the JS devs who have to deal with this mess every day.
function isObject(arg: unknown): arg is object {
    return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
}


export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,

    SECTION = 9,
    TEXT_DISPLAY = 10,
    THUMBNAIL = 11,
    MEDIA_GALLERY = 12,
    FILE = 13,
    SEPARATOR = 14,
    CONTAINER = 17
}

export enum ComponentTypeUnofficial {
    MEDIA_GALLERY_ITEM = -1,
    STRING_SELECT_OPTION = -2,
}

export const parseComponent = {
    [ComponentType.ACTION_ROW]: parseActionRowComponent,
    [ComponentType.BUTTON]: parseButtonComponent,
    [ComponentType.STRING_SELECT]: parseStringSelectComponent,
    [ComponentType.SECTION]: parseSectionComponent,
    [ComponentType.TEXT_DISPLAY]: parseTextDisplayComponent,
    [ComponentType.THUMBNAIL]: parseThumbnailComponent,
    [ComponentType.MEDIA_GALLERY]: parseMediaGalleryComponent,
    [ComponentType.FILE]: parseFileComponent,
    [ComponentType.SEPARATOR]: parseSeparatorComponent,
    [ComponentType.CONTAINER]: parseContainerComponent,
    [ComponentTypeUnofficial.MEDIA_GALLERY_ITEM]: parseMediaGalleryItem,
    [ComponentTypeUnofficial.STRING_SELECT_OPTION]: parseStringSelectComponentOption,
}

export type PassProps = {
    getFile: getFileType,
    setFile: setFileType,
    BetterInput: BetterInput,
    EmojiPicker: EmojiPicker,
    ColorPicker: ColorPicker
    EmojiShow: EmojiShow,
}

export enum ButtonStyle {
    BLUE = 1,
    GREY = 2,
    GREEN = 3,
    RED = 4,
    URL = 5
}

export type ActionRowPossible = ButtonComponent | StringSelectComponent


export interface Component {
    type: ComponentType,
    id?: number //int32, auto generated via increment if not provided
}

export function parseBaseComponent(component: unknown): Component | null {
    if (!isObject(component) || !('type' in component)) return null;
    if (typeof component.type !== 'number') return null;
    return component as object & Record<'type', number>;
}

export interface ActionRowComponent<T extends Component> extends Component {
    type: ComponentType.ACTION_ROW;
    components: T[];
}

function parseActionRowComponent(component: Component): ActionRowComponent<ActionRowPossible> | null {
    if (!('components' in component) || !Array.isArray(component.components)) return null

    const components: ActionRowPossible[] = [];
    for (const inner of component.components) {
        const comp = parseBaseComponent(inner);
        if (comp === null) continue;

        if (comp.type === ComponentType.BUTTON) {
            const button = parseButtonComponent(comp);
            if (button === null) continue;

            components.push(button);
        } else if ( components.length == 0 && comp.type === ComponentType.STRING_SELECT) {
            const stringSelect = parseStringSelectComponent(comp);
            if (stringSelect === null) continue;

            components.push(stringSelect);
            break;
        }

        if (components.length >= 5) break;
    }

    if (components.length === 0) return null;

    return {
        type: ComponentType.ACTION_ROW,
        components,
    };
}

export interface EmojiObject {
    id: string | null,  // [-] empty string, [x] null, [x] undefined | default: empty
    name: string
}

function parseEmojiObject(emoji: unknown): EmojiObject | null {
    if (!isObject(emoji)) return null;

    const id = ('id' in emoji && typeof emoji.id === 'string') ? emoji.id : null;
    const name = ('name' in emoji && typeof emoji.name === 'string') ? emoji.name : null;

    if (name === null) return null;

    return {
        id,
        name
    }
}

export interface ButtonComponent extends Component {
    type: ComponentType.BUTTON,
    style: ButtonStyle,
    label: string,  // [+] empty string, [+] null, [+] undefined | default: empty
    emoji: EmojiObject | null,  // [+] null, [+] undefined | default: empty
    disabled: boolean,  // [+] null, [+] undefined | default: empty, false
    custom_id?: string,
    url?: string
}

function parseButtonComponent(component: Component): ButtonComponent | null {
    if (!('style' in component) || typeof component.style !== 'number') return null;
    if (!('label' in component) && !('emoji' in component)) return null; // This is not a button, probably

    const label = (!('label' in component) || typeof component.label !== 'string') ? "" : component.label;
    const emoji = (!('emoji' in component)) ? null : parseEmojiObject(component.emoji);

    // Removed if (label.length === 0 && emoji === null) return null; for UX reasons

    const disabled = ('disabled' in component) ? !!component.disabled : false;

    if (component.style === ButtonStyle.URL) {
        if (!('url' in component) || typeof component.url !== 'string') return null;
        // Missing check for empty string for UX reasons

        return {
            type: ComponentType.BUTTON,
            style: component.style,
            label,
            emoji,
            disabled,
            url: component.url,
        }
    }

    if (!('custom_id' in component) || typeof component.custom_id !== 'string') return null;
    // Missing check for empty string for UX reasons

    return {
        type: ComponentType.BUTTON,
        style: component.style,
        label,
        emoji,
        disabled,
        custom_id: component.custom_id,
    }
}

export interface StringSelectComponentOption {
    label: string,
    value: string,
    description: string | null,
    emoji: EmojiObject | null,
    default: boolean,
    disabled: boolean
}

export function parseStringSelectComponentOption(component: unknown): StringSelectComponentOption | null {
    if (!isObject(component)) return null;

    if (!('label' in component) || typeof component.label !== 'string') return null;
    // Missing check for empty string for UX reasons
    if (!('value' in component) || typeof component.value !== 'string') return null;
    // Missing check for empty string for UX reasons

    const description = ('description' in component && typeof component.description === 'string') ? component.description : null;
    const emoji = ('emoji' in component) ? parseEmojiObject(component.emoji) : null;
    const defaultValue = ('default' in component) ? !!component.default : false;
    const disabled = ('disabled' in component) ? !!component.disabled : false;

    return {
        label: component.label,
        value: component.value,
        description,
        emoji,
        default: defaultValue,
        disabled
    }
}

export interface StringSelectComponent extends Component {
    type: ComponentType.STRING_SELECT,
    custom_id: string,
    options: StringSelectComponentOption[],
    placeholder: string | null,
    min_values: number,
    max_values: number,
    disabled?: boolean
}

function parseStringSelectComponent(component: Component): StringSelectComponent | null {
    if (!('custom_id' in component) || typeof component.custom_id !== 'string') return null;
    // Missing check for empty string for UX reasons

    if (!('options' in component) || !Array.isArray(component.options)) return null;

    const options: StringSelectComponentOption[] = [];
    for (const inner of component.options) {
        const option = parseStringSelectComponentOption(inner);
        if (option === null) continue;

        options.push(option);

        if (options.length >= 25) break;
    }

    // Missing check for an empty array for UX reasons

    const placeholder = ('placeholder' in component && typeof component.placeholder === 'string') ? component.placeholder : null;
    const min_values = ('min_values' in component && typeof component.min_values === 'number') ? component.min_values : 1;
    const max_values = ('max_values' in component && typeof component.max_values === 'number') ? component.max_values : 1;
    const disabled = ('disabled' in component) ? !!component.disabled : false;

    return {
        type: ComponentType.STRING_SELECT,
        custom_id: component.custom_id,
        options,
        placeholder,
        min_values,
        max_values,
        disabled
    }
}

export interface UnfurledMediaItem {
    // Supports arbitrary urls _and_ attachment://<filename> references
    url: string;
}

function parseUnfurledMediaItem(media: unknown): UnfurledMediaItem | null {
    if (!isObject(media)) return null;
    if (!('url' in media) || typeof media.url !== 'string') return null;

    return {
        url: media.url
    }
}

export interface SectionComponent extends Component {
    type: ComponentType.SECTION,
    // DO NOT hardcode assumptions this will always be TextDisplayComponents.
    // We could potentially add other components in the future
    components: TextDisplayComponent[],
    // DO NOT hardcode assumptions that this will only be Thumbnail.
    // Eventually this will support Button and others
    accessory: ThumbnailComponent | ButtonComponent
}
function parseSectionComponent(component: Component): SectionComponent | null {
    if (!('components' in component) || !Array.isArray(component.components)) return null;

    const components: TextDisplayComponent[] = [];
    for (const inner of component.components) {
        const comp = parseBaseComponent(inner);
        if (comp === null) continue;

        if (comp.type !== ComponentType.TEXT_DISPLAY) continue;
        const textComp = parseTextDisplayComponent(comp);
        if (textComp === null) continue;

        components.push(textComp);
    }

    if (components.length === 0) return null;

    if (!('accessory' in component)) return null;
    const comp = parseBaseComponent(component.accessory);
    if (comp === null) return null;
    let accessory = null;

    switch (comp.type) {
        case ComponentType.THUMBNAIL:
            accessory = parseThumbnailComponent(comp);
            break;
        case ComponentType.BUTTON:
            accessory = parseButtonComponent(comp);
            break;
    }

    if (accessory === null) return null;

    return {
        type: ComponentType.SECTION,
        components,
        accessory
    }
}

export interface TextDisplayComponent extends Component {
    type: ComponentType.TEXT_DISPLAY;
    content: string;
}

function parseTextDisplayComponent(component: Component): TextDisplayComponent | null {
    if (!('content' in component) || typeof component.content !== 'string') return null;

    return {
        type: ComponentType.TEXT_DISPLAY,
        content: component.content
    }
}

export interface ThumbnailComponent extends Component {
    type: ComponentType.THUMBNAIL;
    media: UnfurledMediaItem;
    description: string | null;
    spoiler?: boolean
}

function parseThumbnailComponent(component: unknown): ThumbnailComponent | null {
    const comp = parseMediaGalleryItem(component);
    if (comp === null) return null;

    return {
        type: ComponentType.THUMBNAIL,
        media: comp.media,
        description: comp.description,
        spoiler: comp.spoiler
    }
}

export interface MediaGalleryItem {
    media: UnfurledMediaItem;
    description: string | null;
    spoiler?: boolean;
}

export function parseMediaGalleryItem(component: unknown): MediaGalleryItem | null {
    if (!isObject(component)) return null;
    if (!('media' in component)) return null;

    const media = parseUnfurledMediaItem(component.media);
    if (media === null) return null;

    const description = ('description' in component && typeof component.description === 'string') ? component.description : null;
    const spoiler = ('spoiler' in component) ? !!component.spoiler : false;

    return {
        media,
        description,
        spoiler
    }
}

export interface MediaGalleryComponent extends Component {
    type: ComponentType.MEDIA_GALLERY;
    items: MediaGalleryItem[];
}

function parseMediaGalleryComponent(component: Component): MediaGalleryComponent | null {
    if (!('items' in component) || !Array.isArray(component.items)) return null;

    const items: MediaGalleryItem[] = [];
    for (const inner of component.items) {
        const item = parseMediaGalleryItem(inner);
        if (item === null) continue;

        items.push(item);

        if (items.length >= 10) break;
    }

    if (items.length === 0) return null;

    return {
        type: ComponentType.MEDIA_GALLERY,
        items
    }
}

export enum SeparatorSpacingSize {
    SMALL = 1,
    LARGE = 2,
}

export interface SeparatorComponent extends Component {
    type: ComponentType.SEPARATOR;
    divider?: boolean;
    spacing?: SeparatorSpacingSize;
}

function parseSeparatorComponent(component: Component): SeparatorComponent {
    const divider = ('divider' in component) ? !!component.divider : true;
    const spacing = (
        'spacing' in component &&
        (component.spacing === SeparatorSpacingSize.SMALL || component.spacing === SeparatorSpacingSize.LARGE)
    ) ? component.spacing : SeparatorSpacingSize.SMALL;

    return {
        type: ComponentType.SEPARATOR,
        divider,
        spacing
    }
}

export interface FileComponent extends Component {
    type: ComponentType.FILE;
    // The UnfurledMediaItem ONLY supports attachment://<filename> references
    file: UnfurledMediaItem;
    spoiler?: boolean;
}

function parseFileComponent(component: Component): FileComponent | null {
    if (!('file' in component)) return null;
    const file = parseUnfurledMediaItem(component.file);
    if (file === null) return null;

    // Removed if (!file.url.startsWith('attachment://')) return null; for UX reasons

    const spoiler = ('spoiler' in component) ? !!component.spoiler : false;

    return {
        type: ComponentType.FILE,
        file,
        spoiler
    }
}

export interface ContainerComponent extends Component {
    type: ComponentType.CONTAINER;
    accent_color: number | null;
    spoiler?: boolean;
    components: Array<
        ActionRowComponent<ActionRowPossible>
        | TextDisplayComponent
        | SectionComponent
        | MediaGalleryComponent
        | SeparatorComponent
        | FileComponent
    >;
}

function parseContainerComponent(component: Component): ContainerComponent | null {
    if (!('components' in component) || !Array.isArray(component.components)) return null;

    const components: Array<
        ActionRowComponent<ActionRowPossible>
        | TextDisplayComponent
        | SectionComponent
        | MediaGalleryComponent
        | SeparatorComponent
        | FileComponent
    > = [];
    for (const inner of component.components) {
        const comp = parseBaseComponent(inner);
        if (comp === null) continue;

        switch (comp.type) {
            case ComponentType.ACTION_ROW:
            case ComponentType.TEXT_DISPLAY:
            case ComponentType.SECTION:
            case ComponentType.MEDIA_GALLERY:
            case ComponentType.SEPARATOR:
            case ComponentType.FILE:
                const func = parseComponent[comp.type];
                if (typeof func === 'undefined') continue;
                const parsed = func(comp);
                if (parsed === null) continue;
                components.push(parsed);
                break;
        }
    }

    // Removed if (components.length === 0) return null; for UX reasons

    let accent_color: number | null = null;
    if ('accent_color' in component && typeof component.accent_color === 'number' && component.accent_color >= 0x000000 && component.accent_color <= 0xFFFFFF) {
        accent_color = component.accent_color;
    }

    const spoiler = ('spoiler' in component) ? !!component.spoiler : false;

    return {
        type: ComponentType.CONTAINER,
        accent_color,
        spoiler,
        components
    }
}