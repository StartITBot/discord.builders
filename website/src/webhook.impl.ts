import {
    Component,
    ComponentType,
    ContainerComponent,
    FileComponent,
    getFileType,
    MediaGalleryComponent,
    SectionComponent,
    setFileType,
} from 'components-sdk';

export const webhookImplementation = {
    getFile: ((name) => {
        return window.uploadedFiles[name];
    }) as getFileType,

    setFile: ((name, file) => {
        window.uploadedFiles[name] = file;
        return `attachment://${name}`;
    }) as setFileType,

    scrapFiles(data: Component | Component[]): string[] {
        if (Array.isArray(data)) return data.flatMap((obj) => this.scrapFiles(obj));

        if (data.type === ComponentType.SECTION) {
            const dataAsSection = data as SectionComponent;
            if (dataAsSection.accessory.type !== ComponentType.THUMBNAIL) return [];

            const url = dataAsSection.accessory.media.url;
            if (url.startsWith('attachment://')) return [url.slice(13)];
        } else if (data.type === ComponentType.FILE) {
            const dataAsSection = data as FileComponent;

            const url = dataAsSection.file.url;
            if (url.startsWith('attachment://')) return [url.slice(13)];
        } else if (data.type === ComponentType.MEDIA_GALLERY) {
            const dataAsGallery = data as MediaGalleryComponent;

            return dataAsGallery.items
                .filter((item) => item.media.url.startsWith('attachment://'))
                .map((item) => item.media.url.slice(13));
        } else if (data.type === ComponentType.CONTAINER) {
            const dataAsContainer = data as ContainerComponent;
            return this.scrapFiles(dataAsContainer.components);
        }
        return [];
    },

    init() {
        if (!window.uploadedFiles) window.uploadedFiles = {};
    },

    clean(state: Component[]) {
        const files = this.scrapFiles(state);
        for (const file of Object.keys(window.uploadedFiles)) {
            if (!files.includes(file)) delete window.uploadedFiles[file];
        }
    },

    prepareRequest(state: Component[]): RequestInit {
        const files = this.scrapFiles(state);

        const data = JSON.stringify({
            components: state,
            flags: 32768,
        });

        if (!files.length) return { method: 'POST', body: data, headers: { 'Content-Type': 'application/json' } };

        const form = new FormData();
        form.append('payload_json', data);
        files.map((filename, idx) => {
            const blob = window.uploadedFiles[filename];
            form.append(`files[${idx}]`, blob, filename);
        });
        return { method: 'POST', body: form, headers: {} };
    },
};
