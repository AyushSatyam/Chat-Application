import * as AuthActions from "./authActions";

export const setupSocket = (token, userId) => {
  return (dispatch) => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      if (token) {
        socket.send(
          JSON.stringify({
            type: "CONNECT_WITH_TOKEN",
            data: { token: token, userId: userId },
          })
        );
        dispatch({
          type: "SETUP_SOCKET",
          payload: socket,
        });
      } else {
        dispatch({
          type: "SETUP_SOCKET",
          payload: socket,
        });
      }
    };
    socket.onmessage = (message) => {
      console.log("Message", message);
      let data = JSON.parse(message.data);
      switch (data.type) {
        case "LOGGEDIN":
          dispatch(AuthActions.loggedIn(data));
          break;
        case "GOT_USERS":
          console.log("Getting data", data);
          dispatch({
            type: "GOT_USERS",
            payload: data.data.users,
          });
          break;
        case "ADD_THREAD":
          dispatch({
            type: "ADD_THREAD",
            payload: data.data,
          });
          break;
          case 'INITIAL_THREADS':
            dispatch({
              type:'INITIAL_THREADS',
              payload: data.data
            })
        default:
          break;
      }
    };
  };
};
