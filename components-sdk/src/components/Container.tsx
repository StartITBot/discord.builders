import Styles from './Container.module.css';
import { CapsuleInner } from '../CapsuleInner';
import ColorIcon from '../icons/Color.svg';
import SpoilerIcon from '../icons/Spoiler.svg';
import CapsuleStyles from '../Capsule.module.css';
import ColorActiveIcon from '../icons/ColorActive.svg';
import SpoilerActiveIcon from '../icons/SpoilerActive.svg';
import { ChromePicker } from 'react-color';
import { ComponentsProps } from '../Capsule';
import { ContainerComponent } from '../utils/componentTypes';
import { useStateOpen } from '../utils/useStateOpen';

export function Container({
    state,
    stateKey,
    stateManager,
    passProps,
}: ComponentsProps & { state: ContainerComponent }) {
    const hasColor = state.accent_color !== null;
    const colorHex =
        '#' +
        Number(state.accent_color || 0)
            .toString(16)
            .padStart(6, '0');
    const { open: pickerOpen, setOpen: setPickerOpen, ignoreRef: picker } = useStateOpen(false);

    return (
        <div className={Styles.embed + ' ' + (state.spoiler ? Styles.spoiler : '')}>
            {hasColor && <div className={Styles.bar} style={{ backgroundColor: colorHex }} />}

            <CapsuleInner
                state={state?.components || []}
                stateKey={[...stateKey, 'components']}
                stateManager={stateManager}
                showSectionButton={true}
                removeKeyParent={stateKey}
                buttonContext={'container'}
                // buttonClassName={CapsuleStyles.inline}
                passProps={passProps}
            />
            <div className={CapsuleStyles.large_button + ' ' + CapsuleStyles.small} onClick={() => setPickerOpen(true)}>
                {pickerOpen && (
                    <div className={CapsuleStyles.large_button_ctx} ref={picker}>
                        <ChromePicker
                            color={colorHex}
                            onChange={(ev: any) => {
                                stateManager.setKey({
                                    key: [...stateKey, 'accent_color'],
                                    value: parseInt(ev.hex.replace('#', ''), 16) || null,
                                });
                            }}
                            disableAlpha={true}
                        />
                    </div>
                )}
                <img className={CapsuleStyles.large_button_icon} src={hasColor ? ColorActiveIcon : ColorIcon} alt="" />
            </div>

            <div
                className={CapsuleStyles.large_button + ' ' + CapsuleStyles.small}
                onClick={() =>
                    stateManager.setKey({
                        key: [...stateKey, 'spoiler'],
                        value: !state.spoiler,
                    })
                }
            >
                <img
                    className={CapsuleStyles.large_button_icon}
                    src={state.spoiler ? SpoilerActiveIcon : SpoilerIcon}
                    alt=""
                />
            </div>
        </div>
    );
}
