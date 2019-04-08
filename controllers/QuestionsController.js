const db = require('../db');
const APIError = require('../utils/apiError');
const MESSAGES = require('../utils/messages');


const IS_LIKED_PROPERTY = 'isLikedByLoggedUser';
const LIKES_PROPERTY = 'likes';
const DISLIKES_PROPERTY = 'dislikes';
const COMMENTS_COUNT_PROPERTY = 'commentsCount';
const NUM_OF_LIKES_PROPERTY = 'numOfLikes';
const INTEGER = 'integer';

class QuestionsController {

  static async create(req, res) {
    const {subject, description} = req.body;
    const question = {
      subject,
      description,
      user_id: req.user.id
    };
    const savedQuestion = await db.Question.create(question);
    return res.send({id: savedQuestion.id});
  }

  static async list(req, res) {
    const list = await QuestionsController.findAll(req.params);
    return res.send(list);
  }

  static async myList(req, res) {
    const list = await QuestionsController.findAll(req.params,{
      user_id: req.user.id
    });
    return res.send(list);
  }

  static async mostLiked(req, res) {
    const mostLiked = await db.Question.findAll({
      limit: 10,
      attributes: {
        include: [
          db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, true, NUM_OF_LIKES_PROPERTY, INTEGER),
        ]
      },
      group: ['Question.id'],
      having: db.Sequelize.where(
        db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, true, NUM_OF_LIKES_PROPERTY, INTEGER)[0],
        '>',
        0
      ),
      order: [
        [db.Sequelize.col(NUM_OF_LIKES_PROPERTY), 'DESC'],
      ],
    });

    res.send(mostLiked);
  }

  static async details(req, res) {
    const {id} = req.params;
    const questionInclude = [
      db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, true, LIKES_PROPERTY, INTEGER),
      db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, false, DISLIKES_PROPERTY, INTEGER),
    ];
    const commentInclude = [
      db.Rating.countPerEntity(db.Comment.ENTITY_NAME, db.Comment.ENTITY_TYPE, true, LIKES_PROPERTY, INTEGER),
      db.Rating.countPerEntity(db.Comment.ENTITY_NAME, db.Comment.ENTITY_TYPE, false, DISLIKES_PROPERTY, INTEGER),
    ];

    if (req.user) {
      questionInclude.push(
        db.Rating.isLikedByLoggedUser(db.Question.ENTITY_NAME, db.Comment.ENTITY_TYPE, IS_LIKED_PROPERTY)
      );

      commentInclude.push(
        db.Rating.isLikedByLoggedUser(db.Comment.ENTITY_NAME, db.Comment.ENTITY_TYPE, IS_LIKED_PROPERTY)
      );
    }

    const question = await db.Question.findByPk(id, {
        attributes: {
          include: questionInclude
        },
        include: [
          {
            model: db.Comment,
            attributes: {
              include: commentInclude
            },
            include: [
              {
                model: db.User,
                attributes: ['username', 'id']
              },
              {
                model: db.Rating,
                attributes: []
              }
            ]
          }, {
            model: db.User,
            attributes: ['username', 'id']
          }, {
            model: db.Rating,
            attributes: []
          }
        ]
      }
    );

    return res.send(question);
  }

  static async likeOrDislike(req, res) {
    const question = await db.Question.findByPk(req.params.id);
    if (!question) {
      return res.status(400).send(new APIError(MESSAGES.noQuestion(), 1000));
    }

    const rating = await db.Rating.likeOrDislike(question.id, req.body.like, req.user.id, db.Question.ENTITY_TYPE);
    return res.send(rating);
  }

  static async findAll(params, where) {
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);

    const count = await db.Question.count();

    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const include = [
      db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, true, LIKES_PROPERTY, INTEGER),
      db.Rating.countPerEntity(db.Question.ENTITY_NAME, db.Question.ENTITY_TYPE, false, DISLIKES_PROPERTY, INTEGER),
      db.Comment.countPerQuestion(COMMENTS_COUNT_PROPERTY),
    ];

    const list = await db.Question.findAll({
      offset,
      limit,
      subQuery: false,
      where,
      attributes: {
        include
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username']
        },
        {
          model: db.Comment,
          attributes: []
        },
        {
          model: db.Rating,
          attributes: []
        },
      ],
      group: ['Question.id', 'User.id'],
      order: db.Sequelize.literal(`"Question"."createdAt" DESC`),
    });

    return {
      questions: list,
      count,
      limit,
      totalPages,
      page,
    };
  }

}

module.exports = QuestionsController;
