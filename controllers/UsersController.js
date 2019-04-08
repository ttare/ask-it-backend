const db = require('../db');
const APIError = require('../utils/apiError');
const MESSAGES = require('../utils/messages');

const {User} = db;

const COMMENTS_COUNT = 'commentsCount';

class UsersController {

  static async me(req, res) {
    return res.send(req.user);
  }

  static async mostActive(req, res) {
    const mostActive = await db.User.findAll({
      limit: 10,
      attributes: {
        include: [
          db.Comment.countPerUser(COMMENTS_COUNT)
        ]
      },
      group: ['User.id'],
      having: db.Sequelize.where(
        db.Comment.countPerUser(COMMENTS_COUNT)[0],
        '>',
        0
      ),
      order: [
        [db.Sequelize.col(COMMENTS_COUNT), 'DESC']
      ]
    });

    res.send(mostActive);
  }

  static async updatePassword(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(400).send("Bad Request");
      }

      const isCorrectOldPassword = await user.validPassword(req.body.oldPassword);
      if (!isCorrectOldPassword) {
        return res.status(400).send(new APIError(MESSAGES.incorrectOldPassword(), 1001));
      }

      user.salt = user.makeSalt(16);
      user.password = await user.encryptPassword(req.body.password);
      await user.save();

      return res.send(true);
    } catch (e) {
      return res.status(400).send(e);
    }
  }

}

module.exports = UsersController;
