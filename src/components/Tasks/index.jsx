import React from "react";
// import styles
import "./Tasks.scss";
//import edit icon
import editSvg from "../../assets/img/edit.svg";
//import library for working with requests
import axios from "axios";
//import AddTaskForm component
import AddTaskForm from "./AddTaskFrom";
//import Task item component
import Task from "./Task";
// import library  for creating route links to components
import { Link } from "react-router-dom";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
  withoutEmpty,
}) => {
  //function that changes title of list
  const editTitle = () => {
    //takes title text value from user
    const newTitle = window.prompt("Name of list", list.name);
    //function that changes title will only work in case if user еntered new name
    if (newTitle) {
      onEditTitle(list.id, newTitle);
      //updates list's title on Back-end
      axios
        .patch("http://localhost:3001/lists/" + list.id, {
          name: newTitle,
        })
        .catch(() => {
          alert("Cant update item title");
        });
    }
  };

  return (
    <div className="tasks">
      <Link to={`/lists/${list.id}`}>
        <h2 style={{ color: list.color.hex }} className="tasks__title">
          {list.name}
          {/* Edit list name button */}
          <img onClick={editTitle} src={editSvg} alt="edit icon" />
        </h2>
      </Link>

      <div className="tasks__items">
        {/* if there is no tasks in list item displays text */}
        {!withoutEmpty && list.tasks && !list.tasks.length && (
          <h2>There are no tasks</h2>
        )}
        {list.tasks &&
          list.tasks.map((task) => (
            <Task
              key={task.id}
              list={list}
              onEdit={onEditTask}
              onRemove={onRemoveTask}
              onComplete={onCompleteTask}
              {...task}
            />
          ))}
      </div>
      <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
    </div>
  );
};

export default Tasks;
