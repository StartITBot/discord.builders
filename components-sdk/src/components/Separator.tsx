import Styles from './Separator.module.css';
import {ComponentsProps, SPACING_LARGE, SPACING_SMALL} from "../Capsule";
import {SeparatorComponent} from "../utils/componentTypes";

export function Separator({state, stateKey, stateManager} : ComponentsProps & {state: SeparatorComponent}) {
    return <div className={Styles.separator_container}>
        <div style={state.spacing === SPACING_LARGE ? {height: 50} : {height: 20}} ></div>
        <div className={Styles.separator_line}>
            <div><input type="checkbox" checked={state.divider} onChange={(ev) => stateManager.setKey({
                key: [...stateKey, "divider"],
                value: ev.target.checked
            })} /></div>
            <div className={Styles.line} hidden={!state.divider}></div>
        </div>
        <div className={Styles.separator} style={state.spacing === SPACING_LARGE ? {height: 50} : {}}
             onClick={() => stateManager.setKey({
                key: [...stateKey, "spacing"],
                value: state.spacing === SPACING_LARGE ? SPACING_SMALL : SPACING_LARGE
            })}>
            Click to change margin
        </div>
    </div>
}