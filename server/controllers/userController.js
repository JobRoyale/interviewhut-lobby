// this is my db for now
users = {};

// all details related to a user connected to socket will be stored here

const addUser = (username, socket_id, profilePicture, rank = 10) => {
  // returns user object if we can add user else false
  try {
    if (!users[username]) {
      // new connection
      console.log(username + " added");
      users[username] = {
        socket_id,
        room_id: "",
        team_name: "",
        rank,
        username,
        profilePicture,
      };
    } else {
      // reconnecting
      console.log(username + " reconnected");
      users[username].socket_id = socket_id;
    }
    return users[username];
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

const removeUser = (username) => {
  try {
    if (users[username]) {
      console.log(username + " removed");
      delete users[username];
      return true;
    }
    return false;
  } catch (err) {
    return err.message || false;
  }
};

// this is just for extra checking
// can change room_id and team_name
const setRoom = (username, room_id, team_name) => {
  try {
    //check if user is still connected
    if (users[username]) {
      users[username].room_id = room_id;
      users[username].team_name = team_name || "";
      return true;
    }
    return false;
  } catch (err) {
    return err.message || false;
  }
};

const setTeam = (username, team_name) => {
  try {
    if (users[username]) {
      users[username].team_name = team_name;
      return true;
    }
    return false;
  } catch (err) {
    return err.message || false;
  }
};

const getUser = (username) => {
  try {
    return users[username];
  } catch (err) {
    return err.message || false;
  }
};

const getUserData = () => {
  // need proper authorizations
  try {
    return users;
  } catch (err) {
    return err.message || false;
  }
};

module.exports = {
  addUser,
  getUserData,
  setRoom,
  getUser,
  removeUser,
  setTeam,
};
