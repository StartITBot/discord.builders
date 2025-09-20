import { BackendModule } from 'i18next';

export const ComponentsSdkBackend: BackendModule = {
    type: 'backend',
    init(services, backendOptions, i18nextOptions) {},
    read(language, namespace, callback) {
        if (namespace !== 'components-sdk') return;

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