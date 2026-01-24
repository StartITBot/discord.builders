import { ComponentType, ComponentTypeUnofficial, parseComponent, TextDisplayComponent } from '../utils/componentTypes';
import { LabelComponent, LabelPossible, parseModalComponent } from '../utils/componentTypesModal';
import { generateRandomAnimal, uuidv4 } from '../utils/randomGen';
import { DroppableID, isOfficialComponent, isStringSelectComponentOption, randomizeIds } from './components';

function labelize(comp: object) {
    return {
        type: ComponentType.LABEL,
        label: generateRandomAnimal(),
        component: comp,
    } as LabelComponent<LabelPossible>;
}

export function getValidModalObj(comp_: object, droppableId: DroppableID, randomizeId: boolean) {
    const comp = randomizeId ? randomizeIds(comp_) : comp_;

    const isOfficial = isOfficialComponent(comp);
    const isStringOption = isStringSelectComponentOption(comp);

    if (isStringOption) {
        if (droppableId === DroppableID.STRING_SELECT)
            return parseModalComponent[ComponentTypeUnofficial.STRING_SELECT_OPTION](comp) ?? null;

        return parseModalComponent[ComponentType.LABEL](labelize({
            type: ComponentType.STRING_SELECT,
            custom_id: uuidv4(),
            options: [comp]
        })) ?? null;
    }

    if (!isOfficial) return null;

    // Are top-level components are labels

    // Select compatibility with chat components
    if (comp.type === ComponentType.ACTION_ROW) {
        const actionRow = parseComponent[ComponentType.ACTION_ROW](comp);
        if (actionRow !== null && actionRow.components.length === 1 && actionRow.components[0].type === ComponentType.STRING_SELECT) {
            return parseModalComponent[ComponentType.LABEL](labelize(actionRow.components[0]));
        }
        return null;
    }

    // Compatibility: convert sections to text displays
    if (comp.type === ComponentType.SECTION) {
        const sec = parseComponent[ComponentType.SECTION](comp);
        if (sec === null) return null;

        const text = sec.components.filter(c => c.type === ComponentType.TEXT_DISPLAY).map( c => c.content ).join('\n');
        return {
            type: ComponentType.TEXT_DISPLAY,
            content: text,
        } as TextDisplayComponent;
    }

    if (comp.type === ComponentType.LABEL || comp.type === ComponentType.TEXT_DISPLAY)
        return parseModalComponent[comp.type](comp) ?? null;

    return parseModalComponent[ComponentType.LABEL]({
        type: ComponentType.LABEL,
        label: generateRandomAnimal(),
        component: comp,
    } as LabelComponent<LabelPossible>) ?? null;
}