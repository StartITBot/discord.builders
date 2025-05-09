import { Capsule, PassProps } from 'components-sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, DisplaySliceManager, RootState } from './state';
import { BetterInput } from './BetterInput';
import { EmojiPicker } from './EmojiPicker';
import { EmojiShow } from './EmojiShow';
import Styles from './App.module.css';
import { webhookImplementation } from './webhook.impl';
import { ErrorBoundary } from 'react-error-boundary';
import { ColorPicker } from './ColorPicker';
import { useHashRouter } from './useHashRouter';
import { Codegen } from './Codegen';


webhookImplementation.init();

function App() {
    const dispatch = useDispatch();
    const stateManager = useMemo(() => new DisplaySliceManager(dispatch), [dispatch]);
    const state = useSelector((state: RootState) => state.display.data)
    const webhookUrl = useSelector((state: RootState) => state.display.webhookUrl);
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    useHashRouter();

    const setFile = useCallback(webhookImplementation.setFile, []);
    const getFile = useCallback(webhookImplementation.getFile, [])
    const passProps = useMemo(() => ({
        getFile,
        setFile,
        BetterInput,
        EmojiPicker,
        ColorPicker,
        EmojiShow
    } as PassProps), []);

    useEffect(() => {
        const getData = setTimeout(() => localStorage.setItem("discord.builders__webhookToken", webhookUrl), 1000)
        return () => clearTimeout(getData)
    }, [webhookUrl]);


    let parsed_url: URL | null = null;
    try {
        parsed_url = new URL(webhookUrl);
        parsed_url.search = '?with_components=true'
    } catch (e) {}

    const stateKey = useMemo(() => ['data'], [])

    return <div className={Styles.app}>
        <ErrorBoundary fallback={<></>}>
            <Capsule state={state}
                     stateManager={stateManager}
                     stateKey={stateKey}
                     passProps={passProps}
                     className={Styles.preview}
            />
        </ErrorBoundary>
        <div className={Styles.json}>
            <h1>discord.builders — Best webhook tool for Discord</h1>
            <a href="https://github.com/StartITBot/discord.builders" target="_blank"><div className={Styles.badges}>
                <img alt="Star on GitHub"
                     src="https://img.shields.io/github/stars/StartITBot/discord.builders?style=for-the-badge&logo=github&label=Star+on+GitHub&color=007ec6" />
                <img alt="GitHub contributors"
                     src="https://img.shields.io/github/contributors/StartITBot/discord.builders?style=for-the-badge&color=248045" />
                <img alt="GitHub commits"
                     src="https://img.shields.io/github/commit-activity/t/StartITBot/discord.builders?style=for-the-badge&color=248045" />
            </div></a>

            <div className={Styles.input_pair}>
                <div className={Styles.input}>
                    <input placeholder={"Webhook link"} type="text" value={webhookUrl}
                           onChange={ev => dispatch(actions.setWebhookUrl(ev.target.value))}/>
                </div>
                <button disabled={parsed_url == null} onClick={async () => {
                    const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state))

                    const status_code = req.status;
                    if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));

                    const error_data = await req.json();
                    dispatch(actions.setWebhookResponse(error_data))
                }}>
                    Send
                </button>
            </div>

            <p style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'grey'}}>Warning: Non-link buttons and select menus are not allowed when sending message via webhook.</p>

            {!!response && <div className={Styles.data}
                                style={{
                                    marginBottom: '2rem',
                                    color: '#dd9898'
                                }}>{JSON.stringify(response, undefined, 4)}</div>}


            <Codegen state={state} />
        </div>
    </div>
}

export default App;
