const likeOrDislikeFunction = require('../utils/helpers/likeOrDislikeFunction');
const db = require('../db');

module.exports = function (sequalize, DataTypes) {
  const Question = sequalize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'questions',
  });

  Question.ENTITY_NAME = 'Question';
  Question.ENTITY_TYPE = 'Question';

  Question.associate = function (db) {
    db.Question.belongsTo(db.User, {foreignKey: "user_id"});
    db.Question.hasMany(db.Comment, {foreignKey: "question_id"});
    db.Question.hasMany(db.Rating, {foreignKey: "entity_id"});
  };


  return Question;
};
