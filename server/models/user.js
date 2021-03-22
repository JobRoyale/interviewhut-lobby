users = {};

const addUser = ({
  username,
  socket_id,
  room_id,
  team_name,
  rank,
  profilePicture,
}) => {
  try {
    if (!username || !socket_id || !profilePicture || !rank) {
      throw new Error("Give all parameters");
    }
    if (username) {
      throw new Error("User already exists");
    }

    const newUser = {
      socket_id: socket_id,
      room_id: room_id,
      team_name: team_name,
      rank: rank,
      username: username,
      profilePicture: profilePicture,
    };
    users[username] = newUser;
    return newUser;
  } catch (err) {
    return err;
  }
};

const updateUser = ({
  username,
  socket_id,
  room_id,
  team_name,
  rank,
  profilePicture,
}) => {
  if (socket_id || socket_id === "") {
    users[username].socket_id = socket_id;
  }
  if (room_id || room_id === "") {
    users[username].room_id = room_id;
  }
  if (team_name || team_name === "") {
    users[username].team_name = team_name;
  }
  if (rank) {
    users[username].rank = rank;
  }
  if (profilePicture || profilePicture === "") {
    users[username].profilePicture = profilePicture;
  }
  return users[username];
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
  updateUser,
  getUser,
  getUserData,
};
