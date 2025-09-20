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
import { addKeyType, appendKeyType, deleteKeyType, stateKeyType, StateManager } from './polyfills/StateManager';
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
    SeparatorComponent,
    SeparatorSpacingSize,
    StringSelectComponent,
    TextDisplayComponent,
    ThumbnailComponent,
} from './utils/componentTypes';

import { DragContextProvider } from './dnd/DragContext';
import { DroppableID } from './dnd/components';
import { KeyToDeleteType } from './dnd/types';
import { BoundariesProps } from './dnd/boundaries';
import { RegenerateContextProvider } from './utils/useRegenerate';
import { useMemo } from 'react';

const _Button = {
    type: 2,
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
    type: 3,
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

export const default_settings = {
    Button: () => ({
        type: 1,
        components: [{
            ..._Button,
            custom_id: uuidv4(),
            label: generateRandomAnimal()
        }]
    }),
    LinkButton: () => ({
        type: 1,
        components: [{
            ..._Button,
            style: ButtonStyle.URL,
            url: 'https://google.com',
            label: generateRandomAnimal()
        }]
    }),
    StringSelect: () => ({
        type: 1,
        components: [_StringSelect()]
    }),
    TextDisplay: () => ({
        type: 10,
        content: randomSentence(),
    }),
    Thumbnail: {
        type: 11,
        ..._Image
    },
    MediaGallery: {
        type: 12,
        items: [
            _Image
        ]
    },
    File: {
        type: 13,
        file: {
            url: ''
        },
        spoiler: false,
    },
    Separator: {
        type: 14,
        divider: true,
        spacing: SeparatorSpacingSize.SMALL
    },
    Container: {
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [],
    },
} as {
    Button: () => ActionRowComponent<ButtonComponent>,
    LinkButton: () => ActionRowComponent<ButtonComponent>,
    StringSelect: () => ActionRowComponent<StringSelectComponent>,
    TextDisplay: () => TextDisplayComponent,
    Thumbnail: ThumbnailComponent,
    MediaGallery: MediaGalleryComponent,
    Separator: SeparatorComponent,
    Container:ContainerComponent,
    File: FileComponent
}

export type ComponentsProps = {
    state: Component,
    stateKey: stateKeyType,
    passProps: PassProps,
    stateManager: StateManager,
    removeKeyParent?: stateKeyType,
    dragKeyToDeleteOverwrite?: Omit<KeyToDeleteType, 'sessionId'>, // Available only for Section accessory
    droppableId?: DroppableID, // Available only for Section accessory
    errors?: Record<string, any> | null,
    actionCallback?: (custom_id: string | null) => void,
}

export const COMPONENTS = {
    1: ActionRow,
    2: Button,
    3: StringSelect,
    9: Section,
    10: TextDisplay,
    11: Thumbnail,
    12: MediaGallery,
    14: Separator,
    17: Container,
    13: File,
} as unknown as {
    [K: number]: (props: ComponentsProps) => JSX.Element
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
} & BoundariesProps ) {
    const cls = props.className ? ' ' + props.className : '';

    return <div className={Styles.preview + cls}>
        <RegenerateContextProvider stateManager={props.stateManager}>{stateMng => <DragContextProvider stateManager={stateMng} boundaries={props.boundaries}>
            <CapsuleInner
                state={props.state}
                stateKey={props.stateKey}
                stateManager={stateMng}
                buttonContext={'main'}
                passProps={props.passProps}
                droppableId={DroppableID.TOP_LEVEL}
                errors={props.errors}
            />
        </DragContextProvider>}</RegenerateContextProvider>
    </div>
}
