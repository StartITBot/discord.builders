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
            presetColors={[
                '#1abc9c', '#11806a', '#57F287', '#2ecc71', '#1f8b4c', '#3498db',
                '#206694', '#9b59b6', '#71368a', '#e91e63', '#ad1457', '#f1c40f',
                '#c27c0e', '#e67e22', '#a84300', '#ED4245', '#e74c3c', '#992d22',
                '#7289da', '#5865F2', '#99aab5', '#36393F', '#EB459E', '#FEE75C'
            ]}
        />
    </div>
}
