const Dislike = require('../models').Dislike;

module.exports = {
  create(req, res, next) {
    return Dislike
      .create({
        userId: req.session.user.id,
        postId: req.params.id,
      })
      .then(dislike => {
        req.session.user.dislikes.push(dislike);
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
    return Dislike
      .findAll({
        where: {
          userId: req.session.user.id,
          postId: req.params.id,
        },
      })
      .then(dislikes => {
        if (!dislikes) {
          res.status(404);
          return res.render('error.ejs',{
            logged:"true",
            errorMessage: "404 Not found"
          });
        }
        return dislikes[0]
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
