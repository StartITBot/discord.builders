import {ColorPicker as ColorPickerType} from "components-sdk";
import { SketchPicker } from 'react-color';
import Trash from './icons/Trash.svg';
import Styles from './ColorPicker.module.css';

export const ColorPicker: ColorPickerType = ({hexColor, onChange}) => {
    return <div className={Styles.color_picker}>
        <button onClick={() => onChange(null)}><img src={Trash} alt={"Remove"} title={"Remove"}/></button>
        <SketchPicker
            color={hexColor}
            disableAlpha={true}
            onChange={(ev) => onChange(parseInt(ev.hex.replace("#", ""), 16))}
        />
    </div>
}
