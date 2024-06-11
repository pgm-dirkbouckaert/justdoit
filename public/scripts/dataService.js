import { API_URL } from "./consts.js";

const useFetch = async (url, options) => {
  try {
    const res = await fetch(url, options);
    if (res.status === 200 || res.status === 201) {
      return await res.json();
    } else {
      console.error(res.status, res.statusText);
      const json = await res.json();
      return { error: json.message };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default {
  // CATEGORIES
  createCategory: async (name, userId) => {
    const newCategory = await useFetch(`${API_URL}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, userId }),
    });
    return newCategory;
  },
  updateCategory: async (categoryId, categoryName) => {
    const updatedCategory = await useFetch(`${API_URL}/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: categoryId, name: categoryName }),
    });
    return updatedCategory;
  },
  deleteCategory: async (id) => {
    const deleted = await useFetch(`${API_URL}/category/${id}`, {
      method: "DELETE",
    });
    return deleted;
  },
  // TASKS
  createTask: async (task, userId) => {
    const newTask = await useFetch(`${API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ task, userId }),
    });
    return newTask;
  },
  setTaskAsDone: async (taskId) => {
    const updatedTask = await useFetch(`${API_URL}/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ done: true }),
    });
    return updatedTask;
  },
  setTaskAsTodo: async (taskId) => {
    const updatedTask = await useFetch(`${API_URL}/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ done: false }),
    });
    return updatedTask;
  },
  saveTask: async (taskId, description) => {
    const updatedTask = await useFetch(`${API_URL}/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ description }),
    });
    return updatedTask;
  },
  deleteTask: async (id) => {
    const deleted = await useFetch(`${API_URL}/task/${id}`, {
      method: "DELETE",
    });
    return deleted;
  },
  saveSortOrder: async (sortOderObj) => {
    const sortOrder = await useFetch(`${API_URL}/task/sortorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/Json",
      },
      body: JSON.stringify(sortOderObj),
    });
    return sortOrder;
  },
  // THEME
  saveTheme: async (theme) => {
    const result = await useFetch(`${API_URL}/theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ theme }),
    });
    return result;
  },
};
