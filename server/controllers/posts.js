const Post = require('../models').Post;
const User = require('../models').User;

module.exports = {
  create(req, res, next) {
    return Post
      .create({
        content: req.body.content,
        userId: req.session.user.id,
      })
      .then(post => {
        //Update the current session. Otherwise, need to query User DB once again.
        req.session.user.posts.push(post);
        next();
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          username: req.session.user.username,
          logged:"true",
          errorMessage: "400 Bad request"
        });
      });
  },
  // list(req, res) {
  //   return Post
  //     .findAll({
  //       where: {userId: req.params.userId},
  //     })
  //     .then(posts => res.status(200).send(posts))
  //     .catch(error => res.status(400).send(error));
  // },
  // retrieve(req, res, next) {
  //   return Post
  //     .findByPk(req.params.id, {
  //       include: [{
  //         model: User,
  //         as: 'likedBys',
  //       },{
  //         model: User,
  //         as: 'dislikedBys',
  //       }],
  //     })
  //     .then(post => {
  //       if (!post) {
  //         res.status(404);
  //         return res.render('error.ejs',{
  //           username: req.session.user.username,
  //           logged:"true",
  //           errorMessage: "404 Not found"
  //         });
  //       }
  //       req.params.post = post;
  //       next();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       res.status(400);
  //       res.render('error.ejs',{
  //         username: req.session.user.username,
  //         logged:"true",
  //         errorMessage: "400 Bad request"
  //       });
  //     });
  // },
  // update(req, res) {
  //   return Post
  //     .findByPk(req.params.postId)
  //     .then(post => {
  //       if (!post) {
  //         return res.status(404).send({
  //           message: 'Post Not Found',
  //         });
  //       }
  //
  //       return post
  //         .update({
  //           content: req.body.content || post.content,
  //           likes: req.body.likes || post.likes,
  //           dislikes: req.body.dislikes || post.dislikes,
  //         })
  //         .then(updatedPost => res.status(200).send(updatedPost))
  //         .catch(error => res.status(400).send(error));
  //     })
  //     .catch(error => res.status(400).send(error));
  // },
  destroy(req, res, next) {
    return Post
      .findByPk(req.params.id)
      .then(post => {
        if (!post) {
          res.status(404);
          return res.render('error.ejs',{
            username: req.session.user.username,
            logged:"true",
            errorMessage: "404 Not found"
          });
        }
        return post
          .destroy()
          .then(() => {
            next();
          })
          .catch(error => {
            console.log(error);
            res.status(400);
            res.render('error.ejs',{
              username: req.session.user.username,
              logged:"true",
              errorMessage: "400 Bad request"
            });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.render('error.ejs',{
          username: req.session.user.username,
          logged:"true",
          errorMessage: "400 Bad request"
        });
      });
  },
};
