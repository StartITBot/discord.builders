import Styles from "./StringSelect.module.css"
import CapsuleStyles from "../Capsule.module.css"
import Icons from "../icons/Icons.svg"
import EditIcon from "../icons/Edit.svg"
import Emoji from "../icons/Emoji.svg"
import EmojiActive from "../icons/EmojiActive.svg"
import Lock from "../icons/Lock.svg"
import LockActive from "../icons/LockActive.svg"
import DefaultActive from "../icons/DefaultActive.svg"
import Default from "../icons/Default.svg"
import Minimum from "../icons/Minimum.svg"
import Maximum from "../icons/Maximum.svg"
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {ComponentsProps, default_settings} from "../Capsule";
import {MenuEmoji, MenuLabel} from "./Button";
import {StringSelectComponent, StringSelectComponentOption} from "../utils/componentTypes";
import {stateKeyType} from "../polyfills/StateManager";
import Slider from "rc-slider";
import TrashIcon from "../icons/Trash.svg";
import { useStateOpen } from '../utils/useStateOpen';
import DescriptionPen from '../icons/DescriptionPen.svg';
import DescriptionText from '../icons/DescriptionText.svg';
import DescriptionTextActive from '../icons/DescriptionTextActive.svg';

export function StringSelect({state, stateKey, stateManager, passProps} : ComponentsProps & {state: StringSelectComponent}) {
    // useEffect(() => {
    //     if (state.min_values > state.max_values) {
    //         stateManager.setKey({key: [...stateKey, "max_values"], value: state.min_values})
    //     }
    // }, [state.min_values]);
    //
    // useEffect(() => {
    //     if (state.max_values < state.min_values) {
    //         stateManager.setKey({key: [...stateKey, "min_values"], value: state.max_values})
    //     }
    // }, [state.max_values]);

    return <div>
        <div className={Styles.select}>
            <GlobalSettings state={state} stateKey={stateKey} stateManager={stateManager} />

            {state.disabled && <div className={Styles.disabled}>
                ⚠️ This component will be greyed out and disabled for all users.
            </div>}

            {state.options.map((option, index) => <StringSelectOption
                key={option.value}
                state={option}
                stateKey={[...stateKey, "options", index]}
                stateManager={stateManager}
                passProps={passProps}
            />)}

            <div>
                <div className={Styles.select_option + ' ' + Styles.select_new} onClick={() => {
                    stateManager.appendKey({key: [...stateKey, "options"], value: default_settings.StringSelect().components[0].options[0]});
                }}>
                    <div className={Styles.icon}>
                        <img src={Icons} alt=""/>
                    </div>
                    <div className={Styles.text}>New option</div>
                </div>
            </div>
        </div>
    </div>
}

function GlobalSettings({state, stateKey, stateManager} : {
    state: StringSelectComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
}) {
    const {open, setOpen, ignoreRef, closeLockRef} = useStateOpen(0);
    const btn_select = useRef<HTMLDivElement>(null);

    return <div className={Styles.select_option + ' ' + Styles.select_default + (open ? " " + Styles.open :  "")} onClick={(ev) => {
        if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
        setOpen(1)
    }} ref={ignoreRef}>
        <div className={Styles.icon}><img src={EditIcon} alt="(Edit)"/></div>
        <div className={Styles.with_badge}>
            <div className={Styles.text}>{state.placeholder || "Global settings"}</div>
            <div className={Styles.badge}>{state.min_values === state.max_values ? state.min_values : `${state.min_values} – ${state.max_values}` }</div>
        </div>
        { !!open && <div className={CapsuleStyles.large_button_ctx+ ' ' + CapsuleStyles.noright} ref={btn_select}>
            {open === 1 && <GlobalSettingsFirst state={state} stateKey={stateKey} stateManager={stateManager} setOpen={setOpen}/>}
            {open === 2 && <MenuLabel closeLockRef={closeLockRef} state={state.placeholder || ""} stateKey={[...stateKey, 'placeholder']} stateManager={stateManager} setOpen={setOpen}/>}
            {open === 3 && <MenuRange min={1} max={state.options.length} state={state.min_values} stateKey={[...stateKey, 'min_values']} stateManager={stateManager}/>}
            {open === 4 && <MenuRange min={1} max={state.options.length} state={state.max_values} stateKey={[...stateKey, 'max_values']} stateManager={stateManager}/>}
        </div>}

    </div>
}

export function MenuRange({min, max, state, stateKey, stateManager} : {
    min: number,
    max: number,
    state: number,
    stateKey: stateKeyType,
    stateManager: ComponentsProps['stateManager']
}) {
    return <div className={Styles.menu_range}>
        <Slider min={min} max={max} step={1} marks={Array.from({length: max+1}, (_, i) => i)}
                value={state}
                onChange={(no: any) => stateManager.setKey({key: stateKey, value: no})}
        />
    </div>
}

function GlobalSettingsFirst({state, stateKey, stateManager, setOpen} : {
    state: StringSelectComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
}) {

    return <>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            stateManager.setKey({key: [...stateKey, "disabled"], value: !state.disabled})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={state.disabled ? LockActive : Lock} alt=""/></div>
            <div
                className={CapsuleStyles.large_button_ctx_item_text}>{state.disabled ? "Mark everything as enabled" : "Mark everything as disabled"}</div>
        </div>

        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={DescriptionText} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>{!state.placeholder ? "Add placeholder" : "Change placeholder"}</div>
        </div>

        {!!state.placeholder && <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "placeholder"], value: null})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={DescriptionTextActive} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Clear placeholder</div>
        </div>}

        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Minimum} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Set number of minimum options to be selected</div>
        </div>

        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(4);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Maximum} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Set number of maximum options to be selected</div>
        </div>

    </>
}

function StringSelectOption({state, stateKey, stateManager, passProps} : {
    state: StringSelectComponentOption,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    passProps: ComponentsProps['passProps']
}) {
    const {open, setOpen, ignoreRef, closeLockRef} = useStateOpen(0);
    const btn_select = useRef<HTMLDivElement>(null);
    const Comp = passProps.EmojiShow;

    return (
        <div className={Styles.select_option + (open ? " " + Styles.open : "") + (state.default ? " " + Styles.blue : "") + (state.disabled ? " " + Styles.disabled : "")} onClick={(ev) => {
            if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
            setOpen(1)
        }} ref={ignoreRef}>
            {state.emoji !== null && <div className={CapsuleStyles.emoji}>
                <Comp passProps={passProps} emoji={state.emoji} />
            </div>}
            <div className={Styles.text}>
                {state.label} {!!state.description && <span className={Styles.desc}>&bull; {state.description}</span>}
            </div>
            { !!open && <div className={CapsuleStyles.large_button_ctx+ ' ' + CapsuleStyles.noright} ref={btn_select}>
                {open === 1 && <MenuFirst state={state} stateKey={stateKey} stateManager={stateManager} setOpen={setOpen}/>}
                {open === 2 && <MenuEmoji stateKey={[...stateKey, 'emoji']} stateManager={stateManager} passProps={passProps}/>}
                {open === 3 && <MenuLabel closeLockRef={closeLockRef} state={state.label} stateKey={[...stateKey, 'label']} stateManager={stateManager} setOpen={setOpen}/>}
                {open === 4 && <MenuLabel closeLockRef={closeLockRef} state={state.description || ""} nullable={true} stateKey={[...stateKey, "description"]} stateManager={stateManager} setOpen={setOpen}/>}
            </div>}
        </div>
    )
}

function MenuFirst({state, stateKey, stateManager, setOpen} : {
    state: StringSelectComponentOption,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
}) {

    return <>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            if (state.disabled) {
                stateManager.setKey({key: [...stateKey, "disabled"], value: false})
            }else{
                stateManager.setKey({key: [...stateKey, "disabled"], value: true})
                stateManager.setKey({key: [...stateKey, "default"], value: false})
            }
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={state.disabled ? LockActive : Lock} alt=""/></div>
            <div
                className={CapsuleStyles.large_button_ctx_item_text}>{state.disabled ? "Mark as enabled" : "Mark as disabled"}</div>
        </div>
        {!state.disabled && <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            stateManager.setKey({key: [...stateKey, "default"], value: !state.default})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={state.default ? DefaultActive : Default} alt=""/></div>
            <div
                className={CapsuleStyles.large_button_ctx_item_text}>{state.default ? "Unselect this by default" : "Select this by default"}</div>
        </div>}
        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Emoji} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>{state.emoji === null ? "Set emoji" : "Change emoji"}</div>
        </div>
        {state.emoji !== null && <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "emoji"], value: null})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={EmojiActive} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Clear emoji</div>
        </div>}
        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={DescriptionPen} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Change label</div>
        </div>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            setOpen(4);
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={DescriptionText} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>{state.description === null ? "Add description" : "Change description"}</div>
        </div>
        {state.description !== null && <div className={CapsuleStyles.large_button_ctx_item} onClick={(ev) => {
            stateManager.setKey({key: [...stateKey, "description"], value: null})
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={DescriptionTextActive} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Clear description</div>
        </div>}
        <div className={CapsuleStyles.large_button_ctx_item} onClick={() => {
            stateManager.deleteKey({key: stateKey});
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={TrashIcon} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Delete</div>
        </div>
    </>
}
