import React, { useState } from "react";
import "./card.css";
import Button from "../button/button";
const Card = (props) => {
  const [count, setCount] = useState(0);
  const { cup, onAddItem, onRemoveItem } = props;
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    onAddItem(cup);
  };
  const handleDecrement = () => {
    setCount((prev) => prev - 1);
    onRemoveItem(cup);
  };
  return (
    <div className="card">
      <span className={`${count !== 0 ? "card_badge" : "card_badge-hidden"}`}>
        {count}
      </span>
      <div className="image_container">
        <img src={cup.Image} alt={cup.title} width={"100%"} height={"420px"} />
      </div>
      <div className="card_body">
        <h2 className="card_title">{cup.title}</h2>
        <div className="card_price">
          {cup.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </div>
      <div className="hr"></div>
      <div className="btn_container">
        <Button title={"+"} onClick={handleIncrement} type={"add"} />
        {count !== 0 && (
          <Button title={"-"} onClick={handleDecrement} type={"remove"} />
        )}
      </div>
    </div>
  );
};

export default Card;
