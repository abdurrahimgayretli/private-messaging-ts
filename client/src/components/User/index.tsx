import { useEffect } from "react";
import StatusIcon from "../StatusIcon";
import "./styles.sass";

interface IMyProps {
  user: {
    username: String;
    messages: { content: String; fromSelf: Boolean }[];
    connected: Boolean;
    self: Boolean;
    hasNewMessages: Boolean;
    userID: String;
  };
  selected: Boolean;
  select: Function;
}

export default function User(props: IMyProps) {
  const status = () => {
    return props.user.connected ? "online" : "offline";
  };

  return (
    <div
      className={props.selected ? "selected" : "user"}
      onClick={() => {
        props.select(props.user);
      }}
    >
      <div className="description">
        <div className="name">
          <>
            {props.user.username}
            {props.user.self ? " (yourself)" : ""}
          </>
        </div>

        <div className="status">
          <>
            <StatusIcon connected={props.user.connected} />
            {status()}
          </>
        </div>
      </div>
      {props.user.hasNewMessages && <div className="new-messages">!</div>}
    </div>
  );
}
