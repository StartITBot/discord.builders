import {FC} from "react";

export interface ColorPickerProps {
    hexColor?: string,
    onChange: (hex: number | null) => void
}

export type ColorPicker = FC<ColorPickerProps>
