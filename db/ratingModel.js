module.exports = function (sequalize, DataTypes) {
  const Rating = sequalize.define('Rating', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    entity_id: {
      type: DataTypes.UUID,
    },
    like: {
      type: DataTypes.BOOLEAN,
    },
    entity_type: {
      type: DataTypes.ENUM,
      values: ['COMMENT', 'QUESTION']
    }
  }, {
    tableName: 'ratings',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['entity_type', 'entity_id', 'user_id']
      }
    ]
  });

  Rating.likeOrDislike = async function (entity_id, like, user_id, entity_type) {
    const potentialRating = {
      user_id,
      entity_id,
      entity_type,
    };

    const rating = await Rating.findOne({where: potentialRating});

    if (rating) {
      if (rating.like === like) {
        return rating.destroy();
      }

      return rating.update({
        like
      });
    } else {
      potentialRating.like = like;
      return Rating.create(potentialRating);
    }
  };

  Rating.countPerEntity = function (entity_id, entity_type, like, propertyName, castTo) {
    const subQuery =
      `(SELECT COUNT(*) ` +
      `FROM Ratings ` +
      `WHERE Ratings.like = ${like} AND ` +
      `Ratings.entity_id = "${entity_id}"."id" AND ` +
      `Ratings.entity_type = '${entity_type}')`;
    return [
      sequalize.cast(
        sequalize.literal(subQuery),
        castTo
      ),
      propertyName
    ]
  };

  Rating.isLikedByLoggedUser = function (entity_id, entity_type, propertyName) {
    const subQuery =
      `(SELECT Ratings.like ` +
      `FROM Ratings ` +
      `WHERE ` +
      `Ratings.entity_id = "${entity_id}"."id" AND ` +
      `Ratings.entity_type = '${entity_type}' AND ` +
      `Ratings.user_id = "User"."id" ` +
      `LIMIT 1)`;
    return [sequalize.cast(sequalize.literal(subQuery), 'boolean'), propertyName];
  };

  Rating.associate = function (db) {
    db.Rating.belongsTo(db.User, {foreignKey: 'user_id', allowNull: false});
  };

  return Rating;
};
