import { COMPONENTS, ComponentsProps } from '../Capsule';
import Styles from './ActionRow.module.css';
import { CapsuleButton } from '../CapsuleButton';
import {
    ActionRowComponent,
    ActionRowPossible,
    ButtonComponent,
    ComponentType,
} from '../utils/componentTypes';
import { useMemo } from 'react';

export function ActionRow({
    state,
    stateKey,
    stateManager,
    passProps,
}: ComponentsProps & { state: ActionRowComponent<ActionRowPossible> }) {
    const isStringSelect = (state?.components || []).find((component) => component.type === ComponentType.STRING_SELECT);
    const noComponents = state?.components?.length || 0;

    return (
        <div className={isStringSelect ? '' : Styles.action_row}>
            {(state?.components || []).map((component, index) => (
                <ActionRowInner
                    key={index}
                    stateKey={stateKey}
                    index={index}
                    passProps={passProps}
                    stateManager={stateManager}
                    state={component}
                    removeKeyParent={stateKey}
                />
            ))}

            {(!isStringSelect && noComponents < 5) && (
                <CapsuleButton
                    context={'button-row'}
                    callback={(val) =>
                        stateManager.appendKey({
                            key: [...stateKey, 'components'],
                            value: (val as ActionRowComponent<ButtonComponent>).components[0],
                        })
                    }
                />
            )}
        </div>
    );
}

function ActionRowInner(props: ComponentsProps & {state: ActionRowPossible, index: number}) {
    const Component = COMPONENTS[props.state.type];
    if (typeof Component === "undefined") return null;
    const stateKeyCached = useMemo(() => [...props.stateKey, "components", props.index], [...props.stateKey]);

    return <Component stateKey={stateKeyCached} passProps={props.passProps} stateManager={props.stateManager} state={props.state} removeKeyParent={props.removeKeyParent} />;
}