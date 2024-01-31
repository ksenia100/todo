import React, {Component} from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';
import './app.css';

export default class App extends Component {
   maxId = 100;
   
  state = {
    todoData:[
      this.createTodoItem(`Drink Coffee`),
      this.createTodoItem(`Make awesome app`),
      this.createTodoItem(`Have a lunch`),
    ],
    term: ``,
    filter: `all`
   };

   createTodoItem(label){
    return{
     label,
     important : false,
     done:false,
     id: this.maxId++
    }
   };

 deleteItem = (id) =>{
   this.setState(({todoData})=> {
   return{
    todoData: todoData.filter(element => element.id !== id)
   }
    })
 };

 addItem = (text) =>{
  const newItem = this.createTodoItem(text);
   this.setState(({ todoData })=>{
  return{ 
    todoData:[...todoData, newItem],
  };
  })
 };

 toggleProperty(arr, id, propName){
  this.setState(({todoData})=>{
    const idx = arr.findIndex((el) => el.id === id);
    const newItem = {...arr[idx], [propName]: !arr[idx][propName]};
    return{
      todoData: [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)]
    }
  }
  )
 }

 onToggleDone = (id) =>{
  this.setState(({todoData})=>{
  return{
    todoData: this.toggleProperty(todoData, id, `done`)
  }
})
 };

 onToggleImportant = (id) =>{
  this.setState(({todoData})=>{
    return{
      todoData: this.toggleProperty(todoData, id, `important`)
    }
  })
 }

 search (items, term){
  if(term.length === 0){
    return items;
  }
  return items.filter((item) =>{
    return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
  });
 };

onSearchChange = (term) =>{
  this.setState({ term })
};

onFilterChange = (filter) =>{
  this.setState({ filter })
};


filter(items, filter){
 switch(filter){
  case `all`: 
    return items;
  case `active`:
     return items.filter((item) => !item.done)
     case `done`:
      return items.filter((item) => item.done)
      default:
        return items;
  }
}

 render(){
  const { todoData, term, filter } = this.state;
  const visibleItems = this.filter(this.search(todoData, term), filter);
  return (
    <div className="todo-app">
      <AppHeader toDo={
        todoData.filter((el)=> !el.done).length
      }
       done={
        todoData.filter((el)=> el.done).length
       } />
      <div className="top-panel d-flex">
        <SearchPanel 
        onSearchChange= {this.onSearchChange}/>
        <ItemStatusFilter 
        filter = {filter} 
        onFilterChange = {this.onFilterChange}/>
      </div>

      <TodoList todos={visibleItems} 
      onDeleted = {this.deleteItem}
      onToggleImportant={this.onToggleImportant}
      onToggleDone={this.onToggleDone}/>
      <ItemAddForm onItemAdded ={this.addItem}/>
    </div>
  );
};
}