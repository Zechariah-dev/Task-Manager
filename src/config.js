module.exports = {
  // Public domain of Task Manager
  publicDomain: "http://localhost:3000",

  //bcrypt salt work factor
  salt: 10,

  // Secret for cookie sessions, jwt
  secret: "TASKMANAGERSECRET",

  // Configuration for MongoDB
  mongoUri:
    "mongodb+srv://user:user123@development.pwq92.mongodb.net/Todomanager?retryWrites=true&w=majority"
};
