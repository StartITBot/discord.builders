import { useEffect, useRef } from 'react';
import { actions, RootState } from './state';
import { useDispatch, useSelector } from 'react-redux';
import { webhookImplementation } from './webhook.impl';

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
            const value = btoa(encodeURIComponent(JSON.stringify(state)));
            currentHash.current = value;  // infinite loop resolver
            document.location.hash = value;
        }, 600)

        return () => clearTimeout(getData)
    }, [state]);

    useEffect(() => {
        const handleChange = (event: {newURL: string}) => {
            const newHash = new URL(event.newURL).hash.substring(1);
            if (newHash === currentHash.current) return;
            console.log("Loaded state from URL");

            let value;
            try {
                value = JSON.parse(decodeURIComponent(atob(newHash)));
            } catch (e) {
                value = [];
            }

            dispatch(actions.setKey({key: ['data'], value}))
            currentHash.current = event.newURL.substring(1);
        };

        handleChange({newURL: window.location.toString()})
        window.addEventListener('hashchange', handleChange);
        return () => window.removeEventListener('hashchange', handleChange);
    }, [])
}