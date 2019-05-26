const usersController = require('../controllers').users;
const postsController = require('../controllers').posts;


module.exports = (app, checkLogin, loginRedirect, continueWithNoLogin) => {
  // app.get('/api', (req, res) => res.status(200).send({
  //   message: 'Welcome to the Todos API!',
  // }));


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


  app.post('/post', checkLogin, postsController.create, (req, res, next) => {
    res.redirect('/dashboard');
  });
  app.delete('/post/:id', checkLogin, postsController.destroy, (req, res, next) => {
    for (var i = 0; i < req.session.user.posts.length; i++) {
      if (req.session.user.posts[i].id===parseInt(req.params.id)) {
        req.session.user.posts.splice(i,1);
        break;
      }
    }
    res.status(200).send({ message: 'Post deleted successfully.' });
  });
  app.use('/post', checkLogin, loginRedirect);


  app.get('/corpus', checkLogin, usersController.list, (req, res, next) => {
    res.render('corpus.ejs',{
      username: req.session.user.username,
      logged:"true",
      corpusFeed: req.session.corpusFeed,
    });
  });
  app.use('/corpus', checkLogin, loginRedirect);


  app.get('/profile', checkLogin, (req, res) => {
    res.render('profile.ejs',{
      username: req.session.user.username,
      logged:"true",
      name: req.session.user.name,
      affiliation: req.session.user.affiliation || "Not given",
      position: req.session.user.position || "Not given",
      posts: req.session.user.posts,
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
