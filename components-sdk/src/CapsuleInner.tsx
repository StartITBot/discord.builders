import { COMPONENTS, SECTIONABLE } from './Capsule';
import CapsuleStyles from './Capsule.module.css';
import { CapsuleButton, capsuleButtonCtx } from './CapsuleButton';
import { SectionFrame } from './components/Section';
import { Fragment, ReactElement } from 'react';
import { stateKeyType, StateManager } from './polyfills/StateManager';
import { Component, ComponentType, PassProps } from './utils/componentTypes';
import TimesSolid from './icons/times-solid.svg';

type commonProps = {
    showSectionButton?: boolean;
    stateManager: StateManager;
    removeKeyParent?: stateKeyType;
    passProps: PassProps;
    buttonContext: capsuleButtonCtx;
    buttonClassName?: string;
};

type props = {
    state: Component[];
    stateKey: stateKeyType;
} & commonProps;

export function CapsuleInner({
    state,
    stateKey,
    stateManager,
    showSectionButton = true,
    removeKeyParent,
    passProps,
    buttonContext,
    buttonClassName,
}: props) {
    return (
        <>
            {state.map((component, i) => (
                <CapsuleInnerItem
                    key={`${component.id || i}`}
                    state={component}
                    stateKey={[...stateKey, i]}
                    stateManager={stateManager}
                    showSectionButton={showSectionButton}
                    removeKeyParent={removeKeyParent}
                    passProps={passProps}
                    buttonContext={buttonContext}
                />
            ))}

            <CapsuleButton
                context={buttonContext}
                className={buttonClassName}
                callback={(value) => stateManager.appendKey({ key: stateKey, value })}
            />

            {/* CapsuleButton is inline, so you can add more buttons after <CapsuleInner .../> */}
        </>
    );
}

type itemProps = {
    state: Component;
    stateKey: stateKeyType;
} & commonProps;

function CapsuleInnerItem({ state, stateKey, stateManager, showSectionButton, removeKeyParent, passProps }: itemProps) {
    const Component = COMPONENTS[state.type];
    if (typeof Component === 'undefined') return null;

    return (
        <div className={CapsuleStyles.component}>
            <div
                className={CapsuleStyles.component_remove}
                onClick={() => {
                    if (state.type === 9 || state.type === 17) {
                        stateManager.deleteKey({ key: stateKey, decoupleFrom: 'components', removeKeyParent });
                        return;
                    }

                    stateManager.deleteKey({ key: stateKey, removeKeyParent });
                }}
            >
                <img width={14} height={14} src={TimesSolid} alt={'x'} />
            </div>
            <MaybeSection
                type={state.type}
                showSectionButton={showSectionButton}
                stateKey={stateKey}
                stateManager={stateManager}
            >
                <Component state={state} stateKey={stateKey} stateManager={stateManager} passProps={passProps} />
            </MaybeSection>
        </div>
    );
}

function MaybeSection({
    showSectionButton,
    type,
    stateKey,
    stateManager,
    children,
}: {
    showSectionButton: itemProps['showSectionButton'];
    stateKey: itemProps['stateKey'];
    stateManager: itemProps['stateManager'];
    type: ComponentType;
    children: ReactElement;
}): ReactElement {
    return showSectionButton && SECTIONABLE.includes(type) ? (
        <SectionFrame stateKey={stateKey} stateManager={stateManager} children={children} />
    ) : (
        children
    );
}
