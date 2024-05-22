import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import {Toast, Flex, TextField, Button, Dropdown} from "monday-ui-react-core";
import { v4 as uuidv4 } from 'uuid'
import { gql, useLazyQuery } from "@apollo/client";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const defaultData = {
  firstName: null, lastName: null, quantity: null, fragrances: null
}

const GET_FRAGRANCES = gql`
        query GetFragrances {
            listFragrances {
                id
                category
                created_at
                description
                image_url
                name
                updated_at
            }
        }
    `

const App = () => {
  const [dropdownData, setDropdownData] = useState([])
  const [formData, setFormData] = useState(defaultData)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [data, setData] = useState()
  const [dropdownPopulationMethod, setDropdownPopulationMethod] = useState({label: "Monday", value: "monday"})

  const [getFragrances, {data: fragranceData}] = useLazyQuery(GET_FRAGRANCES)
  
  const reset = () => {
    setIsLoading(false)
    setIsSuccess(false)
    setFormData(defaultData)
    setErrors({})
  }

  const createOrder = async () => {
    setIsLoading(true)
    const newErrors = validateForm(formData)
    setErrors(newErrors)
    const uniqueId = await uuidv4()
    const createOrderMutation = `
      mutation CreateItem($boardId:ID!, $itemName:String!, $columnValues:JSON!) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
          id        
        }
      }
    `
    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false)
      return
    }
    const fragranceIds = formData.fragrances.map(fragrance => parseInt(fragrance.value))
    const columnValues = JSON.stringify({
        'connect_boards7__1': {item_ids: fragranceIds},
        'numbers__1': formData.quantity,
        'text__1': `${formData.lastName}, ${formData.firstName}`
      })
    
    monday.api(createOrderMutation, {variables: {boardId: 6612547167, itemName: uniqueId, columnValues}})
      .then((res) => {
        setData(res.data.create_item.id)
        setIsLoading(false)
        setIsSuccess(true)
      }).catch(error => {
        console.error ("Error adding new item: ", error)
        setIsSuccess(false)
        setIsLoading(false)
      })
  }

  const handleEdit = (fieldName, val) => {
    setFormData({...formData, [fieldName]: val})
  }

  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName) {
      errors.firstName = 'First Name is required'
    }
    if (!data.lastName) {
      errors.lastName = 'Last Name is required'
    }
    if (!data.quantity) {
      errors.quantity = 'Quantity is required'
    } else if (data.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1'
    }
    if (!data.fragrances || data.fragrances.length < 3 || data.fragrances.length / 3 !== parseInt(data.quantity)) {
      errors.fragrances = 'You must enter 3 fragrances per kit'
    } 
    return errors
  }

  useEffect(() => {
    monday.execute("valueCreatedForUser");
    monday.setToken(process.env.REACT_APP_API_TOKEN)
    if (dropdownPopulationMethod.value === 'monday') {
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
          setDropdownData(items)
        }
      })
    }
    else {
      getFragrances().then(() => {
        if (fragranceData) {
          const items = fragranceData.listFragrances.map(fragrance => ({label: fragrance.name, value: fragrance.id}))
          setDropdownData(items)
        }
      })
    }
  }, [dropdownPopulationMethod, getFragrances]);


  return (
    <div className="App">
      <form onSubmit={(e) => {
        e.preventDefault();
        createOrder()
      }}>
      <Flex gap={8} align={Flex.align.START} direction={Flex.directions.COLUMN} style={{width: '100%', maxWidth: 692}} >
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
          size={"large"} 
          placeholder="Select Fragrances" 
          multi 
          multiline 
          options={dropdownData}  
        />
        {errors.fragrances && <span className="error-message">{errors.fragrances}</span>}
        <Button 
          className={isLoading ? `action-button`: `action-button loading`}
          size={Button.sizes.LARGE} 
          type={Button.types.SUBMIT}
          loading={isLoading}>
            Start Order
        </Button>
        <Dropdown 
          onChange={(option)=>{setDropdownPopulationMethod(option)}} 
          options={[
            {label: 'Monday', value: 'monday'}, 
            {label: 'API', value: 'api'}
          ]}
          size={TextField.sizes.LARGE} 
          className='half-width-dropdown'
          value={dropdownPopulationMethod}
        />
      </Flex>
      </form>
      <Toast open={isSuccess} autoHideDuration={5000} onClose={()=>reset()} >Order {data} was successfully created!</Toast>
    </div>
  );
};

export default App;
