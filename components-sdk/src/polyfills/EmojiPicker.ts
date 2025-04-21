import { FC } from 'react';
import { EmojiObject, PassProps } from '../utils/componentTypes';

export interface EmojiPickerProps {
    passProps: PassProps;
    onSelect: (emoji: EmojiObject) => any;
}

export type EmojiPicker = FC<EmojiPickerProps>;

/*
export function MenuEmoji({stateKey, stateManager, guild_emojis} : {
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    guild_emojis: any
}) {
    return <EmojiPicker
        guild_emojis={guild_emojis}
        onSelect={(emoji: any) => {
            if (emoji.custom === true) {
                const [name, id] = emoji.short_names[0].split(":");
                stateManager.setKey({key: stateKey, value: {
                    name: name,
                    id: id,
                }});
            } else {
               stateManager.setKey({key: stateKey, value: {
                    name: emoji.native,
                    id: null
               }});
            }
        }}
    />
}

 */
