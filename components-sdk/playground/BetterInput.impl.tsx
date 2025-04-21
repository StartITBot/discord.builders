import { BetterInput } from '../src/polyfills/BetterInput';

export const DummyBetterInput: BetterInput = ({ onChange, value }) => {
    return (
        <textarea
            // @ts-ignore this attribute works, and is used by CSS
            type={'text'}
            rows={1}
            maxLength={2000}
            onChange={onChange}
            value={value}
        />
    );
};
