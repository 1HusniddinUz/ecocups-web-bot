import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getData } from "./constants/db";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";

const cups = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    telegram.ready();
  });
  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);

    if (existItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id ? { ...existItem, quantity: existItem.quantity + 1 } : c
      );
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }
  };
  const onRemoveItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);
    if (existItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== existItem.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItem.id
          ? { ...existItem, quantity: existItem.quantity - 1 }
          : c
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = "Sotib olish :)";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    const queryId = telegram.initDataUnsafe?.query_id;
    if (queryId) {
      fetch("https://localhost:8000/web-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cartItems, queryId: queryId }),
      });
    } else {
      telegram.sendData(JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => {
      telegram.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData, cartItems]);

  return (
    <div id="App">
      <h1 className="heading">HasanHamro Cups</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards_container">
        {cups.map((cup) => (
          <Card
            key={cup.id}
            cup={cup}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
