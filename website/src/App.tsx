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
import { useRouter } from './useRouter';


webhookImplementation.init();

function getThreadId(webhookUrl: string) {
    try {
        const parsed_url = new URL(webhookUrl);
        const parsed_query = new URLSearchParams(parsed_url.search);
        const thread_id = parsed_query.get('thread_id');
        return thread_id || null;
    } catch (e) {
        return null;
    }
}

function App() {
    const dispatch = useDispatch();
    const stateManager = useMemo(() => new DisplaySliceManager(dispatch), [dispatch]);
    const state = useSelector((state: RootState) => state.display.data)
    const webhookUrl = useSelector((state: RootState) => state.display.webhookUrl);
    const messageLink = useSelector((state: RootState) => state.display.messageUrl);
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    const username = useSelector((state: RootState) => state.display.setusername);
    const avatar = useSelector((state: RootState) => state.display.setavatar);
    const [page, setPage] = useRouter();
    const [postTitle, setPostTitle] = useState<string>("");
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

    useEffect(() => {
        const getData = setTimeout(() => localStorage.setItem("discord.builders__messageLink", messageLink), 1000)
        return () => clearTimeout(getData)
    }, [messageLink]);

    useEffect(() => {
        document.querySelectorAll('._emoji_c7tgn_78').forEach(e => (e.childElementCount == 0) ? e.style.display = "none" : e.style.display = "");
    });

    let parsed_msg_url: URL | null = null;
    try {
        parsed_msg_url = new URL(messageLink);

        if (parsed_msg_url.pathname.startsWith('/channels/') && parsed_msg_url.hostname === 'discord.com') {
            parsed_msg_url.protocol = 'https:';
        }

        const parsed_query = new URLSearchParams(parsed_msg_url.search);
        parsed_msg_url.search = parsed_query.toString();
    } catch (e) {}

    let parsed_url: URL | null = null;
    try {
        parsed_url = new URL(webhookUrl);

        if (parsed_url.pathname.startsWith('/api/webhooks/') && parsed_url.hostname === 'discord.com') {
            parsed_url.protocol = 'https:';
            parsed_url.pathname = '/api/v10/webhooks/' + parsed_url.pathname.slice('/api/webhooks/'.length);
            if (parsed_msg_url != null) {
                parsed_url.pathname += '/messages/'+parsed_msg_url.pathname.split('/').pop();
            }
        }

        const parsed_query = new URLSearchParams(parsed_url.search);
        parsed_query.set('with_components', 'true');
        parsed_url.search = parsed_query.toString();
    } catch (e) {}

    const stateKey = useMemo(() => ['data'], [])

    const errors = useMemo(() => webhookImplementation.getErrors(response), [response]);

    const threadId = useMemo(() => getThreadId(webhookUrl), [webhookUrl]);

    const sendMessage = async () => {
        var method_req;
        let username_in = undefined;
        let avatarurl_in = undefined;
        if (parsed_msg_url != null) {method_req = "PATCH"}
        else {
            method_req = "POST";
            if (username != "") username_in = username;
            if (avatar != "") avatarurl_in = avatar;
        }
        const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state, method_req, ...Array(1), username_in, avatarurl_in))

        if (username == "" || avatar == ""){
            const req_2 = await fetch(String(webhookUrl), webhookImplementation.prepareRequest(state, "GET"))
            let data_2 = await req_2.json()
            if (username == "") dispatch(actions.setUsernameData(data_2["name"]))
            if (avatar == "") dispatch(actions.setAvatarData("https://cdn.discordapp.com/avatars/"+data_2["id"]+"/"+data_2["avatar"]+".png"))
        }

        const status_code = req.status;
        if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));
        else if (status_code === 200) return dispatch(actions.setWebhookResponse({"status": "200 Success"}));

        const error_data = await req.json();

        if (error_data?.code === 220001 && dialog.current !== null) {
            dialog.current.showModal();
            dispatch(actions.setWebhookResponse(null));
            return;
        }

        dispatch(actions.setWebhookResponse(error_data))
    }

    const getMessage = async () => {
        const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state, "GET"))

        const status_code = req.status;
        if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}))
        else if (status_code === 200) {
            let loaded_data = await req.json();
            let reg_check = /"id":(([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])|"[^"]*"),/gm; //Discord includes ids in the component but this doesnt like the ids (it causes duplicates), this is to remove them
            try {
                var fixed_data = JSON.parse(JSON.stringify(loaded_data).replaceAll(reg_check,""));
            } catch(err) {
                console.error(err);
            }
            dispatch(actions.setComponentsData([]))
            for (const comp of fixed_data["components"]){
                let data_to_add = comp
                if ("id" in data_to_add){
                    delete data_to_add.id;
                }
                dispatch(actions.appendKey({"key":["data"],"value":data_to_add}))
            }
            dispatch(actions.setUsernameData(loaded_data["author"]["username"]))
            dispatch(actions.setAvatarData("https://cdn.discordapp.com/avatars/"+loaded_data["author"]["id"]+"/"+loaded_data["author"]["avatar"]+".png"))

            return dispatch(actions.setWebhookResponse({"status": "200 Success"}))
        }

        const error_data = await req.json();

        if (error_data?.code === 220001 && dialog.current !== null) {
            dialog.current.showModal();
            dispatch(actions.setWebhookResponse(null))
            return;
        }

        dispatch(actions.setWebhookResponse(error_data))
    }

    const sendMessageWithTitle = async () => {
        if (!postTitle) return;
        dialog.current?.close();

        const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state, "POST", postTitle))

        const status_code = req.status;
        if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));

        const error_data = await req.json();
        dispatch(actions.setWebhookResponse(error_data))
    }

    const dialog = useRef<HTMLDialogElement>(null);

    if (page === '404.not-found') return <div className={Styles.not_found}><h1>404 — Page not found</h1><p>Check the URL and try again or go back to <a href="/">home</a></p></div>

    return <div className={Styles.app}>
        <ErrorBoundary fallback={<></>}>
            <Capsule state={state}
                     stateManager={stateManager}
                     stateKey={stateKey}
                     passProps={passProps}
                     className={Styles.input}
                     errors={errors}
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
                <div>
                    <input className={Styles.input} placeholder={"Webhook link"} type="text" value={webhookUrl}
                           onChange={ev => dispatch(actions.setWebhookUrl(ev.target.value))}/>
                </div>
                <button className={Styles.button} disabled={parsed_url == null} onClick={sendMessage}>
                    {((parsed_msg_url == null) ? 'Send' : 'Edit')}
                </button>
            </div>

            <p style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'grey'}}>Warning: Non-link buttons and select menus are not allowed when sending messages via webhook.</p>

            <div style={{marginBottom: '2rem'}}>
                <p style={{marginBottom: '0.5rem'}}>Thread ID</p>
                <input className={Styles.input} type="text" value={threadId || ""} onChange={ev => dispatch(actions.setThreadId(ev.target.value))} placeholder={"Optional. If you want to send the message to a thread, put the thread ID here."}/>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <p style={{marginBottom: '0.5rem'}}>Message Link</p>
                <div className={Styles.input_pair}>
                    <div>
                        <input className={Styles.input} placeholder={"Optional. If you want to edit a message"} type="text" value={messageLink}
                            onChange={ev => dispatch(actions.setMessageLink(ev.target.value))}/>
                    </div>
                    <button className={Styles.button} disabled={parsed_msg_url == null || parsed_url == null} onClick={getMessage}>
                        Load
                    </button>
                </div>
                <p style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'grey'}}>Warning: The message must to be sent by the webhook that edits it and uploading a image or a file doesnt work with editing.</p>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <div className={Styles.input_pair}>
                    <div>
                        <p style={{marginBottom: '0.5rem'}}>Username</p>
                        <input className={Styles.input} type="text" disabled={parsed_msg_url != null} value={username || ""} onChange={ev => dispatch(actions.setUsernameData(ev.target.value))} placeholder={((parsed_msg_url == null) ? 'Optional. If you want to change the username of the message.' : 'Cannot Change username in edit mode.')}/>
                        <p style={{marginBottom: '0.5rem', marginTop: '0px'}}>Avatar Url</p>
                        <input className={Styles.input} type="text" disabled={parsed_msg_url != null} value={avatar || ""} onChange={ev => dispatch(actions.setAvatarData(ev.target.value))} placeholder={((parsed_msg_url == null) ? 'Optional. If you want to change the avatar of the message.' : 'Cannot Change avatar in edit mode.')}/>
                    </div>
                </div>
                <p style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'grey'}}>Warning: cant change name or profile when editing.</p>
            </div>

            <dialog ref={dialog} className={Styles.dialog}>
                <form method="dialog"><button className={Styles.close}>✕</button></form>
                <div>
                    <p className={Styles.input_name}>Post title</p>
                    <input className={Styles.input} autoFocus={true} type="text" value={postTitle} onChange={ev => setPostTitle(ev.target.value)} placeholder={"Enter a title…"}/>
                </div>
                <div className={Styles.button} onClick={sendMessageWithTitle}>Send message</div>
            </dialog>

            {!!response && <div className={Styles.data}
                                style={{
                                    marginBottom: '2rem',
                                    color: '#dd9898'
                                }}>{JSON.stringify(response, undefined, 4)}</div>}


            <Codegen state={state} page={page} setPage={setPage} />
        </div>
    </div>
}

export default App;
