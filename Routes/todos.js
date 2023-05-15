const express = require('express');
const router = express.Router();
const todos = require('../public/todos.json');


// Middleware to validate if the todo ID exists
function validateTodoId(req, res, next) {
  const todoId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  req.todo = todo;
  next();
}

// Middleware to validate task title and description
function validateTask(req, res, next) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Task title and description are required" });
  }
  next();
}

// GET /todos: List all todos
// router.get('/', (req, res) => {
//   res.status(200).json(todos);
// });

// GET /todos: List all todos with pagination
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10 todos per page
    const skip = parseInt(req.query.skip) || 0;
  
    const paginatedTodos = todos.slice(skip, skip + limit);
  
    res.status(200).json({
      total: todos.length,
      limit,
      skip,
      data: paginatedTodos
    });
  });

  
// GET /todos/:id: Show a single todo
router.get('/:id', validateTodoId, (req, res) => {
  res.status(200).json(req.todo);
});

// DELETE /todos/:id: Delete a single todo
router.delete('/:id', validateTodoId, (req, res) => {
  const index = todos.findIndex(todo => todo.id === req.todo.id);
  todos.splice(index, 1);
  res.status(200).send(`todo that have id= ${req.todo.id} deleted `);
});

// POST /todos: Create a single todo
router.post('/', validateTask, (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id: Update a single todo
router.put('/:id', validateTodoId, validateTask, (req, res) => {
  req.todo.title = req.body.title;
  req.todo.description = req.body.description;
  res.status(200).json(req.todo);
});

module.exports = router;
