import Styles from './App.module.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { webhookImplementation } from './webhook.impl';
import { actions, RootState } from './state';
import { useEffect, useMemo, useRef, useState } from 'react';

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

export function Webhook() {
    const {t} = useTranslation("website");
    const dispatch = useDispatch();
    const showThread = useSelector((state: RootState) => state.display.showThread);
    const webhookUrl = useSelector((state: RootState) => state.display.webhookUrl);
    const state = useSelector((state: RootState) => state.display.data);
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    const [postTitle, setPostTitle] = useState<string>("");

    const dialog = useRef<HTMLDialogElement>(null);

    const threadId = useMemo(() => getThreadId(webhookUrl), [webhookUrl]);

    useEffect(() => {
        const getData = setTimeout(() => localStorage.setItem("discord.builders__webhookToken", webhookUrl), 1000)
        return () => clearTimeout(getData)
    }, [webhookUrl]);

    useEffect(() => {
        if (threadId) dispatch(actions.setShowThread())
    }, [threadId]);

    let parsed_url: URL | null = null;
    try {
        parsed_url = new URL(webhookUrl);

        if (parsed_url.pathname.startsWith('/api/webhooks/') && (parsed_url.hostname === 'discord.com' || parsed_url.hostname.endsWith('.discord.com'))) {
            parsed_url.protocol = 'https:';
            parsed_url.pathname = '/api/v10/webhooks/' + parsed_url.pathname.slice('/api/webhooks/'.length);
        }

        const parsed_query = new URLSearchParams(parsed_url.search);
        parsed_query.set('with_components', 'true');
        parsed_url.search = parsed_query.toString();
    } catch (e) {}

    const sendMessage = async () => {
        const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state))

        const status_code = req.status;
        if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));

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

        const req = await fetch(String(parsed_url), webhookImplementation.prepareRequest(state, postTitle))

        const status_code = req.status;
        if (status_code === 204) return dispatch(actions.setWebhookResponse({"status": "204 Success"}));

        const error_data = await req.json();
        dispatch(actions.setWebhookResponse(error_data))
    }

    return <>
        <p style={{marginBottom: '0.5rem', marginTop: '4rem'}}><span style={{fontSize: 16, color: 'white', fontWeight: '500'}}>{t('webhook.title')}</span>{!showThread && <> (<span className={Styles.link} onClick={() => dispatch(actions.setShowThread())}>{t('webhook.thread')}</span>) </>}</p>
        <div className={Styles.input_pair}>
            <div>
                <input className={Styles.input} placeholder={"Webhook link"} type="text" value={webhookUrl}
                       onChange={ev => dispatch(actions.setWebhookUrl(ev.target.value))}/>
            </div>
            <button className={Styles.button} disabled={parsed_url == null} onClick={sendMessage}>
                {t('webhook.send')}
            </button>
        </div>

        <p style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'grey'}}>{t('webhook.warning')}</p>

        {showThread && <div style={{marginBottom: '2rem'}}>
            <p style={{marginBottom: '0.5rem'}}>{t('thread.id')}</p>
            <input className={Styles.input} type="text" value={threadId || ""} onChange={ev => dispatch(actions.setThreadId(ev.target.value))} placeholder={t('thread.placeholder')}/>
        </div>}

        <dialog ref={dialog} className={Styles.dialog}>
            <form method="dialog"><button className={Styles.close}>✕</button></form>
            <div>
                <p className={Styles.input_name}>{t('thread.post.label')}</p>
                <input className={Styles.input} autoFocus={true} type="text" value={postTitle} onChange={ev => setPostTitle(ev.target.value)} placeholder={t('thread.post.placeholder')}/>
            </div>
            <div className={Styles.button} onClick={sendMessageWithTitle}>{t('thread.post.button')}</div>
        </dialog>

        {!!response && <div className={Styles.data}
                            style={{
                                marginBottom: '2rem',
                                color: '#dd9898'
                            }}>{JSON.stringify(response, undefined, 4)}</div>}
    </>
}