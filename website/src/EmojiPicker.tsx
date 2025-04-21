import { EmojiPicker as EmojiPickerType } from 'components-sdk';

import { Picker } from 'emoji-mart';

const notFound = () => (
    <div className="emoji-mart-no-results">
        <span className="emoji-mart-emoji">
            <span
                style={{
                    width: 38,
                    height: 38,
                    display: 'inline-block',
                    backgroundImage: 'url("https://cdn.discordapp.com/emojis/811160357682675792.png?size=64")',
                    backgroundSize: 'contain',
                }}
            />
        </span>
        <div className="emoji-mart-no-results-label">No Emoji Found</div>
    </div>
);

export const EmojiPicker: EmojiPickerType = ({ onSelect }) => {
    return (
        // @ts-ignore probably react version and emoji-mart don't match
        <div className={'emoji-picker'}>
            <Picker
                // @ts-ignore it requires Class-component, but function works well
                notFound={notFound}
                theme="dark"
                set="twitter"
                title="Pick your emoji…"
                perLine={8}
                color={'#86c232'}
                emoji={'point_up'}
                autoFocus={true}
                emojiSize={24}
                defaultSkin={1}
                native={false}
                sheetSize={64}
                showPreview={true}
                showSkinTones={true}
                emojiTooltip={false}
                useButton={true}
                enableFrequentEmojiSort={false}
                onSelect={(emoji: any) => {
                    if (emoji.custom === true) {
                        const [name, id] = emoji.short_names[0].split(':');
                        onSelect({
                            name: name,
                            id: id,
                        });
                    } else {
                        onSelect({
                            name: emoji.native,
                            id: null,
                        });
                    }
                }}
            />
        </div>
    );
};
