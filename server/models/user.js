const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [0,15],
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    affiliation: {
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      beforeCreate: async function(user){
        const salt = await bcrypt.genSalt();
        user.hash = await bcrypt.hash(user.hash, salt);
      }
    },
  });

  User.prototype.validPassword = async function (hash) {
    return await bcrypt.compare(hash, this.hash);
  };

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
    });
    User.belongsToMany(models.Post, {
      through: models.Like,
      foreignKey: 'userId',
      as: 'likes',
      onDelete: 'CASCADE',
    });
    User.belongsToMany(models.Post, {
      through: models.Dislike,
      foreignKey: 'userId',
      as: 'dislikes',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
