module.exports = {
  required: (value) => `${value} is required!!!`,
  unAuthorized: (value) => `UnAuthorized!!`,
  noQuestion: (value) => `Question doesn't exist !!!`,
  noEntity: (value) => `${value} doesn't exist !!!`,
  noUser: (value) => `User doesn't exist`,
  userAlreadyExist: (value) => `Username is already taken!!!`,
  incorrectEmailOrPassword: (value) => `Incorrect username or password!!!`,
  incorrectOldPassword: (value) => `Incorrect old password!!!`
};
