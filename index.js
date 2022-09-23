//display function

const render = (tmp, element) => {
  element.innerHTML = tmp;
};

const generateTodoItem = (todo) => {
  let todoClassName = todo.completed ? "completed" : "active";

  return `
        <div class=${todoClassName}>
        <p id='li${todo?.id}'>${todo?.title}</p>
        <div id = 'btn-div'>
        <button class='edit-btn' name=${todo?.id} id="editBtn">
        Edit
        </button>
        <button class='delete-btn' name=${todo?.id} id="deleteBtn">
        Delete
        </button>
        </div>
        </div>
    `;
};

const renderTodos = (posts, element) => {
  let compArr = [];
  const tmp = posts
    .map((post) => {
      if (post.completed) {
        compArr.push(post);
      } else {
        return generateTodoItem(post);
      }
    })
    .join("");

  if (compArr.length > 0) {
    let element = document.querySelector(".completed-todo-container");
    let test = compArr
      .map((post) => {
        return generateTodoItem(post);
      })
      .join("");
    render(test, element);
  }
  render(tmp, element);
};
// Our todo model and state model
class ToDo {
  constructor(task, completed) {
    this.title = task;
    this.completed = completed;
  }
}
class State {
  constructor() {
    this._active_todos = [];
  }
  get activeTodos() {
    return this._active_todos;
  }

  set activeTodos(activeTodo) {
    this._active_todos = [...activeTodo];

    const activeTaskContainer = document.querySelector(
      ".uncompleted-todo-conatiner"
    );
    renderTodos(this._active_todos, activeTaskContainer);
  }
}

//api calls listed

const Todo = (() => {
  const BASE_URL = "http://localhost:3000";
  const todoPath = "todos";
  const fetchTodo = async () => {
    const todosEndPoint = [BASE_URL, todoPath].join("/");
    return await fetch(todosEndPoint)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  const addTodo = async (data) => {
    const addTodoEndPoint = [BASE_URL, todoPath].join("/");
    return fetch(addTodoEndPoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  };
  const deleteTodo = async (id) => {
    const deleteTodoEndPoint = [BASE_URL, todoPath, `${id}`].join("/");
    return fetch(deleteTodoEndPoint, { method: "DELETE" }).then(() =>
      console.log("deleted")
    );
  };
  return { fetchTodo, addTodo, deleteTodo };
})();

// start states and alleventListeners

const Starter = () => {
  const state = new State();
  console.log(state);
  const init = () => {
    Todo.fetchTodo().then((data) => {
      state.activeTodos = data;
    });
  };
  const addTodo = () => {
    const inputValue = document.querySelector(".todo-input");
    const addButton = document.querySelector(".button-submit");
    console.log(inputValue);
    addButton.addEventListener("click", (event) => {
      event.preventDefault();
      const activeTodo = new ToDo(inputValue.value, false);
      Todo.addTodo(activeTodo).then((data) => {
        state._active_todos = [data, ...state._active_todos];
      });
    });
  };
  const deleteTodo = () => {
    const container = document.querySelector(".todo-container");
    container.addEventListener("click", (e) => {
      if (e.target.id === "deleteBtn") {
        e.preventDefault();
        Todo.deleteTodo(e.target.name).then((data) => console.log(data));
      }
    });
  };
  init();
  addTodo();
  deleteTodo();
};

Starter();
console.log(Todo);
