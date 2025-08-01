import Styles from './Button.module.css';
import {text_display_input} from './TextDisplay.module.css';
import CapsuleStyles from '../Capsule.module.css';
import {
    Dispatch,
    Fragment, MouseEventHandler,
    RefObject,
    SetStateAction,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import ColorBlue from '../icons/ColorBlue.svg';
import ColorGrey from '../icons/ColorGrey.svg';
import ColorGreen from '../icons/ColorGreen.svg';
import ColorRed from '../icons/ColorRed.svg';
import { ButtonComponent, ButtonStyle, EmojiObject } from '../utils/componentTypes';
import { ComponentsProps } from '../Capsule';
import { stateKeyType } from '../polyfills/StateManager';
import TrashIcon from '../icons/Trash.svg';
import { useStateOpen } from '../utils/useStateOpen';
import TimesSolid from '../icons/times-solid.svg';
import Emoji from '../icons/Emoji.svg';
import EmojiActive from '../icons/EmojiActive.svg';
import LockActive from '../icons/LockActive.svg';
import Action from '../icons/Action.svg';
import Lock from '../icons/Lock.svg';
import Url from '../icons/Url.svg';
import DescriptionPen from '../icons/DescriptionPen.svg';
import { DragLines } from '../dnd/DragLine';
import { ClosestType } from '../dnd/types';
import { DroppableID } from '../dnd/components';

function getColor(style: ButtonStyle, disabled: boolean) {
    if (disabled)
        switch (style) {
            case 1:
                return Styles.blue_disabled;
            case 2:
            case 5:
                return Styles.grey_disabled;
            case 3:
                return Styles.green_disabled;
            case 4:
                return Styles.red_disabled;
        }

    switch (style) {
        case 1:
            return Styles.blue;
        case 2:
        case 5:
            return Styles.grey;
        case 3:
            return Styles.green;
        case 4:
            return Styles.red;
    }
}


export function Button(
    {state, stateKey, stateManager, removeKeyParent = undefined, passProps, droppableId=undefined, dragKeyToDeleteOverwrite = undefined, actionCallback} :
    ComponentsProps & {state: ButtonComponent}
) {
    const {open, setOpen, ignoreRef, closeLockRef} = useStateOpen(0);
    const btn_select = useRef<HTMLDivElement>(null);
    const Comp = passProps.EmojiShow

    // LINK BUTTON START

    const textRef = useRef<HTMLDivElement>(null);
    const [textWidth, setTextWidth] = useState(0);
    useLayoutEffect(() => {
        if (textRef.current) setTextWidth(textRef.current.offsetWidth);
    }, [state.label]);

    // LINK BUTTON END

    return (
        <DragLines
            droppableId={typeof stateKey[stateKey.length - 1] === "number" ? DroppableID.BUTTON : (droppableId ?? null)}
            dragDisabled={!!open}
            draggable={true}
            defaultType={ClosestType.LEFT}
            data={state}
            stateKey={stateKey}
            removeKeyParent={removeKeyParent}
            dragKeyToDeleteOverwrite={dragKeyToDeleteOverwrite}
        ><div
            className={CapsuleStyles.large_button  + ' ' + getColor(state.style, !!state.disabled)}
            onClick={(ev) => {
                if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                setOpen(1)
            }}
            ref={ignoreRef}
            title={state.url}
        >
            {state.emoji != null && <div className={CapsuleStyles.emoji}>
                <Comp passProps={passProps} emoji={state.emoji}/>
            </div>}
            {/**/}
            {state.style === ButtonStyle.URL ? <>
                <div className={CapsuleStyles.text + ' ' + Styles.link_btn}>
                    <div className={Styles.text} ref={textRef}>{state.label}</div>
                    <div className={Styles.link} style={{width: textWidth}}>{(state.url || "").replace("https://", "").replace("http://", "")}</div>
                </div>

                <div style={{paddingLeft: '10px'}}><i className="fas fa-arrow-up-right-from-square" style={{fontSize: 12}}></i></div>
            </> : <div className={CapsuleStyles.text}>{state.label}</div>}

            {!!open && <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                {open === 1 && <MenuFirst actionCallback={actionCallback} state={state} stateManager={stateManager} stateKey={stateKey} removeKeyParent={removeKeyParent} setOpen={setOpen}/>}
                {open === 2 && <MenuEmoji stateKey={[...stateKey, 'emoji']} stateManager={stateManager} passProps={passProps}/>}
                {open === 3 && <MenuLabel closeLockRef={closeLockRef} state={state.label || ""} stateKey={[...stateKey, 'label']} stateManager={stateManager} setOpen={setOpen}/>}
                {open === 4 && <MenuLabel closeLockRef={closeLockRef} state={state.url || ""} stateKey={[...stateKey, 'url']} stateManager={stateManager} setOpen={setOpen}/>}
            </div>}
        </div></DragLines>
    )
}

function MenuFirst({state, stateKey, stateManager, setOpen, removeKeyParent, actionCallback} : {
    state: ButtonComponent,
    setOpen: Dispatch<SetStateAction<number>>,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    removeKeyParent?: stateKeyType,
    actionCallback: ComponentsProps['actionCallback']
}) {
    return <>
        {(state.style !== ButtonStyle.URL && actionCallback != null) && <MenuOption src={Action} text={"Add action"} className={CapsuleStyles.highlight} onClick={(ev) => {
            setOpen(0);
            actionCallback(state.custom_id || null);
            ev.stopPropagation();
        }} />}
        <MenuOption src={Emoji} text={state.emoji == null ? "Set emoji" : "Change emoji"} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }}/>
        {state.emoji != null && <MenuOption src={EmojiActive} text={"Clear emoji"} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "emoji"], value: null})
        }}/>}
        <MenuOption src={DescriptionPen} text={"Change label"} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }} />
        {state.style === ButtonStyle.URL && <MenuOption src={Url} text={"Change url"} onClick={(ev) => {
            setOpen(4);
            ev.stopPropagation();
        }} />}
        <MenuOption src={state.disabled ? LockActive : Lock} text={state.disabled ? "Mark as enabled" : "Mark as disabled"} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "disabled"], value: !state.disabled});
            ev.stopPropagation();
        } }/>

        {state.style !== ButtonStyle.URL && <Fragment>
            <MenuOption src={ColorBlue} text={"Set as Main action"} onClick={(ev) => {
                stateManager.setKey({key: [...stateKey, "style"], value: ButtonStyle.BLUE});
                ev.stopPropagation();
            } }/>
            <MenuOption src={ColorGrey} text={"Set as Secondary action"} onClick={(ev) => {
                stateManager.setKey({key: [...stateKey, "style"], value: ButtonStyle.GREY});
                ev.stopPropagation();
            } }/>
            <MenuOption src={ColorGreen} text={"Set as Confirmation"} onClick={(ev) => {
                stateManager.setKey({key: [...stateKey, "style"], value: ButtonStyle.GREEN});
                ev.stopPropagation();
            } }/>
            <MenuOption src={ColorRed} text={"Set as Destructive"} onClick={(ev) => {
                stateManager.setKey({key: [...stateKey, "style"], value: ButtonStyle.RED});
                ev.stopPropagation();
            }}/>
        </Fragment>}

        {!!removeKeyParent && <MenuOption src={TrashIcon} text={"Delete"} onClick={() => {
            stateManager.deleteKey({key: stateKey, removeKeyParent})
        }} />}
    </>
}

export function MenuOption({ src, text, onClick, className }: {
    src: string;
    text: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
}) {
    return (
        <div className={CapsuleStyles.large_button_ctx_item} onClick={onClick}>
            <div className={CapsuleStyles.large_button_ctx_item_img}>
                <img src={src} alt="" />
            </div>
            <div className={CapsuleStyles.large_button_ctx_item_text + ' ' + className}>{text}</div>
        </div>
    );
}

export function MenuEmoji({stateKey, stateManager, passProps} : {
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    passProps: ComponentsProps['passProps']
}) {
    const Comp = passProps.EmojiPicker;
    return <Comp
        passProps={passProps}
        onSelect={(emoji: EmojiObject) => {
            stateManager.setKey({key: stateKey, value: emoji});
        }}
    />
}

export function MenuLabel({state, stateKey, stateManager, setOpen, nullable = false, closeLockRef} : {
    state: string,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
    nullable?: boolean,
    closeLockRef: RefObject<any>
}) {
    const ref = useRef<HTMLInputElement>(null);
    useImperativeHandle(closeLockRef, () => true);

    useEffect(() => {
        if (ref.current) ref.current.focus();
    }, [ref.current]);
    return <div className={Styles.menu_label}>
        <input
            ref={ref}
            type="text"
            value={state}
            className={text_display_input + ' ' + Styles.input}
            placeholder="abcdefg"
            onChange={(ev) => stateManager.setKey({
                key: stateKey,
                value: nullable ? (ev.target.value || null) : ev.target.value
            })}
        />
        <img width={30} height={30} src={TimesSolid} alt={'x'} onClick={() => setOpen(0)} />
    </div>
}
