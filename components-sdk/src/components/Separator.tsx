import Styles from './Separator.module.css';
import { ComponentsProps } from '../Capsule';
import { SeparatorComponent, SeparatorSpacingSize } from '../utils/componentTypes';

export function Separator({ state, stateKey, stateManager }: ComponentsProps & { state: SeparatorComponent }) {
    return (
        <div className={Styles.separator_container}>
            <div style={state.spacing === SeparatorSpacingSize.LARGE ? { height: 50 } : { height: 20 }}></div>
            <div className={Styles.separator_line}>
                <div>
                    <input
                        type="checkbox"
                        checked={state.divider}
                        onChange={(ev) =>
                            stateManager.setKey({
                                key: [...stateKey, 'divider'],
                                value: ev.target.checked,
                            })
                        }
                    />
                </div>
                <div className={Styles.line} hidden={!state.divider}></div>
            </div>
            <div
                className={Styles.separator}
                style={state.spacing === SeparatorSpacingSize.LARGE ? { height: 50 } : {}}
                onClick={() =>
                    stateManager.setKey({
                        key: [...stateKey, 'spacing'],
                        value:
                            state.spacing === SeparatorSpacingSize.LARGE
                                ? SeparatorSpacingSize.SMALL
                                : SeparatorSpacingSize.LARGE,
                    })
                }
            >
                Click to change margin
            </div>
        </div>
    );
}