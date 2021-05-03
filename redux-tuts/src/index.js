import React from 'react';
import ReactDOM from 'react-dom';
import { } from 'redux';
import './index.css';
import { combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
//import App from './App';
import reportWebVitals from './reportWebVitals';

const TODO_ADD = 'TODO_ADD';
const TODO_TOGGLE = 'TODO_TOGGLE';
const FILTER_SET = 'FILTER_SET';

const todos = [
  { id: '0', name: 'learn redux' },
  {id: '1', name: 'learn mobx'}
]

function TodoReducer(state = todos, action) {
  console.log("todoReducer triggered!", action.type);
  switch (action.type) {
    case TODO_ADD:
      return applyAddTodo(state, action);

    case TODO_TOGGLE:
      return applyToggleTodo(state, action);
    
    default: return state;
  }
}

function applyAddTodo(state, action) {
  const todo = Object.assign({}, action.todo, { completed: false });
  return state.concat(todo);
}

function applyToggleTodo(state, action) {
  console.log("apply toggle triggered!!", state);
  return state.map(todo =>
    todo.id === action.todo.id
      ? Object.assign({}, todo, { completed: !todo.completed })
      : todo
  );
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
  todoState: TodoReducer,
  filterState: filterReducer
});

const store = createStore(rootReducer);

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
  console.log("todo", todo);
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



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
