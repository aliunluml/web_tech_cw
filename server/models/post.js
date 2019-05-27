module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Post.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'postId',
      as: 'likedBys',
    });
    Post.belongsToMany(models.User, {
      through: models.Dislike,
      foreignKey: 'postId',
      as: 'dislikedBys',
    });
  };

  return Post;
};
