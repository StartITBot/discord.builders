import Styles from './FileUpload.module.css';
import { ComponentsProps } from '../Capsule';
import { FileUploadComponent } from '../utils/componentTypesModal';
import { useTranslation } from 'react-i18next';
import CapsuleStyles from '../Capsule.module.css';
import { MenuOption } from './Button';
import { useStateOpen } from '../utils/useStateOpen';
import { Dispatch, SetStateAction, useRef } from 'react';
import Minimum from '../icons/Minimum.svg';
import Maximum from '../icons/Maximum.svg';
import FileUploadIcon from '../icons/FileUpload.svg';
import { MenuRange } from './StringSelect';

export function FileUpload({
    state,
    stateKey,
    stateManager,
    passProps,
}: ComponentsProps & { state: FileUploadComponent }) {
    const { open, setOpen, ignoreRef, closeLockRef } = useStateOpen(0);
    const { t } = useTranslation('components-sdk');
    const btn_select = useRef<HTMLDivElement>(null);

    const min_values = state.min_values ?? 1;
    const max_values = state.max_values ?? 1;
    const isInvalid = min_values > max_values;

    return (
        <div
            className={Styles.upload + (open ? ' ' + Styles.open : '')}
            onClick={(ev) => {
                if (btn_select.current && btn_select.current.contains(ev.target as HTMLElement)) return;
                setOpen(1);
            }}
            ref={ignoreRef}
        >
            <div className={Styles.with_badge}>
                <div className={Styles.icon}>
                    <img src={FileUploadIcon} alt={'File upload icon'} />
                    {max_values > 1 ? t('modal.file-upload.info-multiple') : t('modal.file-upload.info-one')}
                </div>
                <div className={Styles.badge + ' ' + (isInvalid ? Styles.invalid : '')}>
                    {isInvalid && t('string-select.invalid')}{' '}
                    {min_values === max_values ? min_values : `${min_values} – ${max_values}`}
                </div>
            </div>
            {!!open && (
                <div className={CapsuleStyles.large_button_ctx + ' ' + CapsuleStyles.noright} ref={btn_select}>
                    {open === 1 && (
                        <MenuFirst state={state} stateKey={stateKey} stateManager={stateManager} setOpen={setOpen} />
                    )}
                    {open === 2 && (
                        <MenuRange
                            min={0}
                            max={10}
                            state={min_values}
                            stateKey={[...stateKey, 'min_values']}
                            stateManager={stateManager}
                        />
                    )}
                    {open === 3 && (
                        <MenuRange
                            min={1}
                            max={10}
                            state={max_values}
                            stateKey={[...stateKey, 'max_values']}
                            stateManager={stateManager}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function MenuFirst({state, stateKey, stateManager, setOpen} : {
    state: FileUploadComponent,
    stateKey: ComponentsProps['stateKey'],
    stateManager: ComponentsProps['stateManager'],
    setOpen: Dispatch<SetStateAction<number>>,
}) {

    const {t} = useTranslation("components-sdk");

    return <>

        <MenuOption src={Minimum} text={t('modal.file-upload.set-minimum')} onClick={(ev) => {
            setOpen(2);
            ev.stopPropagation();
        }} />

        <MenuOption src={Maximum} text={t('modal.file-upload.set-maximum')} onClick={(ev) => {
            setOpen(3);
            ev.stopPropagation();
        }} />
    </>
}
