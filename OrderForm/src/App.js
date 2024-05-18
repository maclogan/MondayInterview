import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import {AttentionBox, Flex, TextField, Button, Dropdown} from "monday-ui-react-core";
import { v4 as uuidv4 } from 'uuid'

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [dropdownData, setDropdownData] = useState([])
  const [formData, setFormData] = useState({firstName: null, lastName: null, quantity: null, fragrances: null})
  const [errors, setErrors] = useState({firstName: '', lastName: '', quantity: '', fragrances: ''})

  const createOrder = async () => {
    if (!formData || !formData.firstName || !formData.lastName || !formData.quantity || !formData.fragrances) {
      console.log(formData)
      console.error("All fields are required")
      return
    }
    if (formData.quantity <= 0) {
      console.error('Quantity must be at least 1')
      return
    }
    if (formData.fragrances.length < 3) {
      console.error('You must fill out at least 3 fragrances')
      return
    }
    console.log(formData.fragrances.length, formData.quantity, formData.fragrances.length % formData.quantity)
    if (formData.fragrances.length % formData.quantity !== 0) {
      console.error('You must enter 3 fragrances per quantity entered.')
      return
    }
    const uniqueId = await uuidv4()
    const createOrderMutation = `
      mutation CreateItem($boardId:ID!, $itemName:String!, $columnValues:JSON!) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
          id        
        }
      }
    `

    const fragranceIds = formData.fragrances.map(fragrance => parseInt(fragrance.value))
    console.log(fragranceIds)
    const columnValues = JSON.stringify({
        'connect_boards7__1': {item_ids: fragranceIds},
        'numbers__1': formData.quantity,
        'text__1': `${formData.lastName}, ${formData.firstName}`
      })
    
      console.log(columnValues)

    monday.api(createOrderMutation, {variables: {boardId: 6612547167, itemName: uniqueId, columnValues}})
      .then((res) => {
        console.log(res)
      }).catch(error => {
        console.error ("Error adding new item: ", error)
      })
  }

  const handleEdit = (fieldName, val) => {
    if (val==='' || val===null || val===0 || val===undefined) {
      setErrors({...errors, [fieldName]: 'This field is required.'})
    }
    else if (fieldName === 'quantity' && val < 1) {
      setErrors({...errors, [fieldName]: 'Quantity must be at least 1.'})
    }
    else if (fieldName === 'fragrances' && (!val.length || val.length < 3 || val.length / 3 !== formData.quantity)) {
      setErrors({...errors, [fieldName]: 'You must have at least 3 fragrances selected per kit.'})
    }
    else {
      setErrors({...errors, [fieldName]: ''})
    }
    console.log(errors)
    setFormData({...formData, [fieldName]: val})
  }

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");
    monday.setToken(process.env.REACT_APP_API_TOKEN)
    monday.api(`
    query {
      boards (ids: 6664515077) {
        items_page {
          items {
            id,
            name
          }
        } 
      }
    }
  `).then((res) => {
    if(res.data.boards[0] && res.data.boards[0].items_page.items) {
      const items = res.data.boards[0].items_page.items.map(item => ({label: item.name, value: item.id}))
      console.log(items)
      setDropdownData(items)
    }
  })
  }, []);
  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data

  return (
    <div className="App">
      <form onSubmit={(e) => {
        e.preventDefault();
        createOrder()
      }}>
      <Flex gap={8} align={Flex.align.START} direction={Flex.directions.COLUMN}>
        <Flex gap={4}>
          <TextField 
            title="First Name" 
            onChange={(val)=>handleEdit('firstName', val)} 
            size={TextField.sizes.LARGE} 
            placeholder="Enter Customer First Name" 
            validation={errors.firstName ? {status: 'error', text: errors.firstName} : {status: 'none', text: ''}} />
          <TextField 
            title="Last Name" 
            onChange={(val)=>handleEdit('lastName', val)} 
            size={TextField.sizes.LARGE} 
            placeholder="Enter Customer First Name"
            validation={errors.lastName ? {status: 'error', text: errors.lastName} : {}} />
          <TextField title="Quantity" 
            onChange={(val)=>handleEdit('quantity', val)} 
            size={TextField.sizes.LARGE} 
            type={TextField.types.NUMBER} 
            validation={errors.quantity ? {status: 'error', text: errors.quantity} : {}} />
        </Flex>
        <Dropdown 
          className='full-width-dropdown' 
          onChange={(val) => handleEdit('fragrances', val)} 
          size={TextField.sizes.LARGE} 
          placeholder="Select Fragrances" 
          multi 
          multiline 
          options={dropdownData} cacheOptions 
          validation={errors.fragrances ? {status: 'error', text: errors.fragrances} : {}}/>
        <Button className='action-button' size={Button.sizes.LARGE} type={Button.types.SUBMIT}>Start Order</Button>
      </Flex>
      </form>
    </div>
  );
};

export default App;
