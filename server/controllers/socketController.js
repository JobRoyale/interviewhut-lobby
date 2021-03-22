// import all actions
const {
  CREATE_ROOM,
  JOIN_ROOM,
  CREATE_TEAM,
  JOIN_TEAM,
  START_COMPETITION,
  CLOSE_ROOM,
  SEND_MSG,
  LEAVE_TEAM,
  GET_ROOM,
  ADD_PRIVATE_LIST,
  VETO_VOTES,
  CODE_SUBMISSION,
  FIND_SOLO_MATCH,
  GET_USER,
} = require("../socketActions/userActions");

const {
  CONNECTION_ACK,
  CONNECTION_DENY,
} = require("../socketActions/serverActions");

//import controllers
const { addUser, getUser } = require("../controllers/userController");
const {
  createRoom,
  createTeam,
  joinTeam,
  joinRoom,
  getRoomData,
  leaveTeam,
  closeRoom,
  registerVotes,
  startCompetition,
  forwardMsg,
  addPrivateList,
  codeSubmission,
} = require("../controllers/roomController");
const { findSoloMatch } = require("../controllers/publicRooms");

const { checkToken } = require("../utils/auth");

const authUser = (socket, next) => {
  try {
    // check the token
    // token format "Bearer Token"
    const token = socket.handshake.headers.authorization.split(" ")[1];
    const payload = checkToken(token);

    //if sucessfull
    if (payload) {
      // connection accepted
      // now check if user is already connected or not
      const userState = addUser(payload.username, socket.id, payload.profilePic);
      if (userState) {
        socket.emit(CONNECTION_ACK, userState);
        socket.userDetails = payload;
        next();
      } else {
        throw new Error("Already Conected");
      }
    } else {
      console.log("Invalid token");
      socket.emit(CONNECTION_DENY);
      throw new Error("Auth failed");
    }
  } catch (err) {
    socket.emit();
    next(err);
  }
};

// we can move this inside handleuserevnets

const genericActionCreator = (
  actionResponder,
  dataFromServer,
  asynFunc = false,
  failReply = "Some error occured !",
  ACTION = ""
) => (dataFromClient, cb) => {
  // if user didnt pass anything
  if (!dataFromClient) dataFromClient = {};
  dataFromClient.userName = dataFromServer.socket.userDetails.userName;
  let data;
  if (!asynFunc) {
    data = actionResponder(dataFromClient, dataFromServer) || failReply;
    console.log(data);
    if (cb) cb(data);
  } else {
    actionResponder(dataFromClient, dataFromServer)
      .then((data) => {
        console.log(data);
        if (cb) cb(data);
      })
      .catch((err) => {
        console.log(err.message);
        if (cb) cb(err.message);
      });
  }
};

const handleUserEvents = ({ socket, io }) => {
  socket.on(CREATE_ROOM, genericActionCreator(createRoom, { socket }));
  socket.on(JOIN_ROOM, genericActionCreator(joinRoom, { socket }));
  socket.on(CREATE_TEAM, genericActionCreator(createTeam, { socket }));
  socket.on(JOIN_TEAM, genericActionCreator(joinTeam, { socket }));
  socket.on(CLOSE_ROOM, genericActionCreator(closeRoom, { socket }));
  socket.on(SEND_MSG, genericActionCreator(forwardMsg, { socket }));
  socket.on(LEAVE_TEAM, genericActionCreator(leaveTeam, { socket }));
  socket.on(GET_ROOM, genericActionCreator(getRoomData, { socket }));
  socket.on(GET_USER, genericActionCreator(getUser, { socket }));
  socket.on(VETO_VOTES, genericActionCreator(registerVotes, { socket }));
  socket.on(
    START_COMPETITION,
    genericActionCreator(startCompetition, { socket }, true)
  );
  socket.on(
    CODE_SUBMISSION,
    genericActionCreator(codeSubmission, { socket }, true)
  );
  socket.on(ADD_PRIVATE_LIST, genericActionCreator(addPrivateList, { socket }));
  socket.on(
    FIND_SOLO_MATCH,
    // needs io to contact specific users
    genericActionCreator(findSoloMatch, { socket, io })
  );
  socket.on("disconnect", () => {
    // removeUser(socket.userDetails.userName);
  });
};

module.exports = {
  authUser,
  handleUserEvents,
};
