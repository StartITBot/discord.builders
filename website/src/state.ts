import {Component, stateKeyType, StateManager} from "components-sdk";
import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'

type wrapKeyType<T> = { key: stateKeyType; toArray: boolean; innerKey: string; value: T; };
type setKeyType<T> = { key: stateKeyType; value: T; };
type appendKeyType<T> = { key: stateKeyType; value: T; };
type deleteKeyType = {
    key: stateKeyType;
    decoupleFrom?: string | undefined;
    removeKeyParent?: stateKeyType | undefined;
};

const __deleteKeyHelper = (state: any, key: stateKeyType) => {
    let current: any = state;
    for (let i = 0; i < key.length; i++) {
        if (i !== key.length - 1) {
            current = current[key[i]];
            continue;
        }
       current.splice(key[i], 1);
    }
}

export const displaySlice = createSlice({
    name: 'display',
    initialState: () => ({
        data: [] as Component[],
        webhookUrl: localStorage.getItem("discord.builders__webhookToken") || "", // Toolkit run this function so type is string
        webhookResponse: null as object | null
    }),
    reducers: {
        wrapKey(state, action: PayloadAction<wrapKeyType<any>>) {
            const key = action.payload.key;
            let current: any = state;
            for (let i = 0; i < key.length; i++) {
                if (i !== key.length - 1) {
                    current = current[key[i]];
                    continue;
                }

                current[key[i]] = {
                    ...action.payload.value,
                    [action.payload.innerKey]: action.payload.toArray ? [current[key[i]]] : current[key[i]]
                }
            }
        },

        setKey(state, action: PayloadAction<setKeyType<any>>) {
            const key = action.payload.key;
            let current: any = state;
            for (let i = 0; i < key.length; i++) {
                if (i === key.length - 1) {
                    current[key[i]] = action.payload.value;
                } else {
                    if (typeof current[key[i]] === "undefined") current[key[i]] = typeof key[i + 1] === "number" ? [] : {};
                    current = current[key[i]];
                }
            }
        },

        appendKey(state, action: PayloadAction<appendKeyType<any>>) {
            const key = action.payload.key;
            let current: any = state;
            for (let i = 0; i < key.length; i++) {
                if (i === key.length - 1) {
                    if (!current[key[i]]) current[key[i]] = [];
                    current[key[i]].push(action.payload.value);
                    current[key[i]].length - 1;
                    return
                } else {
                    current = current[key[i]];
                }
            }
        },

        deleteKey(state, action: PayloadAction<deleteKeyType>) {
            const key = action.payload.key;
            let current: any = state;
            for (let i = 0; i < key.length; i++) {
                if (i !== key.length - 1) {
                    current = current[key[i]];
                    continue;
                }

                if (Array.isArray(current)) {
                    const key_i = key[i] as number;
                    if (action.payload.decoupleFrom) current.splice(key_i, 1, ...current[key_i][action.payload.decoupleFrom]);
                    else current.splice(key_i, 1)
                    if (action.payload.removeKeyParent && current.length === 0) __deleteKeyHelper(state, action.payload.removeKeyParent)
                } else
                    delete current[key[i]];
            }
        },

        setWebhookUrl(state, action: PayloadAction<string>) {
            state.webhookUrl = action.payload
        },

        setWebhookResponse(state, action: PayloadAction<object>) {
            state.webhookResponse = action.payload
        }
    }
})
export const actions = displaySlice.actions;

export const store = configureStore({
    reducer: {
        display: displaySlice.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export class DisplaySliceManager implements StateManager {
    private readonly dispatch: AppDispatch;

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
        // it's possible to create variable for slice so many slices are available
    }

    deleteKey(props: deleteKeyType) {
        this.dispatch(displaySlice.actions.deleteKey(props));
        console.log("deleteKey", props);
    }

    appendKey<T>(props: appendKeyType<T>) {
        this.dispatch(displaySlice.actions.appendKey(props));
        console.log("appendKey", props);
    }

    setKey<T>(props: setKeyType<T>) {
        this.dispatch(displaySlice.actions.setKey(props));
        console.log("setKey", props);
    }

    wrapKey<T>(props: wrapKeyType<T>) {
        this.dispatch(displaySlice.actions.wrapKey(props));
        console.log("wrapKey", props);
    }
}

