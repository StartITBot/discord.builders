import Styles from "./Capsule.module.css";
import Icons from "./icons/Icons.svg";
import TextDisplayIcon from "./icons/TextDisplay.svg";
import UploadIcon from "./icons/Upload.svg";
import ContainerIcon from "./icons/Container.svg";
import MediaGalleryIcon from "./icons/MediaGallery.svg";
import SeparatorIcon from "./icons/Separator.svg";
import ButtonIcon from "./icons/Button.svg";
import LinkButtonIcon from "./icons/ButtonLink.svg";
import SelectIcon from "./icons/Select.svg";
import {default_settings} from "./Capsule";
import {useCallback, useEffect, useRef, useState} from "react";
import {Component} from "./utils/componentTypes";
import { useStateOpen } from './utils/useStateOpen';

export type capsuleButtonCtx = 'main' | 'container' | 'inline' | 'button-row' | 'frame';

type props = {
    context: capsuleButtonCtx,
    callback: (data: Component) => any,
    className?: string
};

export function CapsuleButton({context, callback, className} : props) {
    const {open, setOpen, ignoreRef} = useStateOpen(false);
    const cls = className ? " " + className : "";
    const btn_select = useRef<HTMLDivElement>(null);

    return (
        <div className={Styles.large_button + cls} onClick={(ev) => {
            setOpen(!(btn_select.current && btn_select.current.contains(ev.target as HTMLElement)));
        }} ref={ignoreRef}>
            <img  className={Styles.large_button_icon} src={Icons} alt=""/>
            {context === "main" && "Add component"}
            {context === "inline" && "Add inline component"}
            {context === "container" && "Add content"}
            {context === "button-row" && "Add button"}

            { open && <div className={Styles.large_button_ctx} ref={btn_select}>
                {['main', 'inline', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.TextDisplay())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={TextDisplayIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Content</div>
                </div>}
                {['main'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Container)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={ContainerIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Container</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.MediaGallery)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={MediaGalleryIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Image</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.File)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={UploadIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>File</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Separator)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={SeparatorIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Separator</div>
                </div>}
                {['main', 'frame', 'container', 'button-row'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(context==='frame' ? default_settings.Button().components[0] : default_settings.Button())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={ButtonIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Button</div>
                </div>}
                {['main', 'frame', 'container', 'button-row'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(context==='frame' ? default_settings.LinkButton().components[0] : default_settings.LinkButton())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={LinkButtonIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Button link</div>
                </div>}
                {['main', 'container', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.StringSelect())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={SelectIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Select menu</div>
                </div>}
                {['frame'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Thumbnail)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={MediaGalleryIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>Thumbnail</div>
                </div>}
            </div>}
        </div>
    )
}