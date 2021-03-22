// this will controll all public rooms and matches

// use a balances binary tree here
const waitQueue = [];

const { MATCH_FOUND } = require("../socketActions/serverActions");
const { setRoom, getUser, setTeam, mapNameToId } = require("./userController");

const {
  createRoom,
  createTeam,
  joinTeam,
  joinRoom,
  startCompetition,
} = require("../controllers/roomController");

const findSoloMatch = ({ username }, { socket, io }) => {
  try {
    const user = getUser(username);
    insertInQueue(user, { socket, io });
    return true;
  } catch (err) {
    return { error: err.message };
  }
};

// change to const
const getPos = (ele, l = 0, r = waitQueue.length) => {
  // binary search
  // log(n)

  // empty arr
  if (!waitQueue.length) return 0;

  if (r < l) return l;
  if (r === l) {
    if (ele.rank > waitQueue[r].rank) return r + 1;
    else return r;
  }

  const mid = Math.floor((l + r) / 2);
  if (waitQueue[mid].rank === ele.rank) return mid;

  if (waitQueue[mid].rank > ele.rank) return getPos(ele, l, mid - 1);
  else return getPos(ele, mid + 1, r);
};

const getMatch = (user) => {
  const rankMargin = 0;
  const matchPos = getPos(user);
  const matchedUser = waitQueue[matchPos];
  return matchedUser && Math.abs(matchedUser.rank - user.rank) <= rankMargin
    ? { matchedUser, matchPos }
    : null;
};

const insertInQueue = (user, { socket, io }) => {
  // find if anyone matches
  const match = getMatch(user);
  if (match) {
    const { matchedUser, matchPos } = match;
    waitQueue.splice(matchPos, 1);
    matchUp(user, matchedUser, { socket, io });
  } else {
    let newPos = getPos(user.rank);
    waitQueue.splice(newPos, 0, user);
  }
};

const matchUp = (userA, userB, { socket, io }) => {
  // create room
  const room = createRoom({ username: userA.username }, { socket });
  room_id = room.config.id;

  //create team1 and team2
  const team1 = "Team 1";
  const team2 = "Team 2";
  createTeam({ username: userA.username, team_name: team1 }, { socket });
  createTeam({ username: userA.username, team_name: team2 }, { socket });

  //join team for userA
  joinTeam({ username: userA.username, team_name: team1 }, { socket });

  // join room and team for userB
  joinRoom({ username: userB.username, room_id, team_name: team2 }, { socket });

  // send user A and B FOUND_MATCH
  io.to(userA.socket_id).emit(MATCH_FOUND, room);
  io.to(userB.socket_id).emit(MATCH_FOUND, room);
};

module.exports = {
  findSoloMatch,
};
