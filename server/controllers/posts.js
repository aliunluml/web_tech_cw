const Post = require('../models').Post;

module.exports = {
  create(req, res) {
    return Post
      .create({
        content: req.body.content,
        userId: req.params.userId,
      })
      .then(post => res.status(201).send(post))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Post
      .findAll({
        where: {userId: req.params.userId},
      })
      .then(posts => res.status(200).send(posts))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return Post
      .findByPk(req.params.postId)
      .then(post => {
        if (!post) {
          return res.status(404).send({
            message: 'Post Not Found',
          });
        }
        return res.status(200).send(post);
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Post
      .findByPk(req.params.postId)
      .then(post => {
        if (!post) {
          return res.status(404).send({
            message: 'Post Not Found',
          });
        }

        return post
          .update({
            content: req.body.content || post.content,
            likes: req.body.likes || post.likes,
            dislikes: req.body.dislikes || post.dislikes,
          })
          .then(updatedPost => res.status(200).send(updatedPost))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return Post
      .findByPk(req.params.postId)
      .then(post => {
        if (!post) {
          return res.status(404).send({
            message: 'Post Not Found',
          });
        }

        return post
          .destroy()
          .then(() => res.status(200).send({ message: 'Post deleted successfully.' }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
