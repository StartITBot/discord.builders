import Styles from './Container.module.css';
import { CapsuleInner } from '../CapsuleInner';
import ColorIcon from '../icons/Color.svg';
import SpoilerIcon from '../icons/Spoiler.svg';
import CapsuleStyles from '../Capsule.module.css';
import ColorActiveIcon from '../icons/ColorActive.svg';
import SpoilerActiveIcon from '../icons/SpoilerActive.svg';
import { ComponentsProps } from '../Capsule';
import { ContainerComponent } from '../utils/componentTypes';
import { useStateOpen } from '../utils/useStateOpen';
import { DroppableID } from '../dnd/components';
import { useMemo } from 'react';
import { flattenErrorsWithoutComponents, hasErrorsWithoutComponents } from '../errors';

export function Container({
    state,
    stateKey,
    stateManager,
    passProps,
    errors
}: ComponentsProps & { state: ContainerComponent }) {
    const ColorPicker = passProps.ColorPicker;

    const hasColor = state.accent_color !== null;
    const colorHex =
        '#' +
        Number(state.accent_color || 0)
            .toString(16)
            .padStart(6, '0');
    const { open: pickerOpen, setOpen: setPickerOpen, ignoreRef: picker } = useStateOpen(false);
    const stateKeyComponents = useMemo(() => [...stateKey, 'components'], [...stateKey]);

    const hasErrors = errors ? hasErrorsWithoutComponents(errors) : false;

    return (
        <div className={Styles.embed + ' ' + (state.spoiler ? Styles.spoiler : '')}>
            {hasColor && <div className={Styles.bar} style={{ backgroundColor: colorHex }} />}

            <CapsuleInner
                state={state?.components || []}
                stateKey={stateKeyComponents}
                stateManager={stateManager}
                showSectionButton={true}
                removeKeyParent={stateKey}
                buttonContext={'container'}
                droppableId={DroppableID.CONTAINER}
                // buttonClassName={CapsuleStyles.inline}
                passProps={passProps}
                errors={errors ? errors.components : null}
            />
            <div className={CapsuleStyles.large_button + ' ' + CapsuleStyles.small} onClick={() => setPickerOpen(true)}>
                {pickerOpen && (
                    <div className={CapsuleStyles.large_button_ctx} ref={picker}>
                        <ColorPicker
                            hexColor={colorHex}
                            onChange={(value: number | null) => {
                                stateManager.setKey({
                                    key: [...stateKey, 'accent_color'],
                                    value: value,
                                });
                            }}
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

            <div>
                {hasErrors && flattenErrorsWithoutComponents(errors!).map((error, i) => <div key={i} className={CapsuleStyles.error}><b>Error:</b> {error}</div>)}
            </div>
        </div>
    );
}