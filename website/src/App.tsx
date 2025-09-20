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
import { Trans, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { supportedLngs } from '../libs.config';


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
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    const showThread = useSelector((state: RootState) => state.display.showThread);
    const isDefault = useSelector((state: RootState) => state.display.isDefault);
    const [page, setPage] = useRouter();
    const [postTitle, setPostTitle] = useState<string>("");
    useHashRouter();

    const setFile = useCallback(webhookImplementation.setFile, []);
    const getFile = useCallback(webhookImplementation.getFile, [])
    const getFileName = useCallback(webhookImplementation.getFileName, [])
    const passProps = useMemo((): PassProps => ({
        getFile,
        getFileName,
        setFile,
        BetterInput,
        EmojiPicker,
        ColorPicker,
        // ActionMenu,
        EmojiShow,
        interactiveDisabled: false,
    }), []);

    useEffect(() => {
        const getData = setTimeout(() => localStorage.setItem("discord.builders__webhookToken", webhookUrl), 1000)
        return () => clearTimeout(getData)
    }, [webhookUrl]);


    let parsed_url: URL | null = null;
    try {
        parsed_url = new URL(webhookUrl);

        if (parsed_url.pathname.startsWith('/api/webhooks/') && parsed_url.hostname === 'discord.com') {
            parsed_url.protocol = 'https:';
            parsed_url.pathname = '/api/v10/webhooks/' + parsed_url.pathname.slice('/api/webhooks/'.length);
        }

        const parsed_query = new URLSearchParams(parsed_url.search);
        parsed_query.set('with_components', 'true');
        parsed_url.search = parsed_query.toString();
    } catch (e) {}

    const stateKey = useMemo(() => ['data'], [])

    const errors = useMemo(() => webhookImplementation.getErrors(response), [response]);

    const threadId = useMemo(() => getThreadId(webhookUrl), [webhookUrl]);
    useEffect(() => {
        if (threadId) dispatch(actions.setShowThread())
    }, [threadId]);

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

    const dialog = useRef<HTMLDialogElement>(null);

    if (page === '404.not-found') {
        if (!window.location.href.includes('/not-found')) window.location.href = '/not-found';
        return <div><meta name="robots" content="noindex" /><h1>404 — Page not found</h1></div>;
    }
    
    const { t } = useTranslation('website');

    return <div className={Styles.app}>
        {(isDefault && page === '200.home') && <div className={Styles.alert}>
            <p>{t('welcome.welcome')}</p>
            <p>{t('welcome.home')}</p>

            <p><Trans t={t} i18nKey={"welcome.github"} components={{
                b: <b />,
                br: <br />,
                a: <a href="https://github.com/StartITBot/discord.builders" target="_blank"/>,
            }} /></p>
            <p><button onClick={() => {
                dispatch(actions.setKey({key: ['data'], value: []}));
            }}>{t('welcome.clear')}</button></p>
        </div>}
        {(isDefault && page !== '200.home') && <div className={Styles.alert}>
            <p>{t('welcome.welcome')}</p>
            <p><Trans t={t} i18nKey={"welcome.codegen"} components={{
                b: <b />,
            }} values={{page: page}} /></p>

            <p><button onClick={() => {
                dispatch(actions.setKey({key: ['data'], value: []}));
            }}>Clear everything</button></p>
        </div>}
        <ErrorBoundary fallback={<></>}>
            <Capsule state={state}
                     stateManager={stateManager}
                     stateKey={stateKey}
                     passProps={passProps}
                     className={Styles.preview}
                     errors={errors}
            />
        </ErrorBoundary>
        <div className={Styles.json}>
            <h1>discord.builders — {t('homepage.title')}</h1>
            <a href="https://github.com/StartITBot/discord.builders" target="_blank"><div className={Styles.badges}>
                <img alt="Star on GitHub"
                     src="https://img.shields.io/github/stars/StartITBot/discord.builders?style=for-the-badge&logo=github&label=Star+on+GitHub&color=007ec6" />
                <img alt="GitHub contributors"
                     src="https://img.shields.io/github/contributors/StartITBot/discord.builders?style=for-the-badge&color=248045" />
                <img alt="GitHub commits"
                     src="https://img.shields.io/github/commit-activity/t/StartITBot/discord.builders?style=for-the-badge&color=248045" />
            </div></a>

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


            <Codegen state={state} page={page} setPage={setPage} />

            <div className={Styles.footer}>
                <div className={Styles.langs}>
                    {supportedLngs.map((lang) => (
                        <span key={lang} className={Styles.lang} onClick={() => i18next.changeLanguage(lang)}>{lang}</span>
                    ))}
                </div>
                <div><Trans t={t} i18nKey={"author"} components={{
                    a: <a href={"https://startit.bot/?utm_source=discord.builders"} target={"_blank"} />
                }} /></div>
            </div>
        </div>
    </div>
}

export default App;
