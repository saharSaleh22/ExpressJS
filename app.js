const express = require("express");
const app = express();
const port = 3000;
const todos = require('./public/todos.json');
// app.use(express.static('public'))

const todosRouter = require('./Routes/todos.js');


app.use('/', express.static('public'))

// GET endpoint to retrieve all todos

app.get('/todos', (req, res) => {
    res.status(200).json(todos);
    
  });


  app.delete('/todos', (req, res) => {
    if (todos.length === 0) {
        res.status(422).send('No todos available for deletion');
      }
      else{
          const index = Math.floor(Math.random() * todos.length);
    const deletedTodo = todos.splice(index, 1)[0];
    res.status(200).send(`Todo with id ${deletedTodo.id} (${deletedTodo.title}) has been deleted`);
      }
  
  });


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.post('/', (req, res) => {
    res.send('Got a POST request')
  })
app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
  })

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
  })



//advanced part 

app.use(express.json());

// Mount the todos router
app.use('/todosAdvanced', todosRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
