const User = require('.').User;
const Post = require('.').Post;
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
        as: 'userId',
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: 'id',
        as: 'postId',
      }
    },
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
  };
  return Like;
};
