//import React for creating components
import React from "react";
//import classnames library
import classNames from "classnames";
//import styles
import "./List.scss";
//import Badge component
import Badge from "../Badge";
//import remove icon
import removeSvg from "../../assets/img/remove.svg";
//import library for making requests
import axios from "axios";

const List = ({
  items,
  isRemovable,
  onClick,
  onRemove,
  onClickItem,
  activeItem,
}) => {
  //function that removes list by clicking on removeButton
  const removeList = (item) => {
    if (window.confirm("Do you really want to delete list?")) {
      //request that deletes list from back-end(fake json server)
      axios.delete("http://localhost:3001/lists/" + item.id).then(() => {
        //after success request removes item from list in application
        onRemove(item.id);
      });
    }
  };

  return (
    <ul onClick={onClick} className="list">
      {items.map((item, index) => (
        <li
          key={index}
          //setting class of item
          className={classNames(item.className, {
            //checking if class is active or not
            active: item.active
              ? item.active
              : activeItem && activeItem.id === item.id,
          })}
          onClick={onClickItem ? () => onClickItem(item) : null}
        >
          <i>{item.icon ? item.icon : <Badge color={item.color.name} />}</i>
          <span>
            {item.name}
            {/* show list's tasks */}
            {item.tasks && `(${item.tasks.length})`}
          </span>
          {isRemovable && (
            <img
              className="list__remove_icon"
              width={10}
              height={10}
              src={removeSvg}
              alt="removeBtn"
              onClick={() => removeList(item)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;
