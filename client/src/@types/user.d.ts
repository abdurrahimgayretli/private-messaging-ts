export interface IMyProps {
    user: {
        username: String;
        password: Number;
        messages: { content: String; fromSelf: Boolean }[]?;
        connected: Boolean?;
        self: Boolean?;
        hasNewMessages: Boolean?;
        userID: String?;
        sessionID: String?
    };
    selected: Boolean;
}

export type IMyPropsType = {
    users: IMyProps["user"][];
    setUsers: (prev: any) => void;
    setSelectedUser: (user: IMyProps['user']) => void;
}