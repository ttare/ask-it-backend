const db = require('../db');
const APIError = require('../utils/apiError');
const MESSAGES = require('../utils/messages');

class CommentsController {

  static async create(req, res) {
    const {question_id} = req.body;
    const question = await db.Question.findByPk(question_id);
    if (!question) {
      return res.status(400).send(new APIError(MESSAGES.noQuestion()));
    }

    const comment = {
      ...req.body,
      question_id: question.id,
      user_id: req.user.id
    };
    const savedComment = await db.Comment.create(comment);
    return res.send({id: savedComment.id});
  }

  static async likeOrDislike(req, res) {
    const comment = await db.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(400).send(new APIError(MESSAGES.noEntity('Comment'), 1000));
    }

    const rating = await db.Rating.likeOrDislike(comment.id, req.body.like, req.user.id, db.Comment.ENTITY_TYPE);
    return res.send(rating);

  }

}

module.exports = CommentsController;
