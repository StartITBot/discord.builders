import {ComponentsProps} from "../Capsule";
import {FileComponent} from "../utils/componentTypes";
import {useFilePicker} from "use-file-picker";
import Styles from "./File.module.css"
import FileIcon from "../icons/FileIcon.svg"
import { useTranslation } from 'react-i18next';

function sanitizeFilename(input: string) {
  return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[^A-Za-z0-9._-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
}


export function File({state, stateManager, stateKey, passProps} : ComponentsProps & {state: FileComponent}) {

    const { openFilePicker: openFileSelector } = useFilePicker({
        multiple: false,
        readFilesContent: false,
        onFilesSelected: async ({ plainFiles }) => {
            if (!plainFiles) return;
            const link = await passProps.setFile(sanitizeFilename(plainFiles[0].name) || 'file.bin', plainFiles[0]);
            if (link === null) return;
            stateManager.setKey({key: [...stateKey, "file", "url"], value: link})
        },
    });
    const {t} = useTranslation('components-sdk')

    const url = passProps.getFileName(state.file.url);

    return <div onClick={() => openFileSelector()} className={Styles.file}>
        <div className={Styles.file_icon}>
            <img src={FileIcon} width={32} height={32} alt=''/>
        </div>
        <div className={Styles.file_text}>
            {url || t('file.upload-file')}
        </div>
    </div>
}