export declare global {
    interface Window {
        uploadedFiles: {
            [name: string]: File;
        };
    }
}
