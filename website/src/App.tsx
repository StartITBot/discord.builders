import {Capsule} from "components-sdk";
import {useCallback, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {actions, DisplaySliceManager, RootState} from "./state";
import {BetterInput} from "./BetterInput";
import {EmojiPicker} from "./EmojiPicker";
import {EmojiShow} from "./EmojiShow";
import Styles from './App.module.css'
import {webhookImplementation} from "./webhook.impl";
import {ErrorBoundary} from "react-error-boundary";
import { ColorPicker } from './ColorPicker';

webhookImplementation.init();

function App() {
    const dispatch = useDispatch();
    const stateManager = useMemo(() => new DisplaySliceManager(dispatch), [dispatch]);
    const state = useSelector((state: RootState) => state.display.data)
    const webhookUrl = useSelector((state: RootState) => state.display.webhookUrl);
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    const currentHash = useRef<string | null>(null);

    const setFile = useCallback(webhookImplementation.setFile, []);
    const getFile = useCallback(webhookImplementation.getFile, [])
    useEffect(() => {
        webhookImplementation.clean(state);
        if (currentHash === null) {
            // ignore state changes, it should be loaded from URL first
            return;
        }

        const getData = setTimeout(() => {
            const value = btoa(encodeURIComponent(JSON.stringify(state)));
            currentHash.current = value;  // infinite loop resolver
            document.location.hash = value;
        }, 600)

        return () => clearTimeout(getData)
    }, [state]);


    useEffect(() => {
        const getData = setTimeout(() => localStorage.setItem("discord.builders__webhookToken", webhookUrl), 1000)
        return () => clearTimeout(getData)
    }, [webhookUrl]);

    useEffect(() => {
        const handleChange = (event: {newURL: string}) => {
            const newHash = new URL(event.newURL).hash.substring(1);
            if (newHash === currentHash.current) return;
            console.log("Loaded state from URL");

            let value;
            try {
                value = JSON.parse(decodeURIComponent(atob(newHash)));
            } catch (e) {
                value = [];
            }

            dispatch(actions.setKey({key: ['data'], value}))
            currentHash.current = event.newURL.substring(1);
        };

        handleChange({newURL: window.location.toString()})
        window.addEventListener('hashchange', handleChange);
        return () => window.removeEventListener('hashchange', handleChange);
    }, [])

    let parsed_url: URL | null = null;
    try {
        parsed_url = new URL(webhookUrl);
        parsed_url.search = '?with_components=true'
    } catch (e) {
    }

    return <div className={Styles.app}>
        <ErrorBoundary fallback={<></>}>
            <Capsule state={state}
                     stateManager={stateManager}
                     stateKey={['data']}
                     getFile={getFile}
                     setFile={setFile}
                     BetterInput={BetterInput}
                     EmojiPicker={EmojiPicker}
                     ColorPicker={ColorPicker}
                     EmojiShow={EmojiShow}
                     className={Styles.preview}
            />
        </ErrorBoundary>
        <div className={Styles.json}>
            <h1>Message builder</h1>
            <p style={{marginBottom: '2rem', marginTop: '1rem'}}>Warning: Non-link buttons and select menus are not
                allowed when sending message via webhook.</p>

            <div className={Styles.input_pair}>
                <div className={Styles.input}>
                    <input placeholder={"Webhook link"} type="text" value={webhookUrl}
                           onChange={ev => dispatch(actions.setWebhookUrl(ev.target.value))}/>
                </div>
                <button disabled={!parsed_url} onClick={async () => {
                    const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state))

                    const status_code = req.status;
                    if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));

                    const error_data = await req.json();
                    dispatch(actions.setWebhookResponse(error_data))
                }}>
                    Send
                </button>
            </div>

            {!!response && <div className={Styles.data}
                                style={{
                                    marginBottom: '2rem',
                                    color: '#dd9898'
                                }}>{JSON.stringify(response, undefined, 4)}</div>}
            <div className={Styles.data}>{JSON.stringify(state, undefined, 4)}</div>
        </div>
    </div>
}

export default App;
