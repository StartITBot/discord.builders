import { FC } from 'react';
import { EmojiObject, PassProps } from '../utils/componentTypes';

export interface EmojiShowProps {
    passProps: PassProps;
    emoji: EmojiObject;
}

export type EmojiShow = FC<EmojiShowProps>;
