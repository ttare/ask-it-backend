module.exports = function (sequalize, DataTypes) {
  const Comment = sequalize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'comments',
  });

  Comment.ENTITY_NAME = 'Comments';
  Comment.ENTITY_TYPE = 'Comment';

  Comment.countPerQuestion = function (propertyName) {
    const subQuery =
      `(SELECT COUNT(*) ` +
      `FROM Comments ` +
      `WHERE Comments.question_id = "Question"."id")`;
    return [sequalize.cast(sequalize.literal(subQuery), 'integer'), propertyName]
  };

  Comment.countPerUser = function (propertyName) {
    const subQuery =
      `(SELECT COUNT(*) ` +
      `FROM Comments ` +
      `WHERE Comments.user_id = "User"."id")`;
    return [sequalize.cast(sequalize.literal(subQuery), 'integer'), propertyName]
  };

  Comment.associate = function (db) {
    db.Comment.belongsTo(db.User, {foreignKey: "user_id"});
    db.Comment.belongsTo(db.Question, {foreignKey: "question_id"});
    db.Comment.hasMany(db.Rating, {foreignKey: "entity_id"});
  };


  return Comment;
};
