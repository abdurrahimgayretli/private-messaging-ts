import socket from "../../socket";
import User from "../User";
import MessagePanel from "../MessagePanel";

import { Component, useEffect, useState } from "react";

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
  input: Function;
}

export default function Chat() {
  const [users, setUsers] = useState<IMyProps["user"][]>([]);
  const [selectedUser, setSelectedUser] = useState<IMyProps["user"]>();

  const onSelectUser = (user: IMyProps["user"]) => {
    setSelectedUser(user);
    user.hasNewMessages = false;
  };
  const onMessage = (content: any) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      users.forEach((user: IMyProps["user"]) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      users.forEach((user: IMyProps["user"]) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });
    const initReactiveProperties = (user: IMyProps["user"]) => {
      user.hasNewMessages = false;
    };

    socket.on("users", (copyUsers: IMyProps["user"][]) => {
      copyUsers.forEach((user: IMyProps["user"]) => {
        user.messages.forEach((message: any) => {
          message.fromSelf = message.from === socket.id;
        });
        for (let i = 0; i < users.length; i++) {
          const existingUser = users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
        setUsers((prev: any) => {
          return [...prev, user];
        });
      });
      // put the current user first, and sort by username
      users.sort((a: IMyProps["user"], b: IMyProps["user"]) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on("user connected", (user: IMyProps["user"]) => {
      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          setUsers((prev: any) => {
            return [...prev];
          });
          return;
        }
      }
      initReactiveProperties(user);

      setUsers((prev: any) => {
        return [...prev, user];
      });
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === id) {
          user.connected = false;
          setUsers((prev: any) => {
            return [...prev];
          });
          break;
        }
      }
    });

    socket.on("private message", ({ content, from, to }) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const fromSelf = socket.id === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          setUsers((prev: any) => {
            return [...prev];
          });
          break;
        }
      }
    });
  });

  useEffect(() => {
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  });

  return (
    <div>
      <div className="left-panel">
        {users.map((user: IMyProps["user"], index: number) => (
          <User
            key={index}
            user={user!}
            selected={selectedUser === user}
            select={() => {
              onSelectUser(user);
            }}
          />
        ))}
      </div>
      {selectedUser && (
        <div className="right-panel">
          <MessagePanel user={selectedUser} input={onMessage} />
        </div>
      )}
    </div>
  );
}
