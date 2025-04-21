import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export function useStateOpen<T>(defaultValue: T): {
    open: T;
    setOpen: Dispatch<SetStateAction<T>>;
    ignoreRef: MutableRefObject<HTMLDivElement | null>;
    closeLockRef: MutableRefObject<any>;
} {
    const [open, setOpen] = useState(defaultValue);
    const ignoreRef = useRef<HTMLDivElement>(null);
    const closeLockRef = useRef<HTMLDivElement>(null);

    const documentClick = useCallback(
        (ev: MouseEvent) => {
            if (ignoreRef.current && ignoreRef.current.contains(ev.target as HTMLElement)) return;
            if (closeLockRef.current) return; // if there is any input you cannot close manually
            setOpen(defaultValue);
        },
        [ignoreRef.current]
    );

    const documentKeyDown = useCallback((ev: KeyboardEvent) => {
        if (ev.key == 'Enter' || ev.key == 'Escape') {
            setOpen(defaultValue);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', documentClick);
        document.addEventListener('keydown', documentKeyDown);
        return () => {
            document.removeEventListener('mousedown', documentClick);
            document.removeEventListener('keydown', documentKeyDown);
        };
    }, []);

    return { open, setOpen, ignoreRef, closeLockRef };
}
