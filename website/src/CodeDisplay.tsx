import { useState } from 'react';
import { dracula as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Styles from './CodeDisplay.module.css';
import ContentCopy from './icons/ContentCopy.svg';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Check from './icons/Check.svg';

export type CodeDisplayProps = {
    code: string;
    language: string;
};

export const CodeDisplay = ({ code, language }: CodeDisplayProps) => {
    const [icon, setIcon] = useState(ContentCopy);

    return (
        <div className={Styles.code_display}>
            <SyntaxHighlighter language={language} style={theme}>
                {code}
            </SyntaxHighlighter>

            <button
                onClick={async () => {
                    await navigator.clipboard.writeText(code);

                    // Checking if the icon is the one we want to animate prevents multiple button
                    // presses from repeatedly making promises
                    if (icon === ContentCopy) {
                        setIcon(Check);
                        await new Promise((f) => setTimeout(f, 1000));
                        setIcon(ContentCopy);
                    }
                }}
            >
                <img src={icon} alt={'Copy'} title={'Copy'} />
            </button>
        </div>
    );
};
