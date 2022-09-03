import React from "react";
import { useDispatch } from "react-redux";
import io, { Socket } from "socket.io-client";
import SocketContext from "../../contexts/SocketContext";
import { useSelectState } from "../../store/selectors";

interface Props {
  children: React.ReactNode;
}

const SocketManager: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const { authentication } = useSelectState();

  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (!authentication.accessToken || !authentication.isAuthenticated) {
      return;
    }
    const newSocket = io(process.env.REACT_APP_API_URL!, {
      query: { authorization: authentication.accessToken },
    });

    newSocket.on("connect", () => {
      console.log(
        `SocketState: Connected to the server at ${process.env.REACT_APP_API_URL}`
      );
    });
    newSocket.on("connect_error", (error: Error) => {
      console.log("SocketState: connect_error", error);
    });
    newSocket.on("disconnect", () => {
      console.log("SocketState: Disconnected from the server.");
    });

    setSocket(newSocket);

    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
        socket.close();
        setSocket(null);
      }
    };
  }, [authentication.accessToken, authentication.isAuthenticated]);

  React.useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("test", (data: any) => {
      console.log("test", { data });
    });

    return () => {
      socket.off("test");
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketManager;
