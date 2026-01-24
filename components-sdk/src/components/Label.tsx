import Styles from './Label.module.css';
import { COMPONENTS, ComponentsProps } from '../Capsule';
import { LabelComponent, LabelPossible, MODAL_SUPPORTS_REQUIRED } from '../utils/componentTypesModal';
import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CapsuleStyles from '../Capsule.module.css';
import { MenuLabel, MenuOption } from './Button';
import { useStateOpen } from '../utils/useStateOpen';
import DescriptionText from '../icons/DescriptionText.svg';
import DescriptionTextActive from '../icons/DescriptionTextActive.svg';
import DescriptionPen from '../icons/DescriptionPen.svg';
import RequiredActive from '../icons/RequiredActive.svg';
import Required from '../icons/Required.svg';

export function Label({
    state,
    stateKey,
    stateManager,
    passProps,
    actionCallback,
}: ComponentsProps & { state: LabelComponent<LabelPossible> }) {
    const Child = COMPONENTS[state.component.type];
    if (typeof Child === 'undefined') return null;
    const btn_select = useRef<HTMLDivElement>(null);
    const { open, setOpen, ignoreRef, closeLockRef } = useStateOpen(0);
    const stateKeyChild = useMemo(() => [...stateKey, 'component'], [...stateKey]);

    return (
        <div className={Styles.label}>
            <div
                className={Styles.label_text + (open ? ' ' + Styles.open : '')}
                onClick={(ev) => {
                    if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                    setOpen(1);
                }}
                ref={ignoreRef}
            >
                <div className={Styles.header}>
                    {state.label}
                    {(state.component.required ?? true) && <span className={Styles.required}>*</span>}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className={Styles.description}>{state.description}</div>
                {!!open && (
                    <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                        {open === 1 && (
                            <MenuFirst
                                state={state}
                                stateKey={stateKey}
                                stateManager={stateManager}
                                setOpen={setOpen}
                            />
                        )}
                        {open === 2 && (
                            <MenuLabel
                                closeLockRef={closeLockRef}
                                state={state.label || ''}
                                stateKey={[...stateKey, 'label']}
                                stateManager={stateManager}
                                setOpen={setOpen}
                                max={45}
                            />
                        )}
                        {open === 3 && (
                            <MenuLabel
                                closeLockRef={closeLockRef}
                                state={state.description || ''}
                                stateKey={[...stateKey, 'description']}
                                stateManager={stateManager}
                                setOpen={setOpen}
                                max={100}
                            />
                        )}
                    </div>
                )}
            </div>
            <Child
                state={state.component}
                stateKey={stateKeyChild}
                stateManager={stateManager}
                passProps={passProps}
                actionCallback={actionCallback}
                removeKeyParent={stateKey}
                fromLabel={true}
            />
        </div>
    );
}



function MenuFirst({state, stateKey, stateManager, setOpen} : {
    state: LabelComponent<LabelPossible>,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
}) {

    const {t} = useTranslation("components-sdk");

    const requireable = MODAL_SUPPORTS_REQUIRED.includes(state.component.type);
    const req = state.component.required ?? true;

    return <>
        <MenuOption src={DescriptionPen} text={t('modal.label.change-label')} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }} />

        <MenuOption src={DescriptionText} text={state.description == null ? t('modal.label.add-description') : t('modal.label.change-description')} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }} />
        {state.description != null && <MenuOption src={DescriptionTextActive} text={t('modal.label.clear-description')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "description"], value: null})
        }} />}

        {requireable && <MenuOption src={req ? RequiredActive : Required} text={req ? t('modal.label.unset-required') : t('modal.label.set-required')} onClick={() => {
            stateManager.setKey({key: [...stateKey, "component", "required"], value: !req})
        }} />}
    </>
}
