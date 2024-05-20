import { useMutation, gql } from "@apollo/client"
import { Flex, Modal, TextArea, TextField, Button } from "monday-ui-react-core"
import { useState } from "react"
import { GET_FRAGRANCES } from "./FragranceTable"


const EDIT_FRAGRANCE = gql`
    mutation UpdateFragrance($fragrance: updateFragranceInput) {
        updateFragrance(fragrance: $fragrance) {
            id
            name
            description
            category
            image_url
            created_at
            updated_at
        }
    }
`

const ADD_FRAGRANCE = gql`
    mutation CreateFragrance($fragrance: createFragranceInput) {
        createFragrance(fragrance: $fragrance) {
            id
            name
            description
            category
            image_url
            created_at
            updated_at
        }
    } 
`

export const FragranceForm = ({fragrance, show, closeAction}) => {
    const defaultData = {
        name: fragrance && fragrance.name ? fragrance.name : '',
        description: fragrance && fragrance.description ? fragrance.description : '',
        category: fragrance && fragrance.category ? fragrance.category : '',
        imageUrl: fragrance && fragrance.image_url ? fragrance.image_url : ''
    }

    const [formData, setFormData] = useState(defaultData)

    const [updateFragrance, {data, loading, error}] = useMutation(EDIT_FRAGRANCE, {refetchQueries: [ GET_FRAGRANCES ]})
    const [addFragrance, {data: addData, loading: addLoading, error: addError}] = useMutation(ADD_FRAGRANCE, {refetchQueries: [ GET_FRAGRANCES ]})


    const handleEdit = (fieldName, value) => {
        setFormData({...formData, [fieldName]: value})
    }

    const handleSubmit = () => {
        if (fragrance) {
            updateFragrance({variables: {
                fragrance: {
                    id: fragrance.id,
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    image_url: formData.imageUrl
                }
            }}).then(() => {
                setTimeout(()=>closeAction(), 1500)
            })
        }
        else {
            addFragrance({variables: {
                fragrance: {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    image_url: formData.imageUrl
                }
            }}).then(() => {
                setTimeout(()=>closeAction(), 1500)
            })
        }
        
    }

    return (
        <Modal show={show} onClose={()=>closeAction()} title={fragrance ? "Edit Fragrance" : "Create a Fragrance"}>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
            }}>
                <Flex direction={Flex.directions.COLUMN} gap={8}>
                    <TextField 
                        title="Name" 
                        name="name" 
                        value={formData.name} 
                        placeholder="Enter a Fragrence Name"  
                        size={TextField.sizes.LARGE}
                        onChange={(val)=>handleEdit('name', val)} 
                        validation={!formData.name ? {status: 'error', text: 'This field is required'} : {status: 'none', text: ''}}
                    />
                    <TextArea 
                        label="Description" 
                        name="description" 
                        value={formData.description} 
                        placeholder="Enter a Fragrence Description" 
                        size={"large"} 
                        onChange={(e)=>handleEdit('description', e.target.value)} 
                    />
                    <TextField 
                        title="Category" 
                        name="category" 
                        value={formData.category} 
                        placeholder="Enter a Fragrence Category"  
                        size={TextField.sizes.LARGE}
                        onChange={(val)=>handleEdit('category', val)} 
                    />
                    <TextField 
                        title="Image URL" 
                        name="imageUrl" 
                        value={formData.imageUrl} 
                        placeholder="Enter an image URL"  
                        size={TextField.sizes.LARGE}
                        onChange={(val)=>handleEdit('imageUrl', val)} 
                    />
                    <Button 
                        style={{alignSelf: 'flex-end'}}
                        type={Button.types.SUBMIT}
                        loading={loading || addLoading}
                        success={!loading && !addLoading && !error && !addError && (data || addData)}
                        successText={fragrance ? "Updated!" : "Created!"}
                        >
                        {fragrance ? 'Update Fragrance' : "Create Fragrance"}
                    </Button>
                </Flex>
            </form>
        </Modal>
    )
}