const Like = require('../models').Like;

module.exports = {
  create(req, res, next) {
    return Like
      .create({
        userId: req.session.user.id,
        postId: req.params.id,
      })
      .then(like => {
        req.session.user.likes.push(like);
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
  destroy(req, res, next) {
    return Like
      .findAll({
        where: {
          userId: req.session.user.id,
          postId: req.params.id,
        },
      })
      .then(likes => {
        if (!likes) {
          res.status(404);
          return res.render('error.ejs',{
            logged:"true",
            errorMessage: "404 Not found"
          });
        }
        return likes[0]
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
