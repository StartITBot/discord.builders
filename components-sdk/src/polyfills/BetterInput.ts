import { FC } from 'react';
import { PassProps } from '../utils/componentTypes';

interface EventValue {
    value: string;
}

interface EventValueTarget {
    target: EventValue;
}

export interface BetterInputProps {
    passProps: PassProps;
    onChange: (ev: EventValueTarget) => any;
    value: string;
}

export type BetterInput = FC<BetterInputProps>;

/*
import BetterInput from "@internal/BetterInput";
import Styles from "./TextDisplay.module.css";

export function TextDisplay({state, setState, options_standard, hideTrack}) {
    return <div>
        <BetterInput
            onChange={(ev) => {
                setState({content: ev.target.value})
            }}
            value={state?.content || ""}
            options={options_standard}
            allowEnters={true}
            hideTrack={hideTrack}
            className={Styles.text_display}
        />
    </div>
}
 */
