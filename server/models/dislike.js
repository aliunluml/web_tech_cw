'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dislike = sequelize.define('Dislike', {
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
  Dislike.associate = function(models) {
    // associations can be defined here
  };
  return Dislike;
};
