import { Capsule, PassProps, RenderMode } from 'components-sdk';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, displaySlice, DisplaySliceManager, RootState } from './state';
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
import defaultJson from './defaultJson';
import defaultJsonModal from './defaultJsonModal';
import { Webhook } from './Webhook';

webhookImplementation.init();

function App() {
    const dispatch = useDispatch();
    const stateManager = useMemo(() => new DisplaySliceManager(dispatch), [dispatch]);
    const state = useSelector((state: RootState) => state.display.data)
    const response = useSelector((state: RootState) => state.display.webhookResponse);
    const isDefault = useSelector((state: RootState) => state.display.isDefault);
    const [page, setPage] = useRouter();
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
        renderMode: page === 'modal' ? RenderMode.MODAL : RenderMode.MESSAGE
    }), [page]);
    useEffect(() => {
        if (isDefault) dispatch(displaySlice.actions.overwriteDefaultState(page === 'modal' ? defaultJsonModal : defaultJson))
    }, [isDefault, page]);

    const stateKey = useMemo(() => ['data'], [])

    const errors = useMemo(() => webhookImplementation.getErrors(response), [response]);

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
        {(isDefault && page !== '200.home' && page !== 'modal') && <div className={Styles.alert}>
            <p>{t('welcome.welcome')}</p>
            <p><Trans t={t} i18nKey={"welcome.codegen"} components={{
                b: <b />,
            }} values={{page: page}} /></p>

            <p><button onClick={() => {
                dispatch(actions.setKey({key: ['data'], value: []}));
            }}>{t('welcome.clear')}</button></p>
        </div>}
        <ErrorBoundary fallback={<></>}>
            <Capsule state={state}
                     stateManager={stateManager}
                     stateKey={stateKey}
                     passProps={passProps}
                     className={Styles.preview}
                     errors={errors}
                     modalTitle={t('modal.title')}
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

            {page !== 'modal' && <Webhook />}

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
