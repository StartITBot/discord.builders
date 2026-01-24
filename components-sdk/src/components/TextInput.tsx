import Styles from './TextInput.module.css';
import { ComponentsProps } from '../Capsule';
import { TextInputComponent, TextInputStyle } from '../utils/componentTypesModal';
import { useTranslation } from 'react-i18next';
import CapsuleStyles from '../Capsule.module.css';
import { MenuArea, MenuLabel, MenuOption } from './Button';
import { useStateOpen } from '../utils/useStateOpen';
import { Dispatch, SetStateAction, useRef } from 'react';
import Minimum from '../icons/Minimum.svg';
import Maximum from '../icons/Maximum.svg';
import MinimumActive from '../icons/MinimumActive.svg';
import MaximumActive from '../icons/MaximumActive.svg';
import AddDescription from '../icons/AddDescription.svg';
import AddDescriptionActive from '../icons/AddDescriptionActive.svg';
import DescriptionText from '../icons/DescriptionText.svg';
import DescriptionTextActive from '../icons/DescriptionTextActive.svg';

export function TextInput({ state, stateKey, stateManager }: ComponentsProps & { state: TextInputComponent }) {
    const { open, setOpen, ignoreRef, closeLockRef } = useStateOpen(0);
    const { t } = useTranslation('components-sdk');
    const btn_select = useRef<HTMLDivElement>(null);

    const len = (state.value || '').length;

    return (
        <div
            className={
                Styles.textInput +
                (open ? ' ' + Styles.open : '') +
                (state.style === TextInputStyle.PARAGRAPH ? ' ' + Styles.paragraph : '')
            }
            onClick={(ev) => {
                if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                setOpen(1);
            }}
            ref={ignoreRef}
        >
            <div className={Styles.text}>
                {state.value ? (
                    <>
                        {state.value}
                        <span className={Styles.caret}></span>
                    </>
                ) : (
                    <span className={Styles.desc}>
                        <span className={Styles.caret}></span>
                        {state.placeholder}
                    </span>
                )}
                {!!state.max_length && (
                    <div className={Styles.length}>
                        {len}/{state.max_length}
                    </div>
                )}
            </div>
            {state.value && state.placeholder && (
                <div className={Styles.placeholder}>
                    {t('modal.text-input.placeholder-info')} {state.placeholder}
                </div>
            )}
            {!!state.min_length && (
                <div className={Styles.placeholder}>
                    {t('modal.text-input.minimum-len-info')} {state.min_length}
                </div>
            )}
            {!!open && (
                <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                    {open === 1 && (
                        <MenuFirst state={state} stateKey={stateKey} stateManager={stateManager} setOpen={setOpen} />
                    )}
                    {open === 2 && (
                        <MenuArea
                            closeLockRef={closeLockRef}
                            state={state.value ?? ''}
                            stateKey={[...stateKey, 'value']}
                            stateManager={stateManager}
                            setOpen={setOpen}
                            max={4000}
                        />
                    )}
                    {open === 3 && (
                        <MenuLabel
                            closeLockRef={closeLockRef}
                            state={state.placeholder ?? ''}
                            stateKey={[...stateKey, 'placeholder']}
                            stateManager={stateManager}
                            setOpen={setOpen}
                            max={200}
                        />
                    )}
                    {open === 4 && (
                        <MenuLabel
                            closeLockRef={closeLockRef}
                            state={state.min_length ?? null}
                            stateKey={[...stateKey, 'min_length']}
                            min={0}
                            max={4000}
                            nullable={true}
                            number={true}
                            stateManager={stateManager}
                            setOpen={setOpen}
                        />
                    )}
                    {open === 5 && (
                        <MenuLabel
                            closeLockRef={closeLockRef}
                            state={state.max_length ?? null}
                            stateKey={[...stateKey, 'max_length']}
                            min={1}
                            max={4000}
                            nullable={true}
                            number={true}
                            stateManager={stateManager}
                            setOpen={setOpen}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function MenuFirst({state, stateKey, stateManager, setOpen} : {
    state: TextInputComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
}) {

    const {t} = useTranslation("components-sdk");

    return <>

        <MenuOption src={DescriptionText} text={state.value ? t('modal.text-input.change-value') : t('modal.text-input.add-value')} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }} />

        {!!state.value && <MenuOption src={DescriptionTextActive} text={t('modal.text-input.clear-value')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "value"], value: null})
        }} />}

        <MenuOption src={AddDescription} text={state.placeholder ? t('modal.text-input.change-placeholder') : t('modal.text-input.add-placeholder')} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }} />

        {!!state.placeholder && <MenuOption src={AddDescriptionActive} text={t('modal.text-input.clear-placeholder')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "placeholder"], value: null})
        }} />}

        <MenuOption src={Minimum} text={state.min_length ? t('modal.text-input.change-minimum') : t('modal.text-input.set-minimum')} onClick={(ev) => {
            setOpen(4);
            ev.stopPropagation();
        }} />

        {!!state.min_length && <MenuOption src={MinimumActive} text={t('modal.text-input.clear-minimum')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "min_length"], value: null})
        }} />}

        <MenuOption src={Maximum} text={state.max_length ? t('modal.text-input.change-maximum') : t('modal.text-input.set-maximum')} onClick={(ev) => {
            setOpen(5);
            ev.stopPropagation();
        }} />

        {!!state.max_length && <MenuOption src={MaximumActive} text={t('modal.text-input.clear-maximum')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "max_length"], value: null})
        }} />}
    </>
}
