import { Capsule } from '../src/Capsule';
import { Component, TextDisplayComponent } from '../src/utils/componentTypes';
import { useMemo, useState } from 'react';
import { DummyStateManager } from './StateManager.impl';
import { DummyBetterInput } from './BetterInput.impl';
import { DummyEmojiPicker } from './EmojiPicker.impl';
import { DummyEmojiShow } from './EmojiShow.impl';
import { DummyColorPicker } from './ColorPicker.impl';

function App() {
    const stateManager = useMemo(() => new DummyStateManager(), []);

    const [state, setState] = useState<string | Component[]>([
        {
            type: 10,
            content: 'Never trust a robot with a banana.',
        } as TextDisplayComponent,
    ]);

    const passProps = useMemo(
        () => ({
            getFile: undefined,
            setFile: undefined,
            BetterInput: DummyBetterInput,
            EmojiPicker: DummyEmojiPicker,
            ColorPicker: DummyColorPicker,
            EmojiShow: DummyEmojiShow,
        }),
        []
    );

    const stateKey = useMemo(() => [], []);

    return (
        <div>
            {Array.isArray(state) && (
                <Capsule
                    state={state}
                    key={JSON.stringify(state)}
                    stateManager={stateManager}
                    stateKey={stateKey}
                    passProps={passProps}
                />
            )}
            <textarea
                value={typeof state === 'string' ? state : JSON.stringify(state, undefined, 4)}
                onChange={(ev) => {
                    try {
                        setState(JSON.parse(ev.target.value));
                    } catch (e) {
                        setState(ev.target.value);
                    }
                }}
            />
        </div>
    );
}

export default App;
