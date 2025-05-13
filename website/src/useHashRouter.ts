import { useEffect, useRef } from 'react';
import { actions, RootState } from './state';
import { useDispatch, useSelector } from 'react-redux';
import { webhookImplementation } from './webhook.impl';

async function encodeState(state: any): Promise<string> {
    const stream = new Blob([JSON.stringify(state)], {
        type: 'application/json',
    }).stream();
    const compressedReadableStream = stream.pipeThrough(new CompressionStream('gzip'));

    const buffer = await new Response(compressedReadableStream).arrayBuffer();

    return btoa(
        new Uint8Array(buffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

async function decodeState(data: string) {
    const buffer =  new Uint8Array([...atob(data)].map(c => c.charCodeAt(0)));
    const stream = new Blob([buffer], {
        type: "application/json",
    }).stream();

    const decompressedStream = stream.pipeThrough( new DecompressionStream("gzip"));
    const blob = await new Response(decompressedStream).blob();
    return JSON.parse(await blob.text());
}

export function useHashRouter() {
    const dispatch = useDispatch();
    const currentHash = useRef<string | null>(null);
    const state = useSelector((state: RootState) => state.display.data)

    useEffect(() => {
        webhookImplementation.clean(state);
        if (currentHash === null) {
            // ignore state changes, it should be loaded from URL first
            return;
        }

        const getData = setTimeout(() => {
            if (state.length == 0) {
                currentHash.current = "";
                document.location.hash = "";
                return;
            }

            encodeState(state).then( (value) => {
                currentHash.current = value;  // infinite loop resolver
                document.location.hash = value;
            });
        }, 600)

        return () => clearTimeout(getData)
    }, [state]);

    useEffect(() => {
        const handleChange = (event: {newURL: string}) => {
            const newHash = new URL(event.newURL).hash.substring(1);
            if (newHash === currentHash.current) return;
            console.log("Loaded state from URL");

            if (atob(newHash).startsWith(encodeURIComponent("["))) {
                // Old deserialization logic (raw JSON)
                console.log("Deserializing old payload")
                const value = JSON.parse(decodeURIComponent(atob(newHash)));
                dispatch(actions.setKey({key: ['data'], value}))
                currentHash.current = event.newURL.substring(1);
            } else {
                // New deserialization logic (gzip compression)
                console.log("Deserializing new payload")
                decodeState(newHash).then( (value) => {
                    dispatch(actions.setKey({key: ['data'], value}))
                    currentHash.current = event.newURL.substring(1);
                });
            }
        };

        handleChange({newURL: window.location.toString()})
        window.addEventListener('hashchange', handleChange);
        return () => window.removeEventListener('hashchange', handleChange);
    }, [])
}