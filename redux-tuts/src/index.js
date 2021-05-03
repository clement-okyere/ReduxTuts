import React from 'react';
import ReactDOM from 'react-dom';
import { } from 'redux';
import './index.css';
import { applyMiddleware , combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import logger, { CreateLogger } from 'redux-logger';
//import App from './App';
import reportWebVitals from './reportWebVitals';

const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';
const ASSIGNED_TO_CHANGE = 'ASSIGNED_TO_CHANGE'

const todos = [
  {
    id: "0",
    name: "learn redux",
    completed: true,
    assignedTo: {
      id: "99",
      name: "Dan Abramov",
    },
  },
  {
    id: "1",
    name: "create mobx",
    completed: true,
    assignedTo: {
      id: "77",
      name: "Michael Westrate",
    },
  }
];



function todoReducer(state = todos, action) {
  switch (action.type) {
    case TODO_ADD:
      return applyAddTodo(state, action);

    case TODO_TOGGLE:
      return applyToggleTodo(state, action);

    case ASSIGNED_TO_CHANGE:
      return applyChangeAssignedTo(state, action);

    default:
      return state;
  }
}

function applyAddTodo(state, action) {
 const todo = { ...action.todo, completed: false };
 const newTodos = [...todos, todo];
 return newTodos;
}

function applyToggleTodo(state, action) {
  return state.map(todo =>
    todo.id === action.todo.id
      ? {...todo, completed: !todo.completed}
      : todo
  );
}

function applyChangeAssignedTo(state, action) {
   return state.map((todo) => {
     if (todo.id === action.payload.todoId) {
       const assignedTo = { ...todo.assignedTo, name: action.payload.name };
       return { ...todo, assignedTo };
     } else {
       return todo;
     }
   });
}

function filterReducer(state = "SHOW_ALL", action) {
  switch (action.type) {
    case FILTER_SET:
      return applySetFilter(state, action);
    
    default:
      return state;
  }
}

function applySetFilter(state, action) {
  return action.filter;
}


//action creators
function doAddTodo(id, name) {
  return {
    type: TODO_ADD,
    todo: {id, name}
  }
}

function doToggleTodo(id) {
  return {
    type: TODO_TOGGLE,
    todo: { id }
 }
}

function doSetFilter(filter) {
  return {
    type: FILTER_SET,
    filter
  }
}

//store
const rootReducer = combineReducers({
  todoState: todoReducer,
  filterState: filterReducer
});

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(logger)
);



const TodoApp = ({todos, onToggleTodo}) => (
  <ConnectedTodoList
  />
)

const TodoList = ({ todos }) => {
  return (
    <div>
       {todos.map(todo => (
        <ConnectedTodoItem
          key={todo.id}
          todo={todo}
        />
       ))}
    </div>
  );
}

const TodoItem = ({ todo, onToggleTodo }) => {
  const { name, id, completed } = todo;
  return (
    <div>
      {name}
      <button
        type="button"
        onClick={() => onToggleTodo(id)}>
         {completed ? "Incomplete" : "Complete"}
        </button>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    todos: state.todoState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleTodo: id => dispatch(doToggleTodo(id))
  }
}

const ConnectedTodoApp = connect(mapStateToProps, mapDispatchToProps)(TodoApp);
const ConnectedTodoList = connect(mapStateToProps)(TodoList);
const ConnectedTodoItem = connect(null, mapDispatchToProps)(TodoItem);

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ConnectedTodoApp
        />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  )

store.dispatch({
  type: ASSIGNED_TO_CHANGE,
  payload: {
    todoId: "0",
    name: "Dan Abramov and Andrew Clark",
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
