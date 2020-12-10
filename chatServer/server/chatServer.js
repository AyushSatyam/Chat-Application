const WebSocket = require("ws");
// const { use } = require("./server.js");
var models = require("./server.js").models;

const ws = new WebSocket.Server({ port: 8080 });
const client = [];

ws.on("connection", (ws) => {
  function getInitialThreads(userId) {
    models.Thread.find({ where: {} }, (err, threads) => {
      if (!err && threads) {
        ws.send(
          JSON.stringify({
            type: "INITIAL_THREADS",
            data: threads,
          })
        );
      }
    });
  }
  function login(email, pass) {
    console.log("EM", email, pass);
    models.User.login({ email: email, password: pass }, (err, result) => {
      if (err) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            error: err,
          })
        );
      } else {
        models.User.findOne(
          { where: { id: result.userId }, include: "Profile" },
          (err2, user) => {
            if (err2) {
              ws.send(
                JSON.stringify({
                  type: "ERROR",
                  error: err2,
                })
              );
            } else {
              ws.uid = user.id + new Date().getTime().toString();
              const userObject = {
                // ...user
                id: user.id,
                email: user.email,
                ws: ws,
              };

              client.push(userObject);
              console.log("Current Clients", client);
              getInitialThreads(user.id);
              ws.send(
                JSON.stringify({
                  type: "LOGGEDIN",
                  data: {
                    session: result,
                    user: user,
                  },
                })
              );
            }
          }
        );
      }
    });
  }
  ws.on("close", (req) => {
    console.log("Request close", req);
    let clientIndex = -1;
    client.map((c, i) => {
      if (c.ws._closeCode === req) {
        clientIndex = i;
      }
    });
    if (clientIndex>-1) {
      client.splice(clientIndex,1);
    }
  });
  ws.on("message", (message) => {
    console.log("Got Message", JSON.parse(message));
    let parsed = JSON.parse(message);
    if (parsed) {
      switch (parsed.type) {
        case "SIGNUP":
          models.User.create(parsed.data, (err, user) => {
            if (err) {
              ws.send(
                JSON.stringify({
                  type: "ERROR",
                  error: err,
                })
              );
            } else {
              models.Profile.create(
                {
                  userId: user.id,
                  name: parsed.data.name,
                  email: parsed.data.email,
                },
                (profileError, profile) => {}
              );
              console.log("Signup done");
            }
          });

          break;
        case "CONNECT_WITH_TOKEN":
          models.User.findById(parsed.data.userId, (err2, user) => {
            if (!err2 && user) {
              ws.uid = user.id + new Date().getTime().toString();
              const userObject = {
                // ...user
                id: user.id,
                email: user.email,
                ws: ws,
              };
              client.push(userObject);
              console.log("Current Clients", client);
              getInitialThreads(user.id);
              // ws.send(
              //   JSON.stringify({
              //     type: "LOGGEDIN",
              //     data: {
              //       session: result,
              //       user: user,
              //     },
              //   })
              // );
            }
          });
          break;
        case "LOGIN":
          login(parsed.data.email, parsed.data.password);
          break;
        case "SEARCH":
          console.log("Searching for..", parsed.data);
          models.User.find(
            { where: { email: { like: parsed.data } } },
            (err2, users) => {
              if (!err2 && users) {
                ws.send(
                  JSON.stringify({
                    type: "GOT_USERS",
                    data: {
                      users: users,
                    },
                  })
                );
              }
            }
          );

          break;
        case "FIND_THREAD":
          models.Thread.findOne(
            {
              where: {
                and: [
                  { users: { like: parsed.data[0] } },
                  { users: { like: parsed.data[1] } },
                ],
              },
            },
            (err, thread) => {
              if (!err && thread) {
                ws.send(
                  JSON.stringify({
                    type: "ADD_THREAD",
                    data: thread,
                  })
                );
              } else {
                models.Thread.create(
                  {
                    lastUpdated: new Date(),
                    users: parsed.data,
                  },
                  (err2, thread) => {
                    if (!err2 && thread) {
                      // console.log(
                      //   "Client Filter",
                      //   client.filter(
                      //     (u) => thread.users.indexOf(u.id.toString()) > -1
                      //   )
                      // );
                      client
                        .filter(
                          (u) => thread.users.indexOf(u.id.toString()) > -1
                        )
                        .map((client) => {
                          client.ws.send(
                            JSON.stringify({
                              type: "ADD_THREAD",
                              data: thread,
                            })
                          );
                        });
                    }
                  }
                );
              }
            }
          );
          break;
        case "THREAD_LOAD":
          break;
        default:
          console.log("Nothing to see here!");
      }
    }
  });
});
