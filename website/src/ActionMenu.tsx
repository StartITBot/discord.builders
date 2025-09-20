import {ActionMenu as ActionMenuType} from "components-sdk";

export const ActionMenu: ActionMenuType = ({closeCallback}) => {
    return <div style={{background: 'rgba(0, 0, 0, 0.5)', padding: "15px 30px", margin: "10px 0", borderRadius: 3, position: 'relative'}}>
        Not implemented yet. <div onClick={closeCallback} style={{position: 'absolute', top: 4, left: 9, color: 'red', cursor: 'pointer'}}>🗙</div>
    </div>
}
