import CapsuleStyles from '../Capsule.module.css';
import { COMPONENTS, ComponentsProps } from '../Capsule';
import Styles from './Section.module.css';
import { CapsuleButton } from '../CapsuleButton';
import { CapsuleInner } from '../CapsuleInner';
import { SectionComponent } from '../utils/componentTypes';
import { ReactNode, useMemo } from 'react';
import { useDragLine } from '../drag/DragLine';
import { dragline_hor } from '../drag/DragLine.module.css';
import { DroppableID } from '../drag/components';

export function Section({ state, stateKey, stateManager, passProps }: ComponentsProps & { state: SectionComponent }) {
    const Accessory = COMPONENTS[state.accessory.type];
    if (typeof Accessory === 'undefined') return null;

    const stateKeyComponents = useMemo(() => [...stateKey, 'components'], [...stateKey]);
    const stateKeyAccessory = useMemo(() => [...stateKey, 'accessory'], [...stateKey]);

    const dragKeyToDeleteOverwrite: ComponentsProps['dragKeyToDeleteOverwrite'] = useMemo(
        () => ({
            stateKey: stateKey,
            decoupleFrom: 'components',
        }),
        [...stateKey]
    );

    return (
        <div className={Styles.section}>
            <div className={Styles.left}>
                <CapsuleInner
                    droppableId={DroppableID.SECTION_CONTENT}
                    state={state?.components || []}
                    stateKey={stateKeyComponents}
                    stateManager={stateManager}
                    showSectionButton={false}
                    removeKeyParent={stateKey}
                    buttonContext={'inline'}
                    buttonClassName={CapsuleStyles.inline}
                    passProps={passProps}
                />
            </div>
            <div className={Styles.right}>
                <Accessory
                    droppableId={DroppableID.SECTION_EDIT_ACCESSORY}
                    state={state.accessory}
                    stateKey={stateKeyAccessory}
                    stateManager={stateManager}
                    passProps={passProps}
                    dragKeyToDeleteOverwrite={dragKeyToDeleteOverwrite}
                />
            </div>
        </div>
    );
}
export function SectionFrame({children, stateKey, stateManager} : {
    children: ReactNode,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
}) {
    const { ref: el, visible } = useDragLine({stateKey, droppableId: DroppableID.SECTION_ADD_ACCESSORY});
    return <div className={Styles.section}>
        <div>
            {children}
        </div>
        <div className={Styles.right} ref={el}>
            <CapsuleButton
                context={'frame'}
                className={CapsuleStyles.pseudo}
                callback={accessory => stateManager.wrapKey({
                    key: stateKey,
                    toArray: true,
                    innerKey: 'components',
                    value: {
                        type: 9,
                        accessory
                    }
                })}
                style={(!!el.current && visible?.ref.element === el.current) ? {opacity: 0, pointerEvents: 'none'} : {}}
            />

            {(!!el.current && visible?.ref.element === el.current) && <div key={'top-dragline'} className={dragline_hor} style={{right: 0, maxHeight: 50}} />}
        </div>
    </div>
}