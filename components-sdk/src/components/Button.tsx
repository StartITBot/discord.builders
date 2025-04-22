import Styles from "./Button.module.css";
import CapsuleStyles from "../Capsule.module.css";
import {
    Dispatch, forwardRef,
    Fragment,
    MutableRefObject, RefObject,
    SetStateAction,
    useCallback,
    useEffect, useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import ColorBlue from "../icons/ColorBlue.svg";
import ColorGrey from "../icons/ColorGrey.svg";
import ColorGreen from "../icons/ColorGreen.svg";
import ColorRed from "../icons/ColorRed.svg";
import Icons from "../icons/Icons.svg";
import {ButtonComponent, ButtonStyle, EmojiObject} from "../utils/componentTypes";
import {ComponentsProps} from "../Capsule";
import {stateKeyType} from "../polyfills/StateManager";
import TrashIcon from "../icons/Trash.svg";
import { useStateOpen } from '../utils/useStateOpen';
import TimesSolid from "../icons/times-solid.svg"

/*

    type: 2,
    style: 2,
    label: '',
    emoji: null,
    disabled: false,


 */

function getColor(style: ButtonStyle, disabled: boolean) {
    if (disabled) switch (style) {
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
    {state, stateKey, stateManager, removeKeyParent = undefined, passProps} :
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
        <div
            className={CapsuleStyles.large_button  + ' ' + getColor(state.style, state.disabled)}
            onClick={(ev) => {
                if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                setOpen(1)
            }}
            ref={ignoreRef}
            title={state.url}
        >
            {state.emoji !== null && <div className={CapsuleStyles.emoji}>
                <Comp passProps={passProps} emoji={state.emoji}/>
            </div>}
            {/**/}
            {state.style === 5 ? <>
                <div className={CapsuleStyles.text + ' ' + Styles.link_btn}>
                    <div className={Styles.text} ref={textRef}>{state.label}</div>
                    <div className={Styles.link} style={{width: textWidth}}>{(state.url || "").replace("https://", "").replace("http://", "")}</div>
                </div>

                <div style={{paddingLeft: '10px'}}><i className="fas fa-arrow-up-right-from-square" style={{fontSize: 12}}></i></div>
            </> : <div className={CapsuleStyles.text}>{state.label}</div>}

            {!!open && <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                {open === 1 && <MenuFirst state={state} stateManager={stateManager} stateKey={stateKey} removeKeyParent={removeKeyParent} setOpen={setOpen}/>}
                {open === 2 && <MenuEmoji stateKey={[...stateKey, 'emoji']} stateManager={stateManager} passProps={passProps}/>}
                {open === 3 && <MenuLabel closeLockRef={closeLockRef} state={state.label} stateKey={[...stateKey, 'label']} stateManager={stateManager} setOpen={setOpen}/>}
                {open === 4 && <MenuLabel closeLockRef={closeLockRef} state={state.url || ""} stateKey={[...stateKey, 'url']} stateManager={stateManager} setOpen={setOpen}/>}
            </div>}
        </div>
    )
}

function MenuFirst({state, stateKey, stateManager, setOpen, removeKeyParent} : {
    state: ButtonComponent,
    setOpen: Dispatch<SetStateAction<number>>,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    removeKeyParent?: stateKeyType,
}) {
    return <>
        {state.style !== 5 && <Fragment>
            <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
                stateManager.setKey({key: [...stateKey, "style"], value: 1})
            }}>
                <div className={CapsuleStyles.large_button_ctx_item_img}><img src={ColorBlue} alt=""/></div>
                <div className={CapsuleStyles.large_button_ctx_item_text}>Set theme to blue</div>
            </div>
            <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
                stateManager.setKey({key: [...stateKey, "style"], value: 2})
            }}>
                <div className={CapsuleStyles.large_button_ctx_item_img}><img src={ColorGrey} alt=""/></div>
                <div className={CapsuleStyles.large_button_ctx_item_text}>Set theme to grey</div>
            </div>
            <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
                stateManager.setKey({key: [...stateKey, "style"], value: 3})
            }}>
                <div className={CapsuleStyles.large_button_ctx_item_img}><img src={ColorGreen} alt=""/></div>
                <div className={CapsuleStyles.large_button_ctx_item_text}>Set theme to green</div>
            </div>
            <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
                stateManager.setKey({key: [...stateKey, "style"], value: 4})
            }}>
                <div className={CapsuleStyles.large_button_ctx_item_img}><img src={ColorRed} alt=""/></div>
                <div className={CapsuleStyles.large_button_ctx_item_text}>Set theme to red</div>
            </div>
        </Fragment>}
        <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            stateManager.setKey({key: [...stateKey, "disabled"], value: !state.disabled})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Icons} alt=""/></div>
            <div
                className={CapsuleStyles.large_button_ctx_item_text}>{state.disabled ? "Mark as enabled" : "Mark as disabled"}</div>
        </div>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Icons} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Set emoji</div>
        </div>
        {state.emoji !== null && <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "emoji"], value: null})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Icons} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Clear emoji</div>
        </div>}
        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Icons} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Change label</div>
        </div>
        {state.style === 5 && <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(4);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Icons} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Change url</div>
        </div>}
        {!!removeKeyParent && <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            stateManager.deleteKey({key: stateKey, removeKeyParent})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={TrashIcon} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Delete</div>
        </div>}
    </>
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
            className={Styles.input}
            placeholder="abcdefg"
            onChange={(ev) => stateManager.setKey({
                key: stateKey,
                value: nullable ? (ev.target.value || null) : ev.target.value
            })}
        />
        <img width={30} height={30} src={TimesSolid} alt={'x'} onClick={() => setOpen(0)} />
    </div>
}
