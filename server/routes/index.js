const usersController = require('../controllers').users;
const postsController = require('../controllers').posts;
const likesController = require('../controllers').likes;
const dislikesController = require('../controllers').dislikes;


module.exports = (app, checkLogin, loginRedirect, continueWithNoLogin) => {
  // app.get('/api', (req, res) => res.status(200).send({
  //   message: 'Welcome to the Todos API!',
  // }));

  function deletePostInSession(req, res, next){
    req.session.user.posts.splice(req.params.index,1);
    next();
  }

  function checkPostOwnership(req, res, next, owner=false){
    for (var i = 0; i < req.session.user.posts.length; i++) {
      if (req.session.user.posts[i].id===parseInt(req.params.id)) {
        req.params.index = i;
        owner = !owner;
        break;
      }
    }
    if(owner){
      next();
    }
    else{
      res.status(403);
      res.render('error.ejs',{
        username: req.session.user.username,
        logged:"true",
        errorMessage: "403 Forbidden"
      });
    }
  }

  function checkDislikeOwnership(req, res, next){
    var owner = false;
    for (var i = 0; i < req.session.user.dislikes.length; i++) {
      if (req.session.user.dislikes[i].id===parseInt(req.params.id)) {
        req.session.user.dislikes.splice(i,1);
        owner = true;
        break;
      }
    }
    if(owner){
      next();
    }
    else{
      res.sendStatus(204);
    }
  }

  function checkLikeOwnership(req, res, next){
    var owner = false;
    console.log(req.session.user.likes);
    for (var i = 0; i < req.session.user.likes.length; i++) {
      if (req.session.user.likes[i].id===parseInt(req.params.id)) {
        req.session.user.likes.splice(i,1);
        owner = true;
        break;
      }
    }
    console.log("INSIDE 2");
    console.log(owner);
    if(owner){
      next();
    }
    else{
      res.sendStatus(204);
    }
  }

  function checkAccountOwnership(req, res, next){
    var owner = false;
    if (req.session.user.username===req.params.username) {
      req.params.id = req.session.user.id;
      req.session.destroy(() => {
         console.log("Account to be terminated.")
      });
      owner = true;
    }
    if(owner){
      next();
    }
    else{
      res.status(403);
      res.render('error.ejs',{
        username: req.session.user.username,
        logged:"true",
        errorMessage: "403 Forbidden"
      });
    }
  }


  app.use('/signup', checkLogin, (req, res) => {
    res.redirect('/dashboard');
  });

  app.use('/signup', checkLogin, continueWithNoLogin, usersController.eligible, usersController.create, (req, res) => {
// Default redirect is 302. We need 307 to preserve the POST request & req.body
// 308 is Permanent redirect and the browser may in the future directly bypass,
// not what we want. See the table at https://tools.ietf.org/html/rfc7538
    res.redirect(307,'/login');
  });


  app.use('/login', checkLogin, (req, res) => {
    res.redirect('/dashboard');
  });

  app.use('/login', checkLogin, continueWithNoLogin, usersController.match, (req, res) => {
    res.redirect('/dashboard');
  });


  app.get('/dashboard', checkLogin, (req, res) => {
    res.render('dashboard.ejs',{
      username: req.session.user.username,
      logged:"true",
      posts: req.session.user.posts,
    });
  });
  app.use('/dashboard', checkLogin, loginRedirect);


  app.delete('/user/:username', checkLogin, checkAccountOwnership, usersController.destroy, (req, res, next) => {
    res.status(200).send({ message: 'Account terminated successfully.'});
  });


  app.post('/post', checkLogin, postsController.create, usersController.fetchPosts, (req, res, next) => {
    res.redirect('/dashboard');
  });

  app.get('/post/:id/like', checkLogin, function(req, res, next){
    checkPostOwnership(req, res, next, true);
  }, likesController.create, usersController.fetchLikes, (req, res, next) => {
    res.sendStatus(201);
  });

  app.delete('/post/:id/like', checkLogin, function(req, res, next){
    checkPostOwnership(req, res, next, true);
  }, checkLikeOwnership, likesController.destroy, usersController.fetchLikes, (req, res, next) => {
    res.sendStatus(204);
  });


  app.get('/post/:id/dislike', checkLogin, function(req, res, next){
    checkPostOwnership(req, res, next, true);
  }, dislikesController.create, usersController.fetchDislikes, (req, res, next) => {
    res.sendStatus(201);
  });

  app.delete('/post/:id/dislike', checkLogin, function(req, res, next){
    checkPostOwnership(req, res, next, true);
  }, checkDislikeOwnership, dislikesController.destroy, usersController.fetchDislikes, (req, res, next) => {
    res.sendStatus(204);
  });

  app.delete('/post/:id', checkLogin, checkPostOwnership, deletePostInSession, postsController.destroy, (req, res, next) => {
    res.status(200).send({ message: 'Post deleted successfully.' });
  });
  app.use('/post', checkLogin, loginRedirect);


  function prepare(req, posts, method="findAll"){
    var hasUser;

    if (method==="findByPk") {
      hasUser = user => {
        if (user) {
          return user.id===req.session.user.id;
        } else {
          return false;
        }
      };
    } else {
      hasUser = user => {
        if (user) {
          return user.dataValues.id===req.session.user.id;
        } else {
          return false;
        }
      };
    }

    var sentPosts = [];
    console.log(posts);
    if (posts) {
      for (var i = 0; i < posts.length; i++) {
        console.log(posts[i].likedBys);
      // posts.forEach(post=>{
        var sentPost = {
          liked: (posts[i].likedBys.filter(hasUser).length!==0).toString(),
          disliked: (posts[i].dislikedBys.filter(hasUser).length!==0).toString(),
          id: posts[i].id,
          content: posts[i].content,
          likeCount: posts[i].likedBys.length.toString(),
          dislikeCount: posts[i].dislikedBys.length.toString(),
        };
        console.log(sentPost);
        sentPosts.push(sentPost);
      // });
      }
    }
    return sentPosts;
  }


  app.get('/corpus', checkLogin, usersController.list, (req, res, next) => {
    buffer = [];
    req.params.users.forEach(user => {
      var item = {
        username: user.username,
        posts: prepare(req, user.posts, "findAll"),
      };
      buffer.push(item);
    });
    res.render('corpus.ejs',{
      username: req.session.user.username,
      logged:"true",
      corpusFeed: buffer,
    });
  });
  app.use('/corpus', checkLogin, loginRedirect);


  app.get('/profile', checkLogin, (req, res) => {
    // console.log(req.session.user.likes);
    var posts = prepare(req,req.session.user.posts, "findByPk");
    var likedPosts = prepare(req,req.session.user.likes, "findByPk");
    var dislikedPosts = prepare(req,req.session.user.dislikes, "findByPk");

    res.render('profile.ejs',{
      username: req.session.user.username,
      logged:"true",
      name: req.session.user.name,
      affiliation: req.session.user.affiliation || "Not given",
      position: req.session.user.position || "Not given",
      posts: posts,
      likedPosts: likedPosts,
      dislikedPosts: dislikedPosts,
    });
  });
  app.use('/profile', checkLogin, loginRedirect);




  // app.use('/home', checkLogin, loginRedirect);

  // app.get('/api/users', usersController.list);
  // app.get('/api/users/:userId',usersController.retrieve);
  // app.post('/api/users/:userId/update', usersController.update);
  // app.post('/api/users/:userId/delete', usersController.destroy);
  //
  //
  // app.post('/api/users/:userId/post', postsController.create);
  // app.get('/api/users/:userId/posts', postsController.list);
  // app.get('/api/users/:userId/posts/:postId', postsController.retrieve);
  // app.post('/api/users/:userId/posts/:postId/update', postsController.update);
  // app.post('/api/users/:userId/posts/:postId/delete', postsController.destroy);

  // For any other request method on todo items, we're going to return "Method Not Allowed"
  // app.all('/api/todos/:todoId/items', (req, res) =>
  //   res.status(405).send({
  //     message: 'Method Not Allowed',
  // }));
};
