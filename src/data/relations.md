### ENTITIES

 - user
 - task
 - category
 

### RELATION: USER - TASK

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

### RELATION: USER - CATEGORY

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

### RELATION: CATEGORY - TASK
 
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
