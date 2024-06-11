import dataService from "./dataService.js";
import { BASE_URL } from "./consts.js";

(() => {
  const app = {
    init() {
      this.savingTask = false;
      this.currentCategoryName = document.getElementById("currentCategoryName").value;
      this.currentCategoryId = document.getElementById("currentCategoryId").value;
      // Cache elements
      this.cacheElements();
      // Set sortable lists
      this.setSortable();
      // Modal
      this.$modal = document.getElementById("modal");
      this.$modalOutput = document.getElementById("modal-output");
      this.$btnCloseModal = document.getElementById("btn-close-modal");
      this.listenForCloseModal();
      // Categories
      this.scrollIntoCategoryList(this.currentCategoryId);
      this.listenForShowAddCategory();
      this.listenForAddCategory();
      this.listenForShowEditCategory();
      this.listenForEditCategory();
      this.listenForCancelEditCategory();
      this.listenForDeleteCategory();
      // Tasks
      setInterval(() => {
        this.checkUnsavedTasks();
      }, 1000 * 60);
      this.listenForAddTask();
      this.listenForTaskActions();
    },
    cacheElements() {
      // Categories
      this.$categoryList = document.getElementById("category-list");
      this.$btnShowAddCategory = document.getElementById("btn-add-category");
      this.$formAddCategory = document.getElementById("form-add-category");
      this.$inputAddCategory = document.getElementById("input-add-category");
      this.$formEditCategory = document.getElementById("form-edit-category");
      this.$inputCategoryId = document.getElementById("edit-category-id");
      this.$inputCategoryName = document.getElementById("edit-category-name");
      this.$btnCancelEditCategory = document.getElementById("btn-cancel-edit-category");
      // Tasks
      this.$formAddTask = document.getElementById("form-add-task");
      this.$todoList = document.getElementById("todo-list");
      this.$todoListTitle = document.getElementById("todo-list-title");
      this.$doneList = document.getElementById("done-list");
      this.$doneListTitle = document.getElementById("done-list-title");
      this.$alertUnsaved = document.getElementById("alert-unsaved");
    },
    /**
     * Set sortable todo list
     */
    async setSortable() {
      const sortOrderName = `todoList-${this.currentCategoryId}`;
      Sortable.create(this.$todoList, {
        group: sortOrderName,
        handle: ".handle",
        animation: 250,
        store: {
          set: (sortable) => {
            const order = sortable.toArray();
            this.$todoList.setAttribute("value", order);
            dataService.saveSortOrder(this.getSortOrderObjFromDOM());
          },
        },
      });
    },
    getSortOrderObjFromDOM() {
      const sortOrderObj = [];
      const listItems = this.$todoList.children;
      for (const [index, item] of Array.from(listItems).entries()) {
        const taskId = parseInt(item.dataset.taskId);
        sortOrderObj.push({ taskId, sortOrder: index });
      }
      return sortOrderObj;
    },
    /**
     * Modal listeners
     */
    listenForCloseModal() {
      this.$btnCloseModal.addEventListener("click", () => {
        this.closeModal();
      });
    },
    /**
     * Category listeners
     */
    listenForShowAddCategory() {
      this.$btnShowAddCategory.addEventListener("click", () => {
        this.toggleFormAddCategory();
      });
    },
    listenForAddCategory() {
      this.$formAddCategory.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Get data
        const formData = new FormData(this.$formAddCategory);
        const name = formData.get("name");
        const userId = formData.get("userId");
        // Update database
        const newCategory = await dataService.createCategory(name, userId);
        if (newCategory.error) return this.showModal(newCategory.error);
        // Update UI
        this.toggleFormAddCategory();
        this.$categoryList.innerHTML += this.renderCategoryListItem(newCategory);
        window.location = `${BASE_URL}/${newCategory.name}`;
      });
    },
    listenForShowEditCategory() {
      const buttons = document.querySelectorAll(".btn-edit-category");
      for (const btn of buttons) {
        btn.addEventListener("click", (e) => {
          if (this.$formEditCategory.classList.contains("visible")) {
            this.toggleFormEditCategory();
          } else {
            const categoryId = e.currentTarget.dataset.categoryId;
            const categoryName = e.currentTarget.dataset.categoryName;
            this.toggleFormEditCategory(categoryId, categoryName);
          }
        });
      }
    },
    listenForEditCategory() {
      this.$formEditCategory.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Get data
        const formdata = new FormData(this.$formEditCategory);
        const categoryId = formdata.get("categoryId");
        const categoryName = formdata.get("categoryName");
        // Update database
        const updatedCategory = await dataService.updateCategory(categoryId, categoryName);
        if (updatedCategory.error) return this.showModal(updatedCategory.error);
        // Update UI
        this.toggleFormEditCategory();
        document.getElementById(`category-${categoryId}`).firstElementChild.innerText = categoryName;
        history.replaceState(null, null, categoryName);
        document.getElementById(`btn-edit-category-${categoryId}`).dataset.categoryName = categoryName;
      });
    },
    listenForCancelEditCategory() {
      this.$btnCancelEditCategory.addEventListener("click", () => {
        this.toggleFormEditCategory();
      });
    },
    listenForDeleteCategory() {
      const buttons = document.querySelectorAll(".btn-delete-category");
      for (const btn of buttons) {
        btn.addEventListener("click", async (e) => {
          // Get category ID and render modal for confirmation
          const categoryId = e.currentTarget.dataset.categoryId;
          this.showModal(this.renderFormDeleteCategory(categoryId));
          // Listen for confirmation
          document.getElementById("form-delete-category").addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(document.getElementById("form-delete-category"));
            const categoryId = formData.get("categoryId");
            this.deleteCategory(categoryId);
          });
          // Listen for cancel
          document.getElementById("form-delete-cancel").addEventListener("click", () => {
            this.closeModal();
          });
        });
      }
    },
    /**
     * Task listeners
     */
    listenForAddTask() {
      this.$formAddTask.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(this.$formAddTask);
        const userId = formData.get("userId");
        const task = {
          description: formData.get("description"),
          category: { name: formData.get("category") },
        };
        const addedTask = await dataService.createTask(task, userId);
        if (addedTask.error) return this.showModal(addedTask.error);
        this.$formAddTask.reset();
        this.$todoList.innerHTML += this.renderTodoListItem(addedTask);
        this.listenForTaskActions(".todo-list");
        this.toggleTitles();
      });
    },
    listenForTaskActions(parentClass = null) {
      const buttons = document.querySelectorAll(`${parentClass ? `${parentClass}` : ""} .btn-action`);
      for (const btn of buttons) {
        btn.addEventListener("click", (e) => {
          const taskId = e.currentTarget.dataset.taskId;
          const action = e.currentTarget.dataset.action;
          switch (action) {
            case "done":
              return this.setTaskAsDone(taskId);
            case "restore":
              return this.setTaskAsTodo(taskId);
            case "edit":
              return this.editTask(taskId, e.currentTarget.dataset.taskDescription);
            case "delete":
              return this.deleteTask(taskId);
          }
        });
      }
    },
    /**
     * Renderers
     */
    renderCategoryListItem(category) {
      return `
        <li id="category-${category.id}">
          <a href="/${category.name}">${category.name}</a>
        </li>`;
    },
    renderFormDeleteCategory(categoryId) {
      return `
        Are you sure you want to delete this category?<br>
        All tasks will also be deleted.
        <form id="form-delete-category" class="form-delete-category">
          <input type="hidden" name="categoryId" value="${categoryId}" />
          <button type="submit" class="hover">Yes</button>
          <button type="button" id="form-delete-cancel" class="hover">Cancel</button>
        </form>
      `;
    },
    renderTodoListItem(task) {
      return `
        <li id="todo-${task.id}" data-task-id="${task.id}">
          <div class="todo-handle hover">
            <i class="fa-solid fa-up-down-left-right handle"></i>
          </div>
          <div class="todo-done hover">
            <i class="fa-solid fa-check btn-done btn-action" data-action="done" data-task-id="${task.id}"></i>
          </div>
          <div class="todo-text" id="todo-text-${task.id}">${task.description}</div>
          <div class="todo-edit hover">
            <i class="fa-solid fa-pen-to-square btn-edit btn-action" data-action="edit" data-task-id="${task.id}" data-task-description="${task.description}"></i>
          </div>
          <div class="todo-delete hover">
            <i class="fa-regular fa-trash-can btn-delete btn-action" data-action="delete" data-task-id="${task.id}"></i>
          </div>
        </li>`;
    },
    renderDoneListItem(task) {
      return `
        <li id="todo-${task.id}">
          <div class="done-text">${task.description}</div>
          <div class="done-restore hover">
            <i class="fa-solid fa-rotate-right btn-restore btn-action" data-action="restore" data-task-id="${task.id}"></i>
          </div>
          <div class="done-delete hover">
            <i class="fa-regular fa-trash-can btn-delete btn-action" data-action="delete" data-task-id="${task.id}" ></i>
          </div>
        </li>`;
    },
    /**
     * Utils
     */
    scrollIntoCategoryList(id) {
      if (this.$categoryList.clientHeight === 128) document.getElementById(`category-${id}`).scrollIntoView({ behavior: "smooth" });
    },
    toggleFormEditCategory(categoryId = "", categoryName = "") {
      this.$formEditCategory.classList.toggle("visible");
      this.$inputCategoryId.value = categoryId;
      this.$inputCategoryName.value = categoryName;
    },
    toggleFormAddCategory() {
      this.$formAddCategory.classList.toggle("visible");
      this.$btnShowAddCategory.classList.toggle("form-visible");
      this.$inputAddCategory.value = "";
    },
    toggleTitles() {
      // Todo list
      if (this.$todoList.childElementCount === 0) this.$todoListTitle.classList.add("hidden");
      else this.$todoListTitle.classList.remove("hidden");
      // Done list
      if (this.$doneList.childElementCount === 0) this.$doneListTitle.classList.add("hidden");
      else this.$doneListTitle.classList.remove("hidden");
    },
    /**
     * Modal actions
     */
    showModal(msg) {
      document.body.classList.add("modal-visible");
      this.$modal.classList.add("visible");
      this.$modalOutput.innerHTML = msg;
    },
    closeModal() {
      this.$modal.classList.remove("visible");
      this.$modalOutput.innerHTML = "";
      document.body.classList.remove("modal-visible");
    },
    /**
     * Category actions
     */
    async deleteCategory(categoryId) {
      // Update database
      const deleted = await dataService.deleteCategory(categoryId);
      if (deleted.error) return this.showModal(deleted.error);
      // Update UI
      window.location = BASE_URL;
    },
    /**
     * Task actions
     */
    async setTaskAsDone(taskId) {
      // Update database
      const updatedTask = await dataService.setTaskAsDone(taskId);
      // Update UI
      if (updatedTask) {
        document.getElementById(`todo-${taskId}`).remove();
        this.$doneList.innerHTML += this.renderDoneListItem(updatedTask);
        this.listenForTaskActions(".done-list");
        this.toggleTitles();
      }
    },
    async setTaskAsTodo(taskId) {
      // Update database
      const updatedTask = await dataService.setTaskAsTodo(taskId);
      // Update UI
      if (updatedTask) {
        document.getElementById(`todo-${taskId}`).remove();
        this.$todoList.innerHTML += this.renderTodoListItem(updatedTask);
        this.listenForTaskActions(".todo-list");
        this.toggleTitles();
      }
    },
    editTask(taskId, oldDescription) {
      const $todoText = document.getElementById(`todo-text-${taskId}`);
      $todoText.classList.add("unsaved");
      $todoText.setAttribute("contentEditable", true);
      $todoText.focus({ focusVisible: true });
      $todoText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          $todoText.removeAttribute("contentEditable");
          $todoText.blur(); // lose focus
          return this.saveTask(taskId);
        }
        if (e.key === "Escape") {
          $todoText.removeAttribute("contentEditable");
          $todoText.blur(); // lose focus
          document.getElementById(`todo-text-${taskId}`).innerText = oldDescription;
          $todoText.classList.remove("unsaved");
        }
      });
    },
    async saveTask(taskId) {
      if (this.savingTask) return;
      if (!this.savingTask) {
        this.savingTask = true;
        const newDescription = document.getElementById(`todo-text-${taskId}`).innerText;
        const updatedTask = await dataService.saveTask(taskId, newDescription);
        if (updatedTask.error) return this.showModal(updatedTask.error);
        this.savingTask = false;
        document.getElementById(`todo-text-${taskId}`).classList.remove("unsaved");
        this.checkUnsavedTasks();
        this.toggleTitles();
      }
    },
    async deleteTask(taskId) {
      // Update database
      const deleted = await dataService.deleteTask(taskId);
      if (deleted.error) return this.showModal(deleted.error);
      // Update UI
      document.getElementById(`todo-${taskId}`).remove();
      this.toggleTitles();
    },
    checkUnsavedTasks() {
      const unsaved = document.querySelectorAll(".todo-text.unsaved");
      if (unsaved.length > 0) this.$alertUnsaved.classList.remove("not-visible");
      else this.$alertUnsaved.classList.add("not-visible");
    },
    alertUnsavedTasks() {
      this.showModal("You have unsaved tasks. They are colored red. Click the pencil, edit the description and then make sure to push 'Enter'.");
    },
  };
  app.init();
})();
