# ATHLEANS-APP-socket

## How to start
  node index.js

## Explanation
- The Server from socket.io is initialized with CORS settings to allow connections from http://localhost:4200.
- The onlineUsers array keeps track of users who are currently online, each with a userId and socketId.
- When a new user connects, they are added to onlineUsers if they are not already present, and the list of online users is broadcasted.
- When a user disconnects, they are removed from onlineUsers, and the updated list is broadcasted.
- Messages sent by users are directed to the intended recipient if they are online, using their socketId to ensure the message is delivered correctly.
