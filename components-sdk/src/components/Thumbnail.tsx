import Styles from "./Thumbnail.module.css";
import ThumbnailIcon from "../icons/Thumbnail.svg";
import TrashIcon from "../icons/Trash.svg";
import UploadImage from "../icons/UploadImage.svg";
import Url from "../icons/Url.svg";
import AddDescription from "../icons/AddDescription.svg";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import CapsuleStyles from "../Capsule.module.css";
import {MenuLabel} from "./Button";
import Icons from "../icons/Icons.svg";
import {ComponentsProps, default_settings} from "../Capsule";
import {MediaGalleryItem, ThumbnailComponent} from "../utils/componentTypes";
import {stateKeyType} from "../polyfills/StateManager";
import {useFileUpload} from "../utils/useFileUpload";
import SpoilerActiveIcon from "../icons/SpoilerActive.svg";
import SpoilerIcon from "../icons/Spoiler.svg";


export function Thumbnail({state, stateKey, stateManager, passProps, removeKeyParent = undefined, className=undefined} : Omit<ComponentsProps, 'state'> & {state: MediaGalleryItem | ThumbnailComponent, className?: string}) {
    const [open, setOpen] = useState(0);
    const btn = useRef<HTMLDivElement>(null);
    const btn_select = useRef<HTMLDivElement>(null);

    const {src, setSrc, openFileSelector} = useFileUpload(
        state.media.url,
        [...stateKey, "media", "url"],
        passProps?.getFile, passProps?.setFile, stateManager
    );

    const documentClick = useCallback((ev: MouseEvent) => {
        if (btn.current && !btn.current.contains(ev.target as HTMLElement)) setOpen(0);
    }, [btn.current]);

    useEffect(() => {
        document.addEventListener('mousedown', documentClick);
        return () => document.removeEventListener('mousedown', documentClick);
    }, []);


    return <div className={(className || Styles.thumbnail) + ' ' + (state.spoiler ? Styles.spoiler : '')}
    onClick={(ev) => {
        if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
        setOpen(1)
    }} ref={btn}>
        <img src={src || ThumbnailIcon} alt=""/>
        {!!open && <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
            {open === 1 && <MenuFirst state={state} stateKey={stateKey} stateManager={stateManager} setOpen={setOpen} removeKeyParent={removeKeyParent} openFileSelector={openFileSelector}/>}
            {open === 2 && <MenuLabel state={state.media.url} stateKey={[...stateKey, "media", "url"]} stateManager={stateManager} setOpen={setOpen}/>}
            {open === 3 && <MenuLabel state={state.description || ""} stateKey={[...stateKey, "description"]} stateManager={stateManager} nullable={true} setOpen={setOpen}/>}
        </div>}

    </div>
}



function MenuFirst({state, stateKey, stateManager, setOpen, openFileSelector, removeKeyParent} : {
    state: MediaGalleryItem | ThumbnailComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
    openFileSelector: () => any,
    removeKeyParent?: stateKeyType
}) {
    return <>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={ev => {
            stateManager.setKey({key: [...stateKey, "media", "url"], value: ''});
            setOpen(2)
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={Url} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Set image url</div>
        </div>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={ev => {
            openFileSelector();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={UploadImage} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Upload image</div>
        </div>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={ev => {
            setOpen(3)
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={AddDescription} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Add description</div>
        </div>
        <div className={CapsuleStyles.large_button_ctx_item} onClick={ev => {
            stateManager.setKey({key: [...stateKey, "spoiler"], value: !state.spoiler});
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={state.spoiler ? SpoilerActiveIcon : SpoilerIcon} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>{state.spoiler ? "Remove spoiler" : "Set spoiler"}</div>
        </div>
        {!!removeKeyParent && <div className={CapsuleStyles.large_button_ctx_item} onClick={ev => {
            setOpen(0);
            stateManager.deleteKey({key: stateKey, removeKeyParent});
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_img}><img src={TrashIcon} alt=""/></div>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Delete</div>
        </div>}
        {!!removeKeyParent && <div className={CapsuleStyles.large_button_ctx_item + ' ' + CapsuleStyles.separator} onClick={ev => {
            setOpen(0);
            stateManager.appendKey({key: [...removeKeyParent, 'items'], value: default_settings.MediaGallery.items[0]});
            ev.stopPropagation();
        }}>
            <div className={CapsuleStyles.large_button_ctx_item_text}>Add new image</div>
        </div>}
    </>
}