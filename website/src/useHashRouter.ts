import { useEffect, useRef } from 'react';
import { actions, RootState } from './state';
import { useDispatch, useSelector } from 'react-redux';
import { webhookImplementation } from './webhook.impl';

async function encodeState(state: any): Promise<string> {
    try {
        const cs = new CompressionStream("gzip");
        const writer = cs.writable.getWriter();
        writer.write(new TextEncoder().encode(JSON.stringify(state)));
        writer.close();
        const data = await new Response(cs.readable).bytes();

        let binary = '';
        for (let b of data) binary += String.fromCharCode(b);
        return '1$' + btoa(binary);
    } catch (e) {
        console.error('Failed to encode compressed state to URL', e);
        return btoa(encodeURIComponent(JSON.stringify(state)));
    }
}

async function decodeState(data: string) {
    try {
        const cs = new DecompressionStream("gzip");
        const writer = cs.writable.getWriter();
        writer.write(Uint8Array.from(atob(data.slice(2)), c => c.charCodeAt(0)));
        writer.close();
        const state = await new Response(cs.readable).text();
        return JSON.parse(state);
    } catch (e) {
        console.error('Failed to decode compressed state from URL', e);
        return [];
    }
}

async function decodeStateOld(data: string) {
    try {
        return JSON.parse(decodeURIComponent(atob(data)));
    } catch (e) {
        console.error('Failed to decode raw state from URL', e);
        return [];
    }
}

export function useHashRouter() {
    const dispatch = useDispatch();
    const currentHash = useRef<string | null>(null);
    const state = useSelector((state: RootState) => state.display.data);

    const isDefault = useSelector((state: RootState) => state.display.isDefault);

    useEffect(() => {
        webhookImplementation.clean(state);
        if (currentHash === null) {
            // ignore state changes, it should be loaded from URL first
            return;
        }

        const getData = setTimeout(async () => {
            const value = await encodeState(state);
            currentHash.current = value; // infinite loop resolver
            if (!isDefault) document.location.hash = value;
        }, 600)

        return () => clearTimeout(getData)
    }, [state]);

    useEffect(() => {
        const handleChange = (event: { newURL: string }) => {
            const newHash = new URL(event.newURL).hash.substring(1);
            if (newHash === currentHash.current) return;
            if (newHash === '') return;

            console.log('Loaded state from URL');

            const f = newHash.startsWith('1$') ? decodeState : decodeStateOld;

            f(newHash).then((value) => {
                dispatch(actions.setKey({key: ['data'], value}))
                currentHash.current = event.newURL.substring(1);
            });
        };

        handleChange({ newURL: window.location.toString() });
        window.addEventListener('hashchange', handleChange);
        return () => window.removeEventListener('hashchange', handleChange);
    }, []);
}
