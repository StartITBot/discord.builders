import Styles from './Capsule.module.css';
import Icons from './icons/Icons.svg';
import TextDisplayIcon from './icons/TextDisplay.svg';
import UploadIcon from './icons/Upload.svg';
import ContainerIcon from './icons/Container.svg';
import MediaGalleryIcon from './icons/MediaGallery.svg';
import SeparatorIcon from './icons/Separator.svg';
import ButtonIcon from './icons/Button.svg';
import LinkButtonIcon from './icons/ButtonLink.svg';
import SelectIcon from './icons/Select.svg';
import UploadFile from './icons/UploadFile.svg';
import Input from './icons/Input.svg';
import Textarea from './icons/Textarea.svg';
import { default_settings } from './Capsule';
import { CSSProperties, useRef } from 'react';
import { Component } from './utils/componentTypes';
import { useStateOpen } from './utils/useStateOpen';
import { useTranslation } from 'react-i18next';

export type capsuleButtonCtx = 'main' | 'container' | 'inline' | 'button-row' | 'frame' | 'modal';

type props = {
    context: capsuleButtonCtx,
    callback: (data: Component) => any,
    className?: string,
    style?: CSSProperties,
    interactiveDisabled: boolean
};

export function CapsuleButton({context, callback, className, style, interactiveDisabled} : props) {
    const {open, setOpen, ignoreRef} = useStateOpen(false);
    const cls = className ? " " + className : "";
    const btn_select = useRef<HTMLDivElement>(null);
    const {t} = useTranslation("components-sdk")

    return (
        <div style={style} className={Styles.large_button + cls} onClick={(ev) => {
            setOpen(!(btn_select.current && btn_select.current.contains(ev.target as HTMLElement)));
        }} ref={ignoreRef}>
            <img  className={Styles.large_button_icon} src={Icons} alt=""/>
            {context === "main" && t('button.add-component')}
            {context === "inline" && t('button.add-inline')}
            {context === "container" && t('button.add-content')}
            {context === "button-row" && t('button.add-button')}
            {context === "modal" && t('button.add-input')}

            { open && <div className={Styles.large_button_ctx} ref={btn_select}>
                {['main', 'inline', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.TextDisplay())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={TextDisplayIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.content')}</div>
                </div>}
                {['main'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Container)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={ContainerIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.container')}</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.MediaGallery)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={MediaGalleryIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.image')}</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.File)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={UploadIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.file')}</div>
                </div>}
                {['main', 'container'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Separator)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={SeparatorIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.separator')}</div>
                </div>}
                {(['main', 'frame', 'container', 'button-row'].includes(context) && !interactiveDisabled) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(context==='frame' ? default_settings.Button().components[0] : default_settings.Button())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={ButtonIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.button')}</div>
                </div>}
                {['main', 'frame', 'container', 'button-row'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(context==='frame' ? default_settings.LinkButton().components[0] : default_settings.LinkButton())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={LinkButtonIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.button-link')}</div>
                </div>}
                {(['main', 'container', 'container'].includes(context) && !interactiveDisabled) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.StringSelect())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={SelectIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.select-menu')}</div>
                </div>}
                {['frame'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.Thumbnail)
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={MediaGalleryIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.thumbnail')}</div>
                </div>}
                {['modal'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.ModalShortInput())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={Input} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.modal.short-input')}</div>
                </div>}
                {['modal'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.ModalParagraphInput())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={Textarea} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.modal.paragraph-input')}</div>
                </div>}
                {['modal'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.TextDisplay())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={TextDisplayIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.modal.content')}</div>
                </div>}
                {['modal'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.ModalStringSelect())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={SelectIcon} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.modal.string-select')}</div>
                </div>}
                {['modal'].includes(context) && <div className={Styles.large_button_ctx_item} onClick={() => {
                    callback(default_settings.ModalFileUpload())
                }}>
                    <div className={Styles.large_button_ctx_item_img}><img src={UploadFile} alt=""/></div>
                    <div className={Styles.large_button_ctx_item_text}>{t('components.modal.file-upload')}</div>
                </div>}
            </div>}
        </div>
    )
}