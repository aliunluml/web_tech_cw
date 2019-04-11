const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;


module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.post('/api/todos', todosController.create);
  app.get('/api/todos', todosController.list);
  app.get('/api/todos/:todoId',todosController.retrieve);
  app.post('/api/todos/:todoId/update', todosController.update);
  app.post('/api/todos/:todoId/delete', todosController.destroy);


  app.post('/api/todos/:todoId/items', todoItemsController.create);

  //Yet TODO
  // app.get('/api/todos/:todoId/items', todoItemsController.list);
  // app.get('/api/todos/:todoId/items/:todoItemId',todoItemsController.retrieve);

  //These 2 have not been tested yet.
  app.post('/api/todos/:todoId/items/:todoItemId/update', todoItemsController.update);
  app.post('/api/todos/:todoId/items/:todoItemId/delete', todoItemsController.destroy);

  // For any other request method on todo items, we're going to return "Method Not Allowed"
  app.all('/api/todos/:todoId/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));
};

};
