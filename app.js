const express = require("express");
const app = express();
const port = 3000;
const todos = require('./public/todos.json');
// app.use(express.static('public'))
const cors = require('cors');
const todosRouter = require('./Routes/todos.js');
app.use(cors());
app.use(express.json());

app.use('/', express.static('public'))

// GET endpoint to retrieve all todos

app.get('/todos', (req, res) => {
    res.status(200).json(todos);
    
  });

  function validateTodoId(req, res, next) {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    req.todo = todo;
    next();
  }
  app.delete('/todos/:id', validateTodoId, (req, res) => {
    const index = todos.findIndex(todo => todo.id === req.todo.id);
    todos.splice(index, 1);
    res.status(200).send(`todo that have id= ${req.todo.id} deleted `);
  });
  function validateTask(req, res, next) {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Task title and description are required" });
    }
    next();
  }
  app.post('/todos', validateTask, (req, res) => {
    const newTodo = {
      id: todos.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  app.put('/todos/:id', validateTodoId, validateTask, (req, res) => {
    req.todo.completed = req.body.completed;
    req.todo.title = req.body.title;
  req.todo.description = req.body.description;
    res.status(200).json(req.todo);
  });



//advanced part 


// Mount the todos router
// app.use('/todos', todosRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
