import {
    Component,
    ComponentType,
    ComponentTypeUnofficial,
    parseBaseComponent,
    parseComponent,
    parseStringSelectComponentOption,
    StringSelectComponent,
    TextDisplayComponent,
} from './componentTypes';

export type LabelPossible = TextInputComponent | ModalStringSelectComponent | FileUploadComponent;

export const parseModalComponent = {
    [ComponentType.ACTION_ROW]: () => null,
    [ComponentType.BUTTON]: () => null,
    [ComponentType.STRING_SELECT]: parseStringSelectComponent,
    [ComponentType.SECTION]: () => null,
    [ComponentType.TEXT_DISPLAY]: parseTextDisplayComponent,
    [ComponentType.THUMBNAIL]: () => null,
    [ComponentType.MEDIA_GALLERY]: () => null,
    [ComponentType.FILE]: () => null,
    [ComponentType.SEPARATOR]: () => null,
    [ComponentType.CONTAINER]: () => null,
    [ComponentType.TEXT_INPUT]: parseTextInputComponent,
    [ComponentType.LABEL]: parseLabelComponent,
    [ComponentType.FILE_UPLOAD]: parseFileUploadComponent,
    [ComponentTypeUnofficial.MEDIA_GALLERY_ITEM]: () => null,
    [ComponentTypeUnofficial.STRING_SELECT_OPTION]: parseStringSelectComponentOption,
} as const;

// All components that have 'required' field supported in modals
export const MODAL_SUPPORTS_REQUIRED: ComponentType[] = [
    ComponentType.TEXT_INPUT,
    ComponentType.STRING_SELECT,
    ComponentType.FILE_UPLOAD,
]

export enum TextInputStyle {
    SHORT = 1,
    PARAGRAPH = 2,
}

export interface TextInputComponent extends Component {
    type: ComponentType.TEXT_INPUT;
    custom_id: string;
    style: TextInputStyle;
    // label?: string;  deprecated
    min_length?: number | null;
    max_length?: number | null;
    required?: boolean;
    value?: string | null;
    placeholder?: string | null;
}

function parseTextInputComponent(component: Component): TextInputComponent | null {
    if (!('custom_id' in component) || typeof component.custom_id !== 'string') return null;
    if (
        !('style' in component) ||
        !(component.style === TextInputStyle.SHORT || component.style === TextInputStyle.PARAGRAPH)
    )
        return null;

    const min_length = (
        'min_length' in component && typeof component.min_length === 'number' &&
        component.min_length >= 0 && component.min_length <= 4000
    ) ? component.min_length : null;

    const max_length = (
        'max_length' in component && typeof component.max_length === 'number' &&
        component.max_length >= 1 && component.max_length <= 4000
    ) ? component.max_length : null;

    const required = ('required' in component) ? !!component.required : true;
    const value = ('value' in component && typeof component.value === 'string') ? component.value : null;
    const placeholder = ('placeholder' in component && typeof component.placeholder === 'string') ? component.placeholder : null;

    return {
        type: ComponentType.TEXT_INPUT,
        custom_id: component.custom_id,
        style: component.style,
        min_length,
        max_length,
        required,
        value,
        placeholder
    }
}


export interface LabelComponent<T extends LabelPossible> extends Component {
    type: ComponentType.LABEL;
    label: string;
    description?: string | null;
    component: T;
}

function parseLabelComponent(component: Component): LabelComponent<LabelPossible> | null {
    if (!('label' in component) || typeof component.label !== 'string') return null;
    if (!('component' in component)) return null;
    const child = parseBaseComponent(component.component);
    if (child === null) return null;

    let childParsed: LabelPossible | null = null;

    switch (child.type) {
        case ComponentType.TEXT_INPUT:
        case ComponentType.STRING_SELECT:
        case ComponentType.FILE_UPLOAD:
            const func = parseModalComponent[child.type];
            if (typeof func !== 'undefined') childParsed = func(child);
            break;
    }

    if (childParsed === null) return null;

    const description =
        'description' in component && typeof component.description === 'string' ? component.description : null;

    return {
        type: ComponentType.LABEL,
        label: component.label,
        description,
        component: childParsed,
    };
}

export interface FileUploadComponent extends Component {
    type: ComponentType.FILE_UPLOAD;
    custom_id: string;
    min_values?: number;
    max_values?: number;
    required?: boolean;
}

function parseFileUploadComponent(component: Component): FileUploadComponent | null {
    if (!('custom_id' in component) || typeof component.custom_id !== 'string') return null;

    const min_values = 'min_values' in component && typeof component.min_values === 'number' ? component.min_values : 1;
    const max_values = 'max_values' in component && typeof component.max_values === 'number' ? component.max_values : 1;
    const required = 'required' in component ? !!component.required : true;

    return {
        type: ComponentType.FILE_UPLOAD,
        custom_id: component.custom_id,
        min_values,
        max_values,
        required,
    };
}

export type ModalStringSelectComponent = Omit<StringSelectComponent, 'disabled'> & {required?: boolean};

function parseStringSelectComponent(component: Component): ModalStringSelectComponent | null {
    const comp = parseComponent[ComponentType.STRING_SELECT](component);
    if (comp === null) return null;

    const { disabled, ...base } = comp;
    const required = ('required' in component) ? !!component.required : true;
    return {
        ...base,
        required,
    }
}

function parseTextDisplayComponent(component: Component): TextDisplayComponent | null {
    return parseComponent[ComponentType.TEXT_DISPLAY](component);
}