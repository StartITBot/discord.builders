import Styles from './MediaGallery.module.css';
import { Thumbnail } from './Thumbnail';
import { ComponentsProps } from '../Capsule';
import { MediaGalleryComponent, MediaGalleryItem } from '../utils/componentTypes';
import { DroppableID } from '../dnd/components';
import { useMemo } from 'react';
import { useRandomString } from '../utils/useRegenerate';

function getClass(len: number) {
    if (len === 1) return Styles.alone;
    if (len === 3) return Styles.three;
    if (len === 4) return Styles.four;

    if (len % 3 === 0) return '';
    if (len % 3 === 1) return Styles.one;
    if (len % 3 === 2) return Styles.two;
}

export function MediaGallery({state, stateKey, stateManager, passProps} : ComponentsProps & {state: MediaGalleryComponent}) {
    const randomString = useRandomString();

    return <div className={Styles.gallery + ' ' + getClass((state?.items || []).length) }>
        {(state?.items || []).map((component, index) => {
            return <MediaGalleryInner
                key={`${randomString}::${index}`}
                state={component}
                stateKey={stateKey}
                stateManager={stateManager}
                passProps={passProps}
                index={index}
            />
        })}
    </div>
}

function MediaGalleryInner({state, stateKey, stateManager, passProps, index} : Omit<ComponentsProps, 'state' | 'actionCallback'> & {state: MediaGalleryItem, index: number}) {
    const stateKeyCached = useMemo(() => [...stateKey, 'items', index], [...stateKey, 'items', index]);

    return <Thumbnail
        className={Styles.gallery_item}
        droppableId={DroppableID.GALLERY_ITEM}
        removeKeyParent={stateKey}
        state={state}
        stateKey={stateKeyCached}
        stateManager={stateManager}
        passProps={passProps}
    />
}