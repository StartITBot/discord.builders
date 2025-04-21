import { useFilePicker } from 'use-file-picker';
import { useEffect, useState } from 'react';
import ThumbnailIcon from '../icons/Thumbnail.svg';
import { stateKeyType, StateManager } from '../polyfills/StateManager';
import { uuidv4 } from './randomGen';
import { SelectedFiles } from 'use-file-picker/types';
import { getFileType, setFileType } from '../polyfills/files';

export function useFileUpload(
    state: string,
    stateKey: stateKeyType,
    getFile: getFileType,
    setFile: setFileType,
    stateManager: StateManager
) {
    const [src, setSrc] = useState(() => state || ThumbnailIcon);

    const { openFilePicker: openFileSelector } = useFilePicker({
        multiple: false,
        accept: ['.png', '.jpg', '.jpeg'],
        readFilesContent: false,
        onFilesSelected: ({ plainFiles }: SelectedFiles<undefined>) => {
            const name = uuidv4();
            const ext = plainFiles[0].type.split('/')[1] || 'bin';
            const link = setFile(`${name}.${ext}`, plainFiles[0]);
            stateManager.setKey({ key: stateKey, value: link });
        },
    });

    useEffect(() => {
        if (!state.startsWith('attachment://')) {
            setSrc(state);
            return;
        }

        const fileName = state.slice(13);
        const objectURL = URL.createObjectURL(getFile(fileName));
        setSrc(objectURL);
        return () => URL.revokeObjectURL(objectURL);
    }, [state]);

    return {
        src,
        setSrc,
        openFileSelector,
    };
}
