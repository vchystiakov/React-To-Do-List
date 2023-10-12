//import React library for creating components
import React from "react";
//import List component
import List from "../List/index.jsx";
//import addList icon
import addSvg from "../../assets/img/add.svg";
//import styles
import "./AddList.scss";
//import Badge component
import Badge from "../Badge/index.jsx";
//import close icon
import closeSvg from "../../assets/img/close.svg";
//import library for working with requests
import axios from "axios";

const AddListButton = ({ colors, onAdd }) => {
  //useState hook for hiding/showing add-list popup menu
  const [visiblePopup, setVisiblePopUp] = React.useState(false);
  //useState hook for showing selected color
  const [selectedColor, setSelectColor] = React.useState(3);
  //useState hook for setting text value in input
  const [inputValue, setInputValue] = React.useState("");
  //useState hook for setting state of page
  const [isLoading, setIsLoading] = React.useState(false);

  //makes first color as default after component was rendered
  React.useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectColor(colors[0].id);
    }
  }, [colors]);

  //function that resets all values of add list menu to default by clicking on close button
  const onClose = () => {
    setVisiblePopUp(false);
    setInputValue("");
    setSelectColor(colors[0].id);
  };

  //function which creates new list by clicking on button
  const addList = () => {
    if (!inputValue) {
      alert("Enter name of list");
      return;
    }
    //before making request sets loading state of page
    setIsLoading(true);

    //post request that creates list on back-end(fake json server)
    axios
      .post(" http://localhost:3001/lists", {
        name: inputValue,
        colorId: selectedColor,
      }) //after getting response server returns data
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectedColor)[0];
        //adds selected color to request data and creates new object
        const listObj = { ...data, color, tasks: [] };
        onAdd(listObj);
        onClose();
      })
      .catch(() => {
        alert("Error while adding a list!");
      })
      .finally(() => {
        //changing state of page to loaded
        setIsLoading(false);
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={() => setVisiblePopUp(!visiblePopup)}
        items={[
          {
            className: "list__add-button",
            icon: <img src={addSvg} alt="addList icon" />,
            name: "Add List",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list-popup">
          <img
            onClick={onClose}
            className="add-list__popup-close-btn"
            src={closeSvg}
            alt="Close Icon"
          />

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="Name of List"
          />
          <div className="add-list__popup-colors">
            {colors.map((color) => (
              <Badge
                onClick={() => setSelectColor(color.id)}
                key={color.id}
                color={color.name}
                className={selectedColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addList} className="button">
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddListButton;
