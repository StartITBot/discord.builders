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
    Component,
    ContainerComponent,
    FileComponent,
    MediaGalleryComponent,
    MediaGalleryItem,
    PassProps,
    SeparatorComponent,
    StringSelectComponent,
    TextDisplayComponent,
    ThumbnailComponent,
} from './utils/componentTypes';

export const SPACING_SMALL = 1;
export const SPACING_LARGE = 2;

const _Button = {
    type: 2,
    style: 2,
    label: '',
    emoji: null,
    disabled: false,
} as ButtonComponent;

const _Image = {
    media: {
        url: '',
    },
    description: null,
    spoiler: false,
} as MediaGalleryItem;

const _StringSelect = () =>
    ({
        type: 3,
        custom_id: uuidv4(),
        options: [
            {
                label: generateRandomAnimal(),
                value: uuidv4(),
                description: null,
                emoji: null,
                default: false,
            },
        ],
        placeholder: '',
        min_values: 1,
        max_values: 1,
        disabled: false,
    } as StringSelectComponent);

export const default_settings = {
    Button: () => ({
        type: 1,
        components: [
            {
                ..._Button,
                custom_id: uuidv4(),
                label: generateRandomAnimal(),
            },
        ],
    }),
    LinkButton: () => ({
        type: 1,
        components: [
            {
                ..._Button,
                style: 5,
                url: 'https://google.com',
                label: generateRandomAnimal(),
            },
        ],
    }),
    StringSelect: () => ({
        type: 1,
        components: [_StringSelect()],
    }),
    TextDisplay: () => ({
        type: 10,
        content: randomSentence(),
    }),
    Thumbnail: {
        type: 11,
        ..._Image,
    },
    MediaGallery: {
        type: 12,
        items: [_Image],
    },
    File: {
        type: 13,
        file: {
            url: '',
        },
        spoiler: false,
    },
    Separator: {
        type: 14,
        divider: true,
        spacing: SPACING_SMALL,
    },
    Container: {
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [],
    },
} as {
    Button: () => ActionRowComponent<ButtonComponent>;
    LinkButton: () => ActionRowComponent<ButtonComponent>;
    StringSelect: () => ActionRowComponent<StringSelectComponent>;
    TextDisplay: () => TextDisplayComponent;
    Thumbnail: ThumbnailComponent;
    MediaGallery: MediaGalleryComponent;
    Separator: SeparatorComponent;
    Container: ContainerComponent;
    File: FileComponent;
};

export type ComponentsProps = {
    state: Component;
    stateKey: stateKeyType;
    passProps: PassProps;
    stateManager: StateManager;
    removeKeyParent?: stateKeyType;
};

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
    [K: number]: (props: ComponentsProps) => JSX.Element;
};

export const SECTIONABLE = [
    10, // TextDisplay,
];

export function Capsule(
    props: {
        stateManager: StateManager;
        stateKey: stateKeyType;
        state: Component[];
        className?: string | null;
    } & PassProps
) {
    const cls = props.className ? ' ' + props.className : '';

    return (
        <div className={Styles.preview + cls}>
            <CapsuleInner
                state={props.state}
                stateKey={props.stateKey}
                stateManager={props.stateManager}
                buttonContext={'main'}
                passProps={props}
            />
        </div>
    );
}
