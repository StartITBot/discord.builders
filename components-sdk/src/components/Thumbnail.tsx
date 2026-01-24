import Styles from './Thumbnail.module.css';
import ThumbnailIcon from '../icons/Thumbnail.svg';
import TrashIcon from '../icons/Trash.svg';
import UploadImage from '../icons/UploadImage.svg';
import Url from '../icons/Url.svg';
import AddDescription from '../icons/AddDescription.svg';
import AddDescriptionActive from '../icons/AddDescriptionActive.svg';
import { Dispatch, SetStateAction, useRef } from 'react';
import CapsuleStyles from '../Capsule.module.css';
import { MenuLabel, MenuOption } from './Button';
import { ComponentsProps, default_settings } from '../Capsule';
import { MediaGalleryItem, ThumbnailComponent } from '../utils/componentTypes';
import { stateKeyType } from '../polyfills/StateManager';
import { useFileUpload } from '../utils/useFileUpload';
import SpoilerActiveIcon from '../icons/SpoilerActive.svg';
import SpoilerIcon from '../icons/Spoiler.svg';
import { useStateOpen } from '../utils/useStateOpen';
import { ClosestType } from '../dnd/types';
import { DragLines } from '../dnd/DragLine';
import { useTranslation } from 'react-i18next';

export function Thumbnail({
    state,
    stateKey,
    stateManager,
    passProps,
    removeKeyParent = undefined,
    className = undefined,
    droppableId = undefined,
    dragKeyToDeleteOverwrite = undefined,
    allowAddition = undefined,
    videoSupport = false
}: Omit<ComponentsProps, 'state' | 'actionCallback'> & { state: MediaGalleryItem | ThumbnailComponent; className?: string, allowAddition?: boolean, videoSupport?: boolean }) {
    const { open, setOpen, ignoreRef, closeLockRef } = useStateOpen(0);
    const btn_select = useRef<HTMLDivElement>(null);

    const { src, setSrc, openFileSelector, isVideo } = useFileUpload(
        state.media.url,
        [...stateKey, 'media', 'url'],
        passProps?.getFile,
        passProps?.setFile,
        stateManager,
        videoSupport
    );

    const {t} =  useTranslation('components-sdk');

    return (
        <div
            className={(className || Styles.thumbnail)}
            onClick={(ev) => {
                if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                setOpen(1);
            }}
            ref={ignoreRef}
        >
            <DragLines
                droppableId={droppableId ?? null}
                dragDisabled={!!open}
                draggable={true}
                defaultType={ClosestType.LEFT}
                data={state}
                stateKey={stateKey}
                removeKeyParent={removeKeyParent}
                dragKeyToDeleteOverwrite={dragKeyToDeleteOverwrite}
                className={state.spoiler ? Styles.spoiler : ''}
            >
                {(isVideo && videoSupport) ? <video src={src || undefined} data-image-role="main" /> : <img src={src || ThumbnailIcon} data-image-role="main" alt="" /> }
            </DragLines>
            {!!open && (
                <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                    {open === 1 && (
                        <MenuFirst
                            state={state}
                            stateKey={stateKey}
                            stateManager={stateManager}
                            setOpen={setOpen}
                            removeKeyParent={removeKeyParent}
                            openFileSelector={openFileSelector}
                            allowAddition={allowAddition}
                        />
                    )}
                    {open === 2 && (
                        <MenuLabel
                            closeLockRef={closeLockRef}
                            state={state.media.url}
                            stateKey={[...stateKey, 'media', 'url']}
                            stateManager={stateManager}
                            setOpen={setOpen}
                            placeholder={t('thumbnail.image-url')}
                            max={512} // guessing, official limit unknown
                        />
                    )}
                    {open === 3 && (
                        <MenuLabel
                            closeLockRef={closeLockRef}
                            state={state.description || ''}
                            stateKey={[...stateKey, 'description']}
                            stateManager={stateManager}
                            nullable={true}
                            setOpen={setOpen}
                            max={1024}
                        />
                    )}
                </div>
            )}
        </div>
    );
}



function MenuFirst({state, stateKey, stateManager, setOpen, openFileSelector, removeKeyParent, allowAddition} : {
    state: MediaGalleryItem | ThumbnailComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
    openFileSelector: () => any,
    removeKeyParent?: stateKeyType,
    allowAddition?: boolean
}) {
    const {t} = useTranslation('components-sdk');
    return <>
        <MenuOption src={Url} text={t('thumbnail.set-image-url')} onClick={ev => {
            stateManager.setKey({key: [...stateKey, "media", "url"], value: ''});
            setOpen(2)
            ev.stopPropagation();
        }} />
        <MenuOption src={UploadImage} text={t('thumbnail.upload-image')} onClick={() => {
            openFileSelector();
        }} />
        <MenuOption src={AddDescription} text={state.description ? t('thumbnail.change-description') : t('thumbnail.add-description')} onClick={ev => {
            setOpen(3)
            ev.stopPropagation();
        }} />
        {!!state.description && <MenuOption src={AddDescriptionActive} text={t('thumbnail.clear-description')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "description"], value: null})
        }} />}
        <MenuOption src={state.spoiler ? SpoilerActiveIcon : SpoilerIcon} text={state.spoiler ? t('thumbnail.remove-spoiler') : t('thumbnail.set-spoiler')} onClick={ev => {
            stateManager.setKey({key: [...stateKey, "spoiler"], value: !state.spoiler});
        }} />
        {!!removeKeyParent && <MenuOption src={TrashIcon} text={t('thumbnail.delete')} onClick={ev => {
            setOpen(0);
            stateManager.deleteKey({key: stateKey, removeKeyParent});
            ev.stopPropagation();
        }} />}
        {(!!removeKeyParent && allowAddition) && <MenuOption src={null} className={CapsuleStyles.separator} text={t('thumbnail.add-image')} onClick={ev => {
            setOpen(0);
            stateManager.appendKey({key: [...removeKeyParent, 'items'], value: default_settings.MediaGallery.items[0]});
            ev.stopPropagation();
        }} />}
    </>
}