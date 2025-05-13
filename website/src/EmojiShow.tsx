import {EmojiShow as EmojiShowType} from "components-sdk";
import {useCallback} from "react";
import {Emoji, getEmojiDataFromNative} from "emoji-mart";
import data from "emoji-mart/data/twitter.json";

export const EmojiShow: EmojiShowType = ({emoji}) => {
    const getEmojiData = useCallback((emoji: any) => {
        return getEmojiDataFromNative(emoji, 'twitter', data)
    }, [])

    if (typeof(emoji) == "undefined"){
        return null
    }
    else {
        if (emoji.id !== null && typeof(emoji.id) !== "undefined") return <img alt={`Discord emoji${emoji.name}`}
            src={`https://cdn.discordapp.com/emojis/${emoji.id}`}
            width={19}
            height={19}
        />

        return <Emoji
            set={'twitter'}
            emoji={getEmojiData(emoji.name)}
            size={19}
        />
    }
}
