import {FC} from "react";
import {EmojiObject, PassProps} from "../utils/componentTypes";

export interface ActionMenuProps {
    closeCallback: () => void,
    customId: string
}

export type ActionMenu = FC<ActionMenuProps>
