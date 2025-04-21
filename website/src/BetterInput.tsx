import { BetterInput as BetterInputType } from 'components-sdk';
import TextareaAutosize from 'react-textarea-autosize';

export const BetterInput: BetterInputType = ({ onChange, value }) => {
    return (
        <TextareaAutosize
            // @ts-ignore this attribute works, and is used by CSS
            type={'text'}
            rows={1}
            maxLength={2000}
            onChange={onChange}
            value={value}
        />
    );
};
