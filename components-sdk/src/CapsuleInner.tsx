import { COMPONENTS, SECTIONABLE } from './Capsule';
import CapsuleStyles from './Capsule.module.css';
import { CapsuleButton, capsuleButtonCtx } from './CapsuleButton';
import { SectionFrame } from './components/Section';
import { memo, ReactElement, useCallback, useMemo, useState } from 'react';
import { stateKeyType, StateManager } from './polyfills/StateManager';
import { Component, ComponentType, PassProps } from './utils/componentTypes';
import TimesSolid from './icons/times-solid.svg';
import { DragLines, useDragLine } from './dnd/DragLine';
import { DroppableID } from './dnd/components';
import { dragline } from './dnd/DragLine.module.css';
import { flattenErrors } from './errors';
import { useRandomString } from './utils/useRegenerate';

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
    buttonShow?: boolean,
    errors?: Record<string, any> | null,
} & commonProps

export function CapsuleInner(props: props) {
    const {state, stateKey, stateManager, showSectionButton = true, buttonContext, buttonClassName, errors = null, droppableId, buttonShow = true} = props;
    const randomString = useRandomString();

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
        {state.map((component, i) => <CapsuleInnerItemMemo
            key={`${randomString}::${i}`}
            state={component}
            stateKey={stateKey}
            index={i}
            stateManager={stateManager}
            showSectionButton={showSectionButton}
            removeKeyParent={props.removeKeyParent}
            passProps={props.passProps}
            buttonContext={buttonContext}
            droppableId={droppableId}
            errors={errors}
            dragDisabled={droppableId === DroppableID.SECTION_CONTENT && i === 0}
        />)}

        <div>
            {hasErrors && flattenErrors(errors!).map((error, i) => <div key={i} className={CapsuleStyles.error}><b>Error:</b> {error}</div>)}
        </div>

        {buttonShow && <CapsuleButton context={buttonContext} className={buttonClassName} callback={value => stateManager.appendKey({key: stateKey, value})} interactiveDisabled={props.passProps.interactiveDisabled} />}

        {/* CapsuleButton is inline, so you can add more buttons after <CapsuleInner .../> */}

        </>
    );
}

type itemProps = {
    state: Component,
    stateKey: stateKeyType,
    index: number,
    errors: Record<string, any> | null
    dragDisabled?: boolean,
} & commonProps;

function CapsuleInnerItem({state, stateKey: stateKeyObj, index, stateManager, showSectionButton, removeKeyParent, passProps, droppableId, errors, dragDisabled}: itemProps) {
    /* Action menu start */
    const [active, setActive] = useState<string | null>(null);
    const actionCallback = useCallback((customId: string | null) => setActive(customId), []);
    const closeCallback = useCallback(() => setActive(null), []);
    const ActionMenu = passProps.ActionMenu
    /* Action menu end */

    const Component = COMPONENTS[state.type];
    const stateKey = useMemo(() => [...stateKeyObj, index], [...stateKeyObj, index]);
    if (typeof Component === "undefined") return null;
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
        <DragLines draggable={dragDisabled} dragDisabled={dragDisabled} droppableId={droppableId} data={state} stateKey={stateKey} removeKeyParent={removeKeyParent}><MaybeSection type={state.type} showSectionButton={showSectionButton} stateKey={stateKey} stateManager={stateManager} interactiveDisabled={passProps.interactiveDisabled}><>
            <Component actionCallback={ActionMenu != null ? actionCallback : undefined} state={state} stateKey={stateKey} stateManager={stateManager} passProps={passProps} errors={thisErrors}/>
            {showErrors && flattenErrors(thisErrors).map((error, i) => <div key={i} className={CapsuleStyles.error}><b>Error:</b> {error}</div>)}
            {(!!active && ActionMenu != null) && <ActionMenu closeCallback={closeCallback} customId={active} />}
        </></MaybeSection></DragLines>
    </div>
}

const CapsuleInnerItemMemo = memo(CapsuleInnerItem);

function MaybeSection({showSectionButton, type, stateKey, stateManager, children, interactiveDisabled}: {
    showSectionButton: itemProps['showSectionButton'],
    stateKey: itemProps['stateKey'],
    stateManager: itemProps['stateManager']
    type: ComponentType,
    children: ReactElement,
    interactiveDisabled: boolean
}): ReactElement {
    return (showSectionButton && SECTIONABLE.includes(type)) ?
        <SectionFrame stateKey={stateKey} stateManager={stateManager} children={children} interactiveDisabled={interactiveDisabled} /> : children
}