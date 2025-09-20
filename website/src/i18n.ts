import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { BackendModule } from 'i18next'
import { ComponentsSdkBackend } from 'components-sdk';
import { supportedLngs } from '../libs.config';

const Backend: BackendModule = {
    type: 'backend',
    init(services, backendOptions, i18nextOptions) {},
    read(language, namespace, callback) {
        console.log(`Loading i18n resources for language: ${language}, namespace: ${namespace}`);
        if (namespace === 'components-sdk') return ComponentsSdkBackend.read(language, namespace, callback);
        if (namespace !== 'website') return;

        import(`./locales/${language}.json`)
            .then((resources) => {
                callback(null, resources.default);
            })
            .catch((error) => {
                console.error(
                    `Error loading i18n resources for language: ${language}, namespace: ${namespace}`,
                    error
                );
                callback(error, null);
            });
    },
}

i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        ns: ['website', 'components-sdk'],
        defaultNS: 'website',
        supportedLngs: supportedLngs,

        detection: {
            caches: ['cookie'],
            order: ['path', 'cookie', 'navigator'],
            lookupCookie: 'lang',
            lookupQuerystring: 'lang',
        },
        react: {
            useSuspense: false,
        },

        fallbackLng: 'en',
        lowerCaseLng: true,
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',

        keySeparator: false, // we do not use keys in form aaaa.bbbb

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

i18next.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('lang', lng);
});
