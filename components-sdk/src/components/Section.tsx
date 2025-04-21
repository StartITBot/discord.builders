import CapsuleStyles from '../Capsule.module.css';
import { COMPONENTS, ComponentsProps } from '../Capsule';
import Styles from './Section.module.css';
import { CapsuleButton } from '../CapsuleButton';
import { CapsuleInner } from '../CapsuleInner';
import { SectionComponent } from '../utils/componentTypes';
import { ReactNode } from 'react';

export function Section({ state, stateKey, stateManager, passProps }: ComponentsProps & { state: SectionComponent }) {
    const Accessory = COMPONENTS[state.accessory.type];
    if (typeof Accessory === 'undefined') return null;

    return (
        <div className={Styles.section}>
            <div className={Styles.left}>
                <CapsuleInner
                    state={state?.components || []}
                    stateKey={[...stateKey, 'components']}
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
                    state={state.accessory}
                    stateKey={[...stateKey, 'accessory']}
                    stateManager={stateManager}
                    passProps={passProps}
                />
            </div>
        </div>
    );
}
export function SectionFrame({
    children,
    stateKey,
    stateManager,
}: {
    children: ReactNode;
    stateKey: ComponentsProps['stateKey'];
    stateManager: ComponentsProps['stateManager'];
}) {
    return (
        <div className={Styles.section}>
            <div className={Styles.left}>{children}</div>
            <div className={Styles.right}>
                <CapsuleButton
                    context={'frame'}
                    className={CapsuleStyles.pseudo}
                    callback={(accessory) =>
                        stateManager.wrapKey({
                            key: stateKey,
                            toArray: true,
                            innerKey: 'components',
                            value: {
                                type: 9,
                                accessory,
                            },
                        })
                    }
                />
            </div>
        </div>
    );
}
