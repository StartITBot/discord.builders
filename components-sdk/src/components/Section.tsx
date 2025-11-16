import CapsuleStyles from '../Capsule.module.css';
import { COMPONENTS, ComponentsProps } from '../Capsule';
import Styles from './Section.module.css';
import { CapsuleButton } from '../CapsuleButton';
import { CapsuleInner } from '../CapsuleInner';
import { SectionComponent } from '../utils/componentTypes';
import { ReactNode, useMemo } from 'react';
import { useDragLine } from '../dnd/DragLine';
import { dragline_hor } from '../dnd/DragLine.module.css';
import { DroppableID } from '../dnd/components';

export function Section({ state, stateKey, stateManager, passProps, actionCallback }: ComponentsProps & { state: SectionComponent }) {
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

    const components = state?.components || [];
    return (
        <div className={Styles.section}>
            <div>
                <CapsuleInner
                    droppableId={DroppableID.SECTION_CONTENT}
                    state={components}
                    stateKey={stateKeyComponents}
                    stateManager={stateManager}
                    showSectionButton={false}
                    removeKeyParent={stateKey}
                    buttonContext={'inline'}
                    buttonClassName={CapsuleStyles.inline}
                    passProps={passProps}
                    buttonShow={components.length < 3}
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
                    actionCallback={actionCallback}
                />

            </div>
        </div>
    );
}
export function SectionFrame({children, stateKey, stateManager, interactiveDisabled} : {
    children: ReactNode,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    interactiveDisabled: boolean
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
                interactiveDisabled={interactiveDisabled}
            />

            {(!!el.current && visible?.ref.element === el.current) && <div key={'top-dragline'} className={dragline_hor} style={{right: 0, maxHeight: 50}} />}
        </div>
    </div>
}