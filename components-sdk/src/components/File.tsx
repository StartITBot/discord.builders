import { ComponentsProps } from '../Capsule';
import { FileComponent } from '../utils/componentTypes';
import { useFilePicker } from 'use-file-picker';
import { SelectedFiles } from 'use-file-picker/types';
import Styles from './File.module.css';
import FileIcon from '../icons/FileIcon.svg';

function sanitizeFilename(input: string) {
    return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/[^A-Za-z0-9._-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
}

export function File({ state, stateManager, stateKey, passProps }: ComponentsProps & { state: FileComponent }) {
    const { openFilePicker: openFileSelector } = useFilePicker({
        multiple: false,
        accept: ['.png', '.jpg', '.jpeg'],
        readFilesContent: false,
        onFilesSelected: ({ plainFiles }: SelectedFiles<undefined>) => {
            const link = passProps.setFile(sanitizeFilename(plainFiles[0].name) || 'file.bin', plainFiles[0]);
            stateManager.setKey({ key: [...stateKey, 'file', 'url'], value: link });
        },
    });

    const url = state.file.url.startsWith('attachment://') ? state.file.url.slice(13) : '';

    return (
        <div onClick={() => openFileSelector()} className={Styles.file}>
            <div className={Styles.file_icon}>
                <img src={FileIcon} width={32} height={32} alt="" />
            </div>
            <div className={Styles.file_text}>{url || 'Click to upload file'}</div>
        </div>
    );
}
