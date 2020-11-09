const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

/* Middleware que intercepta requisições que necessita verificar se o ID passado 
como parametro é um id válido */

function repositoryIdValidate(request, response, next){

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "repository not found"})
  }

  return next();

}


const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});


app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)

});



app.put("/repositories/:id",repositoryIdValidate, (request, response) => {

  const {title, url, techs} = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex (repository => repository.id == id);

  repositories[repositoryIndex] = {...repositories[repositoryIndex], title, url, techs}

    
  return response.status(200).json(repositories[repositoryIndex])
   
});


app.delete("/repositories/:id", repositoryIdValidate,  (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex (repository => repository.id == id);
 
  repositories.splice(repositoryIndex,1);
 
  return response.status(204).json();  
 
});


app.post("/repositories/:id/like", repositoryIdValidate, (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  const likes = repositories[repositoryIndex].likes+1;
  console.log(likes)

  repositories[repositoryIndex] = {...repositories[repositoryIndex], likes: likes}

  return response.status(201).json(repositories[repositoryIndex]);
});


module.exports = app;
