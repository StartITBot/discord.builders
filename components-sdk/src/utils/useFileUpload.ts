import {useFilePicker} from "use-file-picker";
import {useEffect, useState} from "react";
import ThumbnailIcon from "../icons/Thumbnail.svg";
import {stateKeyType, StateManager} from "../polyfills/StateManager";
import {uuidv4} from "./randomGen";
import {getFileType, setFileType} from "../polyfills/files";

let N = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/quicktime", "video/mp4", "video/webm"];
// Extensions: ['.png', '.jpg', '.jpeg', '.jfif', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov']

export function useFileUpload(
    state: string,
    stateKey: stateKeyType,
    getFile: getFileType,
    setFile: setFileType,
    stateManager: StateManager,
    videoSupport: boolean
) {
    const [src, setSrc] = useState(() => state || ThumbnailIcon);
    const [isVideo, setIsVideo] = useState<boolean | null>(null);

    const { openFilePicker: openFileSelector } = useFilePicker({
        multiple: false,
        accept: videoSupport ? N : N.filter(t => !t.startsWith("video/")).join(','),
        readFilesContent: false,
        onFilesSelected: async ({ plainFiles }) => {
            if (!plainFiles) return;
            const name = uuidv4();
            const ext = plainFiles[0].type.split('/')[1] || 'bin';
            const link = await setFile(`${name}.${ext}`, plainFiles[0]);
            if (link === null) return;
            stateManager.setKey({key: stateKey, value: link})
        },
    });

    useEffect(() => {
        if (!state.startsWith("attachment://")) {
            setIsVideo(state.includes(".mp4") || state.includes(".webm") || state.includes(".mov"));
            setSrc(state);
            return;
        }

        const fileName = state.slice(13);
        try {
            const file = getFile(fileName);
            if (file == null || !N.includes(file.type)) {
                console.error("File not found or unsupported type:", fileName, file?.type);
                setSrc(ThumbnailIcon);
                setIsVideo(null);
                return;
            }

            const objectURL = URL.createObjectURL(file);
            setSrc(objectURL);
            setIsVideo(file.type.startsWith("video/"));
            return () => URL.revokeObjectURL(objectURL)
        } catch (e) {
            console.error(e);
            setSrc(ThumbnailIcon);
            setIsVideo(null);
        }

    }, [state]);

    return {
        src, setSrc, openFileSelector, isVideo
    }

}
