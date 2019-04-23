const usersController = require('../controllers').users;
const postsController = require('../controllers').posts;


module.exports = (app) => {
  // app.get('/api', (req, res) => res.status(200).send({
  //   message: 'Welcome to the Todos API!',
  // }));

  app.post('/signup', usersController.eligible, usersController.create, (req, res) => {
    res.redirect('/dashboard');
  });

  app.post('/login', usersController.match, (req, res) => {
    res.redirect('/dashboard');
  });

  function checkLogin(req, res, next){
     if(req.session.user){
       next();     //If session exists, proceed to page
     }
     else{
       var err = new Error("Not logged in!");
       next(err);  //Error, trying to access unauthorized page!
     }
  }

  function loginRedirect(err, req, res, next) {
    console.log(err);
    res.redirect('/login');
  }

  app.get('/dashboard', checkLogin, (req, res) => {
    res.render('dashboard.ejs',{
      name: req.session.user.name,
      affiliation: req.session.user.affiliation,
      position: req.session.user.position,
      posts: req.session.user.posts,
    });
  });
  app.use('/dashboard', checkLogin, loginRedirect);




  app.post('/post', checkLogin, postsController.create, (req, res, next) => {
    res.redirect('/dashboard');
  });
  app.use('/post', checkLogin, loginRedirect);




  app.get('/corpus', checkLogin, usersController.list, (req, res, next) => {
    res.render('corpus.ejs',{
      name: req.session.user.name,
      affiliation: req.session.user.affiliation,
      position: req.session.user.position,
      posts: req.session.user.posts,
      corpusFeed: req.session.corpusFeed,
    });
  });
  app.use('/corpus', checkLogin, loginRedirect);




  app.get('/profile', checkLogin, (req, res) => {
    res.render('profile.ejs',{
      name: req.session.user.name,
      affiliation: req.session.user.affiliation,
      position: req.session.user.position,
      posts: req.session.user.posts,
      corpusFeed: req.session.corpusFeed,
    });
  });
  app.use('/profile', checkLogin, loginRedirect);




  app.use('/home', checkLogin, loginRedirect);

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
