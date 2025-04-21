import { ComponentsProps } from '../Capsule';
import { TextDisplayComponent } from '../utils/componentTypes';
import Styles from './TextDisplay.module.css';

export function TextDisplay({
    state,
    stateKey,
    stateManager,
    passProps,
}: ComponentsProps & { state: TextDisplayComponent }) {
    const Comp = passProps.BetterInput;
    return (
        <div className={Styles.text_display}>
            <Comp
                onChange={(ev) => {
                    stateManager.setKey({ key: [...stateKey, 'content'], value: ev.target.value });
                }}
                value={state?.content || ''}
                passProps={passProps}
            />
        </div>
    );
}
