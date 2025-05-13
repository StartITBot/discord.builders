import { Component, stateKeyType, StateManager } from 'components-sdk';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    addKeyType,
    appendKeyType,
    deleteKeyType,
    setKeyType,
    wrapKeyType,
} from 'components-sdk/src/polyfills/StateManager';

const __deleteKeyHelper = (
    state: any,
    key: stateKeyType,
    options?: {
        decoupleFrom?: string;
    }
) => {
    let current: any = state;
    for (let i = 0; i < key.length; i++) {
        if (i !== key.length - 1) {
            current = current[key[i]];
            continue;
        }

        if (options?.decoupleFrom) current.splice(key[i] as number, 1, ...current[key[i]][options.decoupleFrom]);
        else current.splice(key[i] as number, 1);
    }
    return current;
};

const __mutateDeleteKey = (addIndex: number, key: stateKeyType, deleteKey: stateKeyType | null) => {
    if (deleteKey === null) return;

    // console.debug('[ADDKEY] Equality check = ', key, !!deleteKey && deleteKey.slice(0, key.length));
    if (arraysEqual(key, deleteKey.slice(0, key.length))) {
        const deleteIndex = deleteKey[key.length] as number | any;
        // console.debug('[ADDKEY] Index check = ', addIndex, deleteIndex);

        if (typeof deleteIndex === "number" && addIndex <= deleteIndex) {
            deleteKey[key.length] = deleteIndex + 1;
        }
    }
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

export const displaySlice = createSlice({
    name: 'display',
    initialState: () => ({
        data: [] as Component[],
        webhookUrl: localStorage.getItem("discord.builders__webhookToken") || "", // Toolkit run this function so type is string
        webhookResponse: null as object | null,
        messageUrl: localStorage.getItem("discord.builders__messageLink") || "" // Toolkit run this function so type is string
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

        addKey(state, action: PayloadAction<addKeyType<any>>) {
            const key: stateKeyType = action.payload.key;
            const deleteKey: stateKeyType = action.payload.deleteKey ? [...action.payload.deleteKey] : [];
            const deleteKeyParent: stateKeyType | null = action.payload.removeKeyParent ? [...action.payload.removeKeyParent] : null;

            __mutateDeleteKey(action.payload.index, key, deleteKey);
            __mutateDeleteKey(action.payload.index, key, deleteKeyParent);

            // console.debug('[ADDKEY] TO ADD = ', key, action.payload.index, action.payload.value);
            // console.debug('[ADDKEY] TO DELETE = ', deleteKey);

            let current: any = state;

            for (let i = 0; i < key.length; i++) {
                if (i !== key.length - 1) {current = current[key[i]]; continue;}

                if (!current[key[i]]) current[key[i]] = [];
                current[key[i]].splice(action.payload.index, 0, action.payload.value);
            }

            if (deleteKey) {
                current = __deleteKeyHelper(state, deleteKey, {
                    decoupleFrom: action.payload.decoupleFrom
                });
                if (deleteKeyParent !== null && current.length === 0) __deleteKeyHelper(state, deleteKeyParent)
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

        setMessageLink(state, action: PayloadAction<string>) {
            state.messageUrl = action.payload
        },

        setThreadId(state, action: PayloadAction<string>) {
            try {
                const parsed_url = new URL(state.webhookUrl);
                const parsed_query = new URLSearchParams(parsed_url.search);
                if (!action.payload) {
                    parsed_query.delete('thread_id');
                } else {
                    parsed_query.set('thread_id', action.payload);
                }
                parsed_url.search = parsed_query.toString();
                state.webhookUrl = parsed_url.toString();
            } catch (e) {}
        },

        setWebhookResponse(state, action: PayloadAction<object | null>) {
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
        // console.log("deleteKey", props);
    }

    appendKey<T>(props: appendKeyType<T>) {
        this.dispatch(displaySlice.actions.appendKey(props));
        // console.log("appendKey", props);
    }

    addKey<T>(props: addKeyType<T>) {
        this.dispatch(displaySlice.actions.addKey(props));
        // console.log("addKey", props);
    }

    setKey<T>(props: setKeyType<T>) {
        this.dispatch(displaySlice.actions.setKey(props));
        // console.log("setKey", props);
    }

    wrapKey<T>(props: wrapKeyType<T>) {
        this.dispatch(displaySlice.actions.wrapKey(props));
        // console.log("wrapKey", props);
    }
}

