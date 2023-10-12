//import React for Creating components and hooks
import React, { useState, useEffect } from "react";
//import list icon
import listSvg from "./assets/img/list.svg";
//import all components
import { List, AddListButton, Tasks } from "./components/index.jsx";
//import libary for making requests to json server
import axios from "axios";
//import library modules for using routes in app
import { Route, useHistory } from "react-router-dom";

function App() {
  //useState hook for changing state of lists array
  const [lists, setLists] = useState(null);
  //useState hook for changing state of colors
  const [colors, setColors] = useState(null);
  //useState hook for changing state of active list(displays it's tasks)
  const [activeItem, setActiveItem] = useState(null);
  //useHistory hook for managing current state of browser history
  let history = useHistory();

  // useEffect hook checks if app component was rendered and in that case make get request
  useEffect(() => {
    //get request to json server - takes data from it's and sets new state of lists
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      });
    axios.get(" http://localhost:3001/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  //function that adds created list to array of all lists
  const onAddList = (obj) => {
    //using spread operator in order to add created list to old array and create newArray
    const newList = [...lists, obj];
    setLists(newList);
  };

  //function that creates new task in array of tasks by clicking on Button
  const onAddTask = (listId, taskObj) => {
    //generates new array of tasks
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    //sets new State of list with updated tasks array
    setLists(newList);
  };

  // function that edits task
  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Task Text", taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, {
        text: newTaskText,
      })
      .catch(() => {
        alert("Can't update task");
      });
  };

  //function that removes task
  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Do you really want to delete task?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
        alert("Cant delete task!");
      });
    }
  };

  //function that makes task with completed state by clicking on it
  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      //runs over all lists and checks if list.id === listId
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          // runs over all tasks in lists, which satisfy previous condition  and checks if task.id === taskId
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    // sets new state of lists with updated newList(completed tasks) on front-end
    setLists(newList);
    axios
      // updates tasks on back-end serves
      .patch("http://localhost:3001/tasks/" + taskId, {
        completed,
      })
      .catch(() => {
        alert("Can't update tasks");
      });
  };

  //callback function - edits title of item
  const onEditListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  //useEffect reacts on changes in history dependency after rendering application and sets active state on list item by it's id by clicking on it
  useEffect(() => {
    return history.listen((location) => {
      //finds listId in adress pathname
      const listId = history.location.pathname.split("lists/")[1];
      if (lists) {
        //finds list where list.id = listId
        const list = lists.find((list) => list.id === Number(listId));
        //sets this list as list with active state
        setActiveItem(list);
      }
    });
  }, [lists, history]);
  return (
    <div className="todo">
      {/* sidebar block */}
      <div className="todo__sidebar">
        <List
          // By clicking on item ads route which transfers to page with all lists
          onClickItem={(list) => {
            history.push(`/`);
          }}
          items={[
            {
              active: !activeItem,
              icon: <img src={listSvg} alt="list icon" />,
              name: "List of Tasks",
            },
          ]}
        />
        {lists ? (
          <List
            // array of lists
            items={lists}
            //function that removes lists
            onRemove={(id) => {
              //filters array of lists and throws away list that was removed
              const newLists = lists.filter((item) => item.id !== id);
              //sets this array as new state of lists
              setLists(newLists);
            }}
            //function that makes list item active
            onClickItem={(list) => {
              history.push(`/lists/${list.id}`);
            }} //ads to routing history new route and transfers to it
            //active state of item
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          "Loading..."
        )}
        <AddListButton onAdd={onAddList} colors={colors} />
      </div>
      {/* tasks block - displays tasks of active item of lists*/}
      {/* Route that transfers to page with all lists of tasks */}
      <div className="todo__tasks">
        <Route exact path="/">
          {lists &&
            lists.map((list) => (
              <Tasks
                key={list.id}
                list={list}
                onAddTask={onAddTask}
                onEditTitle={onEditListTitle}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onCompleteTask={onCompleteTask}
                withoutEmpty
              />
            ))}
        </Route>
        {/* Route that transfers to the page with specific id of list */}
        <Route path="/lists/:id">
          {lists && activeItem && (
            <Tasks
              list={activeItem}
              onAddTask={onAddTask}
              onEditTitle={onEditListTitle}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
            />
          )}
        </Route>
      </div>
    </div>
  );
}

export default App;
