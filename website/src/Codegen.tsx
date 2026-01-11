import { CodeBlock, dracula } from 'react-code-blocks';
import Styles from './App.module.css';
import Select, { Props } from 'react-select';
import { select_styles } from './Select';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { libs } from '../libs.config';
import { ClientFunction, IncludeCallback } from 'ejs';
import { RootState } from './state';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';
import { Component } from 'components-sdk';
import { useTranslation } from 'react-i18next';

const codegenModules: {
    [name: string]: { default: ClientFunction };
} = import.meta.glob('./codegen/**/*.ejs', { eager: true });

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

export function Codegen({state, page, setPage} : {
    state: Component[],
    page: string,
    setPage: (page: string) => void
}) {

    // In this scope of code null === JSON, this may change in the future
    const libSelected = page === '200.home' ? 'json' : page;
    const {t} = useTranslation("website");
    const setLibSelected = (lib: string) => setPage(lib === 'json' ? '200.home' : lib);

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

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <p style={{ marginBottom: '0.5rem', marginTop: '8rem' }}>{t('codegen.title')}</p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <Select
                        styles={select_styles}
                        options={selectOptions}
                        isMulti={false}
                        value={selectOptions.find((opt) => opt.value === libSelected)}
                        onChange={
                            ((newValue: OnChangeValue<selectOption, false>) => {
                                if (newValue) setLibSelected(newValue.value);
                            }) as Props['onChange']
                        }
                    />
                </div>

                <button
                    className={Styles.button}
                    onClick={handleCopy}
                    disabled={copied}
                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                >
                    {copied ? t('codegen.copied.button') : t('codegen.copy.button')}
                </button>
            </div>

            <div className={Styles.data}>
                <CodeBlock text={data} language={language} showLineNumbers={false} theme={dracula} />
            </div>
        </>
    );
}
