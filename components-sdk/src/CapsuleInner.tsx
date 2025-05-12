import { COMPONENTS, SECTIONABLE } from './Capsule';
import CapsuleStyles from './Capsule.module.css';
import { CapsuleButton, capsuleButtonCtx } from './CapsuleButton';
import { SectionFrame } from './components/Section';
import { ReactElement, useMemo } from 'react';
import { stateKeyType, StateManager } from './polyfills/StateManager';
import { Component, ComponentType, PassProps } from './utils/componentTypes';
import TimesSolid from './icons/times-solid.svg';
import { DragLines, useDragLine } from './dnd/DragLine';
import { DroppableID } from './dnd/components';
import { dragline } from './dnd/DragLine.module.css';
import { flattenErrors } from './errors';

type commonProps = {
    showSectionButton?: boolean;
    stateManager: StateManager;
    removeKeyParent?: stateKeyType;
    passProps: PassProps;
    buttonContext: capsuleButtonCtx;
    droppableId: DroppableID;
};

type props = {
    state: Component[],
    stateKey: stateKeyType,
    buttonClassName?: string,
    errors?: Record<string, any> | null,
} & commonProps

export function CapsuleInner({state, stateKey, stateManager, showSectionButton = true, removeKeyParent, passProps, buttonContext, buttonClassName, droppableId, errors = null}: props) {

    const { ref: el, visible } = useDragLine({
        stateKey: stateKey,
        droppableId: state.length === 0 ? droppableId : null,
    });

    const hasErrors = errors ? "_errors" in errors : false;

    return (
        <>

        <div ref={el} style={{ position: 'relative' }}>
            {!!el.current && visible?.ref.element === el.current && (
                <div key={'top-dragline'} className={dragline} style={{ top: -6 }} />
            )}
        </div>
        {state.map((component, i) => <CapsuleInnerItem
            key={`${component.id || i}`}
            state={component}
            stateKey={stateKey}
            index={i}
            stateManager={stateManager}
            showSectionButton={showSectionButton}
            removeKeyParent={removeKeyParent}
            passProps={passProps}
            buttonContext={buttonContext}
            droppableId={droppableId}
            errors={errors}
        />)}

        <div>
            {hasErrors && flattenErrors(errors!).map((error, i) => <div key={i} className={CapsuleStyles.error}><b>Error:</b> {error}</div>)}
        </div>

        <CapsuleButton context={buttonContext} className={buttonClassName} callback={value => stateManager.appendKey({key: stateKey, value})} />

        {/* CapsuleButton is inline, so you can add more buttons after <CapsuleInner .../> */}

        </>
    );
}

type itemProps = {
    state: Component,
    stateKey: stateKeyType,
    index: number,
    errors: Record<string, any> | null,
} & commonProps;

function CapsuleInnerItem({state, stateKey: stateKeyObj, index, stateManager, showSectionButton, removeKeyParent, passProps, droppableId, errors}: itemProps) {
    const Component = COMPONENTS[state.type];
    if (typeof Component === "undefined") return null;
    const stateKey = useMemo(() => [...stateKeyObj, index], [...stateKeyObj, index]);
    const thisErrors = errors !== null ? errors[String(index)] : null;
    const showErrors = !!thisErrors && ![ComponentType.CONTAINER].includes(state.type);

    return <div className={CapsuleStyles.component}>
        <div className={CapsuleStyles.component_remove} onClick={() => {
            if (state.type === ComponentType.SECTION || state.type === ComponentType.CONTAINER) {
                stateManager.deleteKey({key: stateKey, decoupleFrom: 'components', removeKeyParent});
                return;
            }

            stateManager.deleteKey({key: stateKey, removeKeyParent});
        }}><img width={14} height={14} src={TimesSolid} alt={'x'}/></div>
        <DragLines droppableId={droppableId} data={state} stateKey={stateKey} removeKeyParent={removeKeyParent}><MaybeSection type={state.type} showSectionButton={showSectionButton} stateKey={stateKey} stateManager={stateManager}><>
            <Component state={state} stateKey={stateKey} stateManager={stateManager} passProps={passProps} errors={thisErrors}/>
            {showErrors && flattenErrors(thisErrors).map((error, i) => <div key={i} className={CapsuleStyles.error}><b>Error:</b> {error}</div>)}
        </></MaybeSection></DragLines>
    </div>
}

function MaybeSection({showSectionButton, type, stateKey, stateManager, children}: {
    showSectionButton: itemProps['showSectionButton'],
    stateKey: itemProps['stateKey'],
    stateManager: itemProps['stateManager']
    type: ComponentType,
    children: ReactElement
}): ReactElement {
    return (showSectionButton && SECTIONABLE.includes(type)) ?
        <SectionFrame stateKey={stateKey} stateManager={stateManager} children={children} /> : children
}