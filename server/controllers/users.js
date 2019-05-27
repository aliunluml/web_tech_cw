const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const User = require('../models').User;
const Post = require('../models').Post;


function prepare(posts){
  var sentPosts = [];
  posts.forEach(post=>{
    var sentPost = {
      id: post.id,
      content: post.content,
      likeCount: (post.likedBys===undefined) ? "0" : post.likedBys.length.toString(),
      dislikeCount: (post.dislikedBys===undefined) ? "0" : post.dislikedBys.length.toString(),
    };
    sentPosts.push(sentPost);
  });
  return sentPosts;
}

module.exports = {
  create(req, res, next) {
    return User
      .create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        // Later on in user.js model, the beforeCreate() function is called to encrypt hash
        hash: req.body.password,
        affiliation: req.body.affiliation,
        title: req.body.title,
      })
      .then(user => {
        next();
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          logged:"false",
          errorMessage: "400 Bad request"
        });
      });
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
          invalidUsername = false;
          invalidEmail = false;
          for (var i = 0; i < users.length; i++) {
            if (users[i].username===req.body.username) {
              invalidUsername = true;
            }
            if (users[i].email===req.body.email) {
              invalidEmail = true;
            }
            if (invalidUsername && invalidEmail) {
              break;
            }
          }

          return res.render('signup.ejs',{
            invalidEmail: invalidEmail.toString(),
            invalidUsername: invalidUsername.toString(),
            logged:"false",
          });

        }
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          logged:"false",
          errorMessage: "400 Bad request"
        });
      });
  },
  match(req, res, next) {
    return User
      .findOne({
        where: {
          email: req.body.email,
        },
        include: [{
          model: Post,
          as: 'posts',
          include: [{model: User, as: 'likedBys'}, {model: User, as: 'dislikedBys'}]
        }, {
          model: Post,
          as: 'likes',
          include: [{model: User, as: 'likedBys'}, {model: User, as: 'dislikedBys'}]
        }, {
          model: Post,
          as: 'dislikes',
          include: [{model: User, as: 'likedBys'}, {model: User, as: 'dislikedBys'}]
        }],
      })
      .then(async function(user){
        if (!user) {
          return res.render('login.ejs',{
            invalidEmail:"true",
            invalidPassword:"false",
            logged:"false",
          });
        }
        else if (!await user.validPassword(req.body.password)) {
          return res.render('login.ejs',{
            invalidEmail:"false",
            invalidPassword:"true",
            logged:"false",
          });
        }
        else {
          req.session.user = user;
          next();
        }
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          logged:"false",
          errorMessage: "400 Bad request"
        });
      });
  },
  list(req, res, next) {
    return User
      .findAll({
        include: [{
          model: Post,
          as: 'posts',
          include: [{model: User, as: 'likedBys'}, {model: User, as: 'dislikedBys'}]
        }],
      })
      .then(users => {
        buffer = [];
        users.forEach(user => {
          var item = {
            username: user.username,
            posts: prepare(user.posts),
          };
          buffer.push(item);
        });
        req.session.corpusFeed = buffer;
        next();
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          logged:"true",
          errorMessage: "400 Bad request"
        });
      });
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
  destroy(req, res, next) {
    return User
      .findByPk(req.params.id)
      .then(user => {
        if (!user) {
          res.status(404);
          return res.render('error.ejs',{
            logged:"true",
            errorMessage: "404 Not found"
          });
        }
        return user
          .destroy()
          .then(() => {
            next();
          })
          .catch(error => {
            console.log(error);
            res.status(400);
            res.render('error.ejs',{
              logged:"true",
              errorMessage: "400 Bad request"
            });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          logged:"true",
          errorMessage: "400 Bad request"
        });
      });
  },
};
