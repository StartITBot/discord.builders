import { CodeBlock, dracula } from 'react-code-blocks';
import Styles from './App.module.css';
import Select, { Props } from 'react-select';
import { select_styles } from './Select';
import { useState } from 'react';
import { libs } from '../libs.config';
import { ClientFunction, IncludeCallback } from 'ejs';
import { RootState } from './state';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';
import { Component } from 'components-sdk';

const codegenModules: {
    [name: string]: { default: ClientFunction };
} = import.meta.globEager('./codegen/**/*.ejs');

const libComponents: {[name: string]: ClientFunction} = {};

for (const key of Object.keys(codegenModules)) {
    const match = key.match(/^\.\/codegen\/([^/]+)\/main(?:\.[^/]*)?\.ejs$/);
    if (match) {
        const group = match[1];
        libComponents[group] = codegenModules[key].default;
    }
}

const importCallback: IncludeCallback = (name, data) => {
    const mainDart = codegenModules['./codegen' + name]?.default;
    if (typeof mainDart === "undefined") throw Error(`Component ${name} doesn't exist.`)
    return mainDart(data, undefined, importCallback);
};

type selectOption = {
    label: string;
    value: string;
}

export function Codegen({state} : {state: Component[]}) {
    const [libSelected, setLibSelected] = useState<string>('json');

    const selectOptions: selectOption[] = [
        {
            label: 'JSON',
            value: 'json',
        },
        ...Object.keys(libComponents).map((comp) => ({
            label: libs[comp]?.name || comp,
            value: comp,
        })),
    ];

    let data;
    let language = 'json';

    if (Object.keys(libComponents).includes(libSelected)) {
        const renderer = libComponents[libSelected];
        data = renderer({components: state}, undefined, importCallback);
        language = libs[libSelected]?.language || 'json';
    } else {
        data = JSON.stringify(state, undefined, 4)
    }

    return (
        <>
            <p style={{marginBottom: '1rem'}}>Code generator</p>
            <Select
                styles={select_styles}
                options={selectOptions}
                isMulti={false}
                value={selectOptions.find((opt) => opt.value === libSelected)}
                onChange={((newValue: OnChangeValue<selectOption, false>) => {
                    if (newValue) setLibSelected(newValue.value);
                }) as Props['onChange']}
            />

            <div className={Styles.data}>
                <CodeBlock text={data} language={language} showLineNumbers={false} theme={dracula} />
            </div>
        </>
    );
}
