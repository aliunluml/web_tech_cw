const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const User = require('../models').User;
const Post = require('../models').Post;

module.exports = {
  create(req, res, next) {
    return User
      .create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        //This is temporary and unsecure. We will store only an encrypted password hash
        //, not the actual password string as we are doing at the moment.
        hash: req.body.password,
        affiliation: req.body.affiliation,
        title: req.body.title,
      })
      .then(user => {
        req.session.user = user;
        next();
      })
      .catch(error => res.status(400).send(error));
  },
  eligible(req, res, next) {
    return User
      .findAll({
        where: {
          [Op.or]: [{username: req.body.username}, {email: req.body.email}]
        },
      })
      .then(users => {
        if (users.length===0) {
          next();
        }
        else {
          //No feedback is given to the user at the moment.
          //There is also no differentiation between email & username checks
          //We may split this eligible() as emailCheck() & usernameCheck()
          return res.redirect('/signup');
        }
      })
      .catch(error => res.status(400).send(error));
  },
  match(req, res, next) {
    return User
      .findAll({
        where: {
          email: req.body.email,
          hash: req.body.password,
        },
        include: [{
          model: Post,
          as: 'posts',
        }],
      })
      .then(users => {
        if (users.length===0) {
          //No feedback is given to the user at the moment.
          return res.redirect('/login');
        }
        else {
          //findAll() outputs an array.
          req.session.user = users[0];
          next();
        }
      })
      .catch(error => res.status(400).send(error));
  },
  list(req, res, next) {
    return User
      .findAll({
        include: [{
          model: Post,
          as: 'posts',
        }],
      })
      .then(users => {
        buffer = [];
        users.forEach(user => {
          var item = {
            username: user.username,
            posts: user.posts,
          };
          buffer.push(item);
        });
        req.session.corpusFeed = buffer;
        next();
      })
      .catch(error => res.status(400).send(error));
  },
  // retrieve(req, res) {
  //   return User
  //     .findByPk(req.params.userId, {
  //       include: [{
  //         model: Post,
  //         as: 'posts',
  //       }],
  //     })
  //     .then(user => {
  //       if (!user) {
  //         return res.status(404).send({
  //           message: 'User Not Found',
  //         });
  //       }
  //       return res.status(200).send(user);
  //     })
  //     .catch(error => res.status(400).send(error));
  // },
  // update(req, res) {
  //   return User
  //     .findByPk(req.params.userId, {
  //       include: [{
  //         model: Post,
  //         as: 'posts',
  //       }],
  //     })
  //     .then(user => {
  //       if (!user) {
  //         return res.status(404).send({
  //           message: 'User Not Found',
  //         });
  //       }
  //       return user
  //         .update({
  //           username: req.body.username || user.username,
  //           name: req.body.name || user.name,
  //           title: req.body.title || user.title,
  //           email: req.body.email || user.email,
  //           affiliation: req.body.affiliation || user.affiliation,
  //         })
  //         .then(() => res.status(200).send(user))  // Send back the updated todo.
  //         .catch((error) => res.status(400).send(error));
  //     })
  //     .catch((error) => res.status(400).send(error));
  // },
  // destroy(req, res) {
  //   return User
  //     .findByPk(req.params.userId)
  //     .then(user => {
  //       if (!user) {
  //         return res.status(400).send({
  //           message: 'User Not Found',
  //         });
  //       }
  //       return user
  //         .destroy()
  //         .then(() => res.status(200).send({ message: 'User deleted successfully.' }))
  //         .catch(error => res.status(400).send(error));
  //     })
  //     .catch(error => res.status(400).send(error));
  // },
};
