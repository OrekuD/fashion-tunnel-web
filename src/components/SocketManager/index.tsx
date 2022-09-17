import React from "react";
import { useDispatch } from "react-redux";
import io, { Socket } from "socket.io-client";
import SocketContext from "../../contexts/SocketContext";
import OrderStatusChangeResponse from "../../network/responses/OrderStatusChangeResponse";
import { useSelectState } from "../../store/selectors";
import { orderActions } from "../../store/slices/order.slice";
import { ordersActions } from "../../store/slices/orders.slice";
import { Events } from "../../types";

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
      // transports: ["websocket"],
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

    socket.on(Events.ORDER_STATUS_CHANGE, (data: OrderStatusChangeResponse) => {
      console.log(Events.ORDER_STATUS_CHANGE, { data });
      dispatch(ordersActions.updateOrderStatus(data));
      dispatch(orderActions.updateOrderStatus(data));
    });

    return () => {
      socket.off(Events.ORDER_STATUS_CHANGE);
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
