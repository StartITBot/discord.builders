import Styles from './Capsule.module.css';
import { TextDisplay } from './components/TextDisplay';
import { Thumbnail } from './components/Thumbnail';
import { MediaGallery } from './components/MediaGallery';
import { Separator } from './components/Separator';
import { Section } from './components/Section';
import { Container } from './components/Container';
import { Button } from './components/Button';
import { ActionRow } from './components/ActionRow';
import { StringSelect } from './components/StringSelect';
import { File } from './components/File';
import { CapsuleInner } from './CapsuleInner';
import { generateRandomAnimal, randomSentence, uuidv4 } from './utils/randomGen';
import { stateKeyType, StateManager } from './polyfills/StateManager';
import {
    ActionRowComponent,
    ButtonComponent,
    ButtonStyle,
    Component,
    ComponentType,
    ContainerComponent,
    FileComponent,
    MediaGalleryComponent,
    MediaGalleryItem,
    PassProps,
    RenderMode,
    SeparatorComponent,
    SeparatorSpacingSize,
    StringSelectComponent,
    TextDisplayComponent,
    ThumbnailComponent,
} from './utils/componentTypes';
import {
    FileUploadComponent,
    LabelComponent,
    ModalStringSelectComponent,
    TextInputComponent,
    TextInputStyle,
} from './utils/componentTypesModal';

import { DragContextProvider } from './dnd/DragContext';
import { DroppableID } from './dnd/components';
import { KeyToDeleteType } from './dnd/types';
import { BoundariesProps } from './dnd/boundaries';
import { RegenerateContextProvider } from './utils/useRegenerate';
import { Label } from './components/Label';
import { useTranslation } from 'react-i18next';
import { TextInput } from './components/TextInput';
import { FileUpload } from './components/FileUpload';

const _Button = {
    type: ComponentType.BUTTON,
    style: ButtonStyle.GREY,
    label: '',
    emoji: null,
    disabled: false,
} as ButtonComponent;

const _Image = {
    media: {
        url: ''
    },
    description: null,
    spoiler: false,
} as MediaGalleryItem

const _StringSelect = () => ({
    type: ComponentType.STRING_SELECT,
    custom_id: uuidv4(),
    options: [
        {
            label: generateRandomAnimal(),
            value: uuidv4(),
            description: null,
            emoji: null,
            default: false,
        }
    ],
    placeholder: "",
    min_values: 1,
    max_values: 1,
    disabled: false,
} as StringSelectComponent)

const _TextInput = (style: TextInputStyle) => ({
    type: ComponentType.TEXT_INPUT,
    custom_id: uuidv4(),
    style,
    min_length: null,
    max_length: null,
    required: true,
    value: null,
    placeholder: null,
});

// We want this app to create components with all properties (except 'id') defined
type Req<T> = Required<Omit<T, 'id'>>;

export const default_settings = {
    Button: () => ({
        type: ComponentType.ACTION_ROW,
        components: [{
            ..._Button,
            custom_id: uuidv4(),
            label: generateRandomAnimal(),
        }]
    }),
    LinkButton: () => ({
        type: ComponentType.ACTION_ROW,
        components: [{
            ..._Button,
            style: ButtonStyle.URL,
            url: 'https://google.com',
            label: generateRandomAnimal(),
        }]
    }),
    StringSelect: () => ({
        type: ComponentType.ACTION_ROW,
        components: [_StringSelect()],
    }),
    TextDisplay: () => ({
        type: ComponentType.TEXT_DISPLAY,
        content: randomSentence(),
    }),
    Thumbnail: {
        type: ComponentType.THUMBNAIL,
        ..._Image,
    },
    MediaGallery: {
        type: ComponentType.MEDIA_GALLERY,
        items: [_Image],
    },
    File: {
        type: ComponentType.FILE,
        file: {
            url: ''
        },
        spoiler: false,
    },
    Separator: {
        type: ComponentType.SEPARATOR,
        divider: true,
        spacing: SeparatorSpacingSize.SMALL
    },
    Container: {
        type: ComponentType.CONTAINER,
        accent_color: null,
        spoiler: false,
        components: [],
    },
    ModalShortInput: () => ({
        type: ComponentType.LABEL,
        label: generateRandomAnimal(),
        description: null,
        component: _TextInput(TextInputStyle.SHORT),
    }),
    ModalParagraphInput: () => ({
        type: ComponentType.LABEL,
        label: generateRandomAnimal(),
        description: null,
        component: _TextInput(TextInputStyle.PARAGRAPH),
    }),
    ModalStringSelect: () => {
        const {disabled, ...other} = _StringSelect();
        return {
            type: ComponentType.LABEL,
            label: generateRandomAnimal(),
            description: null,
            component: {...other, required: true},
        };
    },
    ModalFileUpload: () => ({
        type: ComponentType.LABEL,
        label: generateRandomAnimal(),
        description: null,
        component: {
            type: ComponentType.FILE_UPLOAD,
            custom_id: uuidv4(),
            min_values: 1,
            max_values: 1,
            required: true,
        },
    }),
} as {
    Button: () => Req<ActionRowComponent<Req<ButtonComponent>>>;
    LinkButton: () => Req<ActionRowComponent<Req<ButtonComponent>>>;
    StringSelect: () => Req<ActionRowComponent<Req<StringSelectComponent>>>;
    TextDisplay: () => Req<TextDisplayComponent>;
    Thumbnail: Req<ThumbnailComponent>;
    MediaGallery: Req<MediaGalleryComponent>;
    Separator: Req<SeparatorComponent>;
    Container: Req<ContainerComponent>;
    File: Req<FileComponent>;
    ModalShortInput: () => Req<LabelComponent<Req<TextInputComponent>>>;
    ModalParagraphInput: () => Req<LabelComponent<Req<TextInputComponent>>>;
    ModalStringSelect: () => Req<LabelComponent<Req<ModalStringSelectComponent>>>;
    ModalFileUpload: () => Req<LabelComponent<Req<FileUploadComponent>>>;
}

export type ComponentsProps = {
    state: Component,
    stateKey: stateKeyType,
    passProps: PassProps,
    stateManager: StateManager,
    removeKeyParent?: stateKeyType,
    dragKeyToDeleteOverwrite?: Omit<KeyToDeleteType, 'sessionId'>, // Available only for Section accessory
    droppableId?: DroppableID, // Available only for Section accessory
    fromLabel?: boolean  // Available only for Label component
    errors?: Record<string, any> | null,
    actionCallback?: (custom_id: string | null) => void,
}

export const COMPONENTS: {
    [K in ComponentType]: (props: Omit<ComponentsProps, 'state'> & { state: any }) => JSX.Element | null;
} = {
    [ComponentType.ACTION_ROW]: ActionRow,
    [ComponentType.BUTTON]: Button,
    [ComponentType.STRING_SELECT]: StringSelect,
    [ComponentType.TEXT_INPUT]: TextInput,
    [ComponentType.SECTION]: Section,
    [ComponentType.TEXT_DISPLAY]: TextDisplay,
    [ComponentType.THUMBNAIL]: Thumbnail,
    [ComponentType.MEDIA_GALLERY]: MediaGallery,
    [ComponentType.SEPARATOR]: Separator,
    [ComponentType.CONTAINER]: Container,
    [ComponentType.FILE]: File,
    [ComponentType.LABEL]: Label,
    [ComponentType.FILE_UPLOAD]: FileUpload,
}

export const SECTIONABLE = [
    ComponentType.TEXT_DISPLAY
]

export function Capsule(props : {
    stateManager: StateManager,
    stateKey: stateKeyType,
    state: Component[],
    className?: string | null,
    passProps: PassProps,
    errors: Record<string, any> | null,
    modalTitle?: string
} & BoundariesProps ) {
    const isModal = props.passProps.renderMode === RenderMode.MODAL;

    const cls = props.className ? ' ' + props.className : '';
    const modCls = isModal ? ' ' + Styles.modal : '';

    return <div className={Styles.preview + modCls + cls}>
        {!!(isModal && props.modalTitle) && <div className={Styles.header}>
            {props.modalTitle}
        </div>}
        <RegenerateContextProvider stateManager={props.stateManager}>{stateMng => <DragContextProvider stateManager={stateMng} boundaries={props.boundaries} renderMode={props.passProps.renderMode ?? RenderMode.MESSAGE}>
            <CapsuleInner
                state={props.state}
                stateKey={props.stateKey}
                stateManager={stateMng}
                buttonContext={isModal ? 'modal' : 'main'}
                passProps={props.passProps}
                droppableId={isModal ? DroppableID.MODAL_TOP_LEVEL : DroppableID.TOP_LEVEL}
                errors={props.errors}
                showSectionButton={!isModal}
            />
        </DragContextProvider>}</RegenerateContextProvider>
    </div>
}
