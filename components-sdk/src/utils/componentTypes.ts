import { BetterInput } from '../polyfills/BetterInput';
import { EmojiPicker } from '../polyfills/EmojiPicker';
import { EmojiShow } from '../polyfills/EmojiShow';
import { getFileType, setFileType } from '../polyfills/files';

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
    CONTAINER = 17,
}

export type PassProps = {
    getFile: getFileType;
    setFile: setFileType;
    BetterInput: BetterInput;
    EmojiPicker: EmojiPicker;
    EmojiShow: EmojiShow;
};

export enum ButtonStyle {
    BLUE = 1,
    GREY = 2,
    GREEN = 3,
    RED = 4,
    URL = 5,
}

export interface EmojiObject {
    id: string | null;
    name: string;
}

export type ActionRowPossible = ButtonComponent | StringSelectComponent;

export interface ActionRowComponent<T extends Component> extends Component {
    type: ComponentType.ACTION_ROW;
    components: T[];
}

export interface ButtonComponent extends Component {
    type: ComponentType.BUTTON;
    style: ButtonStyle;
    label: string;
    emoji: EmojiObject | null;
    disabled: boolean;
    custom_id?: string;
    url?: string;
}

export interface StringSelectComponentOption {
    label: string;
    value: string;
    description: string | null;
    emoji: EmojiObject | null;
    default: boolean;
    disabled: boolean;
}

export interface StringSelectComponent extends Component {
    type: ComponentType.STRING_SELECT;
    custom_id: string;
    options: StringSelectComponentOption[];
    placeholder?: string;
    min_values: number;
    max_values: number;
    disabled?: boolean;
}

export interface UnfurledMediaItem {
    // Supports arbitrary urls _and_ attachment://<filename> references
    url: string;
}

export interface Component {
    type: ComponentType;
    id?: number; //int32, auto generated via increment if not provided
}

export interface SectionComponent extends Component {
    type: ComponentType.SECTION;
    // DO NOT hardcode assumptions this will always be TextDisplayComponents.
    // We could potentially add other components in the future
    components: TextDisplayComponent[];
    // DO NOT hardcode assumptions that this will only be Thumbnail.
    // Eventually this will support Button and others
    accessory: ThumbnailComponent | ButtonComponent;
}

export interface TextDisplayComponent extends Component {
    type: ComponentType.TEXT_DISPLAY;
    content: string;
}

export interface ThumbnailComponent extends Component {
    type: ComponentType.THUMBNAIL;
    media: UnfurledMediaItem;
    description: string | null;
    spoiler?: boolean;
}

export interface MediaGalleryItem {
    media: UnfurledMediaItem;
    description: string | null;
    spoiler?: boolean;
}

export interface MediaGalleryComponent extends Component {
    type: ComponentType.MEDIA_GALLERY;
    items: MediaGalleryItem[];
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

export interface FileComponent extends Component {
    type: ComponentType.FILE;
    // The UnfurledMediaItem ONLY supports attachment://<filename> references
    file: UnfurledMediaItem;
    spoiler?: boolean;
}

export interface ContainerComponent extends Component {
    type: ComponentType.CONTAINER;
    accent_color: number | null;
    spoiler?: boolean;
    components: Array<
        | ActionRowComponent<ActionRowPossible>
        | TextDisplayComponent
        | SectionComponent
        | MediaGalleryComponent
        | SeparatorComponent
        // | FileComponent
    >;
}
