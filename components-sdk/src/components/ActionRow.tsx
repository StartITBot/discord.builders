import { COMPONENTS, ComponentsProps } from '../Capsule';
import Styles from './ActionRow.module.css';
import { CapsuleButton } from '../CapsuleButton';
import { ActionRowComponent, ActionRowPossible, ButtonComponent, Component } from '../utils/componentTypes';

export function ActionRow({
    state,
    stateKey,
    stateManager,
    passProps,
}: ComponentsProps & { state: ActionRowComponent<ActionRowPossible> }) {
    const selectButton = (state?.components || []).find((component) => component.type === 3);

    return (
        <div className={selectButton ? '' : Styles.action_row}>
            {(state?.components || []).map((component, index) => {
                const Component = COMPONENTS[component.type];
                if (typeof Component === 'undefined') return null;
                return (
                    <Component
                        key={component.custom_id}
                        stateKey={[...stateKey, 'components', index]}
                        passProps={passProps}
                        stateManager={stateManager}
                        state={component}
                        removeKeyParent={stateKey}
                    />
                );
            })}

            {!selectButton && (
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
