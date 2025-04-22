import Styles from './JsonDisplay.module.css';
import ContentCopy from './icons/ContentCopy.svg';
import Check from './icons/Check.svg';
import { useState } from 'react';

export type JsonDisplayProps = {
    obj: any;
    textColor?: string;
};

export const JsonDisplay = ({ obj, textColor }: JsonDisplayProps) => {
    const jsonString = JSON.stringify(obj, undefined, 4);
    const [icon, setIcon] = useState(ContentCopy);

    return (
        <div className={Styles.json_display}>
            <button
                onClick={async () => {
                    await navigator.clipboard.writeText(jsonString);

                    // Checking if the icon is the one we want to animate prevents multiple button
                    // presses from repeatedly making promises
                    if (icon === ContentCopy) {
                        setIcon(Check)
                        await new Promise(f => setTimeout(f, 1000));
                        setIcon(ContentCopy)
                    }
                }}
            >
                <img src={icon} alt={'Copy JSON'} title={"Copy JSON"}/>
            </button>
            <span style={{color: textColor}}>{jsonString}</span>
        </div>
    );
};
