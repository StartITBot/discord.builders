import {FC} from "react";

export interface ActionMenuProps {
    closeCallback: () => void,
    customId: string
}

export type ActionMenu = FC<ActionMenuProps>
