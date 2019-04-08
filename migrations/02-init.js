const baseModel = (DataTypes) => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});

module.exports = {
  up: function (queryInterface, DataTypes) {
    return Promise.all([
      this.createUserTable(queryInterface, DataTypes),
      this.createQuestionTable(queryInterface, DataTypes),
      this.createCommentTable(queryInterface, DataTypes),
      this.createRatingTable(queryInterface, DataTypes),
    ])
  },

  createUserTable: function (queryInterface, DataTypes) {
    let tableDef = {
      ...baseModel(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      salt: DataTypes.STRING,
    };
    return queryInterface.createTable('users', tableDef);
  },

  createQuestionTable: function (queryInterface, DataTypes) {
    let tableDef = {
      ...baseModel(DataTypes),
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      subject: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      }
    };
    return queryInterface.createTable('questions', tableDef);
  },

  createCommentTable: function (queryInterface, DataTypes) {
    let tableDef = {
      ...baseModel(DataTypes),
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'questions',
        key: 'id'
      },
      text: {
        type: DataTypes.TEXT
      }
    };
    return queryInterface.createTable('comments', tableDef);
  },

  createRatingTable: function (queryInterface, DataTypes) {
    let tableDef = {
      ...baseModel(DataTypes),
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      entity_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      like: {
        type: DataTypes.BOOLEAN,
      },
      entity_type: {
        type: DataTypes.ENUM,
        values: ['Comment', 'Question']
      }
    };
    return queryInterface.createTable('ratings', tableDef);
  }


};
