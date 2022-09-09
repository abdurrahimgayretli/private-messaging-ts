import "./App.sass";
import SelectUsername from "./components/SelectUsername";
import Chat from "./components/Chat";
import socket from "./socket";
import { useEffect, useState } from "react";
import { UserContextProvider } from "./context";

function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  const onUsernameSelection = (username: String) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.id = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    });
  }, []);

  useEffect(
    () => () => {
      socket.off("connect_error");
    },
    []
  );
  return (
    <UserContextProvider>
      <div id="app">
        {!usernameAlreadySelected ? (
          <SelectUsername input={onUsernameSelection} />
        ) : (
          <Chat />
        )}
      </div>
    </UserContextProvider>
  );
}

export default App;
