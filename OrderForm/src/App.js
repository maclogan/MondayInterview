import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import {AttentionBox, Flex, TextField, Button, Dropdown} from "monday-ui-react-core";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data

  return (
    <div className="App">
      <Flex gap={8} align={Flex.align.START} direction={Flex.directions.COLUMN}>
        <Flex gap={4}>
          <TextField title="First Name" size={TextField.sizes.LARGE} placeholder="Enter Customer First Name" />
          <TextField title="Last Name" size={TextField.sizes.LARGE} placeholder="Enter Customer First Name" />
          <TextField title="Quantity" size={TextField.sizes.LARGE} type={TextField.types.NUMBER} />
        </Flex>
        <Dropdown className='full-width-dropdown' size={TextField.sizes.LARGE} placeholder="Select Fragrances" multi multiline />
        <Button className='action-button' size={Button.sizes.LARGE} >Start Order</Button>
      </Flex>
    </div>
  );
};

export default App;
