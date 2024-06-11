# Opdracht 1: Just DO IT

Project by Dirk Bouckaert<br>
Programmeren 3<br>
Graduaat Programmeren Arteveldehogeschool 2022<br>

## Introduction
Just Do IT is a simple todo application with basic CRUD actions. Once authenticated you can create tasks and sort them by dragging. You can edit your tasks, mark them as done (and restore them as todo) or delete them. Each task belongs to a category. You can create, edit and delete categories. On the profile page you can edit your name and email, and you can change your password.

## Online Demo
[https://gcp.dirkb.cyou:3000](https://gcp.dirkb.cyou:3000)

## Installation
- Download or clone the Git repository.
- Copy `.env-example`to `.env` and add `TOKEN_SALT`. 
- For demo purposes the `sqlite` file has already been provided (in the `src/data` folder). 
  - If you wish, you can delete the sqlite-file before installation. A new one will be created, this way you start with a clean slate. 
  - You can also change the database type and/or name in the ```.env``` file to use your own.
- Make sure you have Node and npm installed.
- Run ```npm install```
- Run ```npm run start:dev```
- The application will be served on [http://localhost:3000/](http://localhost:3000/)
- You can register and start using the app. 
- If you haven't changed the database source, you can use the following test account to explore the app:
  - username: tim@example.com
  - password: artevelde

## Feature Overview
- Authentication
  - registration page
  - login page
  - validation (valid email, password length)
- One page application for task managemenet
  - add, edit and delete categories
  - add, edit and delete tasks
  - sort tasks
  - mark tasks as done (or restore them as todo)
- Profile page
  - edit profile (first name, last name, email)
  - change password
- Layout
  - Dark and light theme
- Swagger API docs 
  - only for local installation
  - available at endpoint /api-docs

## Technologies
- NodeJS and Express
- Template engine: Handlebars
- Database: TypeORM with sqlite3 (using bcrypt to encrypt and decrypt passwords)
- Authentication: JSON Web Token
- Form validation: express validator
- HTML, CSS and Javascript, e.g.
  - dataService for managing tasks (no page reload)

## TypeORM Entities and Relations

### Entities

 - User
 - Task
 - Category
 

### Relation: User - Task

- one-to-many / many-to-one
- A user can have multiple tasks.
- There are multiple tasks that belong to one user.

```
// User.js
relations: {
  tasks: {
    target: "Task",
    type: "one-to-many",
    inverseSide: "user",
    cascade: true,
  },
},
```

```
// Task.js
relations: {
  user: {
    target: "User",
    type: "many-to-one",
    inverseSide: "tasks",
    joinColumn: { name: "userId"}
    onDelete: "CASCADE",
  },
},
```

### Relation: User - Category

 - one-to-many / many-to-one
 - A user can have multiple categories.
 - There are multiple categories that belong to one user.

```
// User.js
relations: {
  categories: {
    target: "Category",
    type: "one-to-many",
    inverseSide: "user",
    cascade: true,
  },
},
```

```
// Category.js
relations: {
  user: {
    target: "User",
    type: "many-to-one",
    inverseSide: "categories",
    joinColumn: { name: "user_id"}
    onDelete: "CASCADE",
  },
},
```

### Relation: Category - Task
 
 - one-to-many / many-to-one
 - A category can contain multiple tasks.
 - There are multiple tasks that belong to one category.

```
// Category.js
relations: {
  tasks: {
    target: "Task",
    type: "one-to-many",
    inverseSide: "category",
    cascade: true,
  },
},
```

```
// Task.js
relations: {
  category: {
    target: "Category",
    type: "many-to-one",
    inverseSide: "tasks",
    joinColumn: { name: "categodry_id"}
    onDelete: "CASCADE",
  },
},
```

## Author
Dirk Bouckaert<br>
With the kind help and guidance of his teachers: 
- Frederick Roegiers
- Tim De Paepe
