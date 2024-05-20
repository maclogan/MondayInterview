import { gql, useMutation, useQuery } from "@apollo/client";
import { Button,  IconButton, Loader, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, Toast } from "monday-ui-react-core";
import Delete from "monday-ui-react-core/dist/icons/Delete"
import Edit from "monday-ui-react-core/dist/icons/Edit"
import Add from "monday-ui-react-core/dist/icons/Add"
import { useState } from "react";
import { FragranceForm } from "./FragranceForm";

export const GET_FRAGRANCES = gql`
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

const DELETE_FRAGRANCE = gql`
    mutation DeleteFragrance($deleteFragranceId: String!) {
        deleteFragrance(id: $deleteFragranceId) {
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


export const FragranceTable = () => {
    
    const {loading, error, data} = useQuery(GET_FRAGRANCES)
    const [deleteFragrance, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_FRAGRANCE, {
        refetchQueries: [
            GET_FRAGRANCES
        ]
    })

    const [selectedFragrance, setSelectedFragrance] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const tableColumns = [
        {
            id: 'name',
            loadingSatteType: 'medium-text',
            title: 'Name',
            // width: 150
        },
        {
            id: 'description',
            loadingSatteType: 'medium-text',
            title: 'Description',
            // width: 150
        },
        {
            id: 'category',
            loadingSatteType: 'medium-text',
            title: 'Category',
            // width: 150
        },
        {
            id: 'imageUrl',
            loadingSatteType: 'medium-text',
            title: 'Image URL',
            // width: 150
        },
        {
            id: 'createdAt',
            loadingSatteType: 'medium-text',
            title: 'Created At',
            // width: 150
        },   
        {
            id: 'updatedAt',
            loadingSatteType: 'medium-text',
            title: 'Updated At',
            // width: 150
        },
        {
            id: 'editButton',
            loadingSatteType: 'medium-text',
            title: '',
            width: 70
        },{
            id: 'deleteButton',
            loadingSatteType: 'medium-text',
            title: '',
            width: 70
        },
    ]

    if (loading) {
        return <Loader />
    }

    if (error) {
        console.error(error)
        return <span>Something went wrong. Please try again later.</span>
    }
    
    return (
        <>
            <Button rightIcon={Add} style={{margin: 10}} onClick={()=>{
                setSelectedFragrance(null)
                setShowModal(true)
            }}>Create New Fragrance</Button>
            <Table columns={tableColumns}>
                <TableHeader>
                    <TableHeaderCell title="Name" />
                    <TableHeaderCell title="Description" />
                    <TableHeaderCell title="Category" />
                    <TableHeaderCell title="Image URL" />
                    <TableHeaderCell title="Created At" />
                    <TableHeaderCell title="Updated At" />
                    <TableHeaderCell title=""/>
                    <TableHeaderCell title="" />
                </TableHeader>
                <TableBody>
                    {data && data.listFragrances && data.listFragrances.length > 0 ? data.listFragrances.map((fragrance) => {
                        return <TableRow key={fragrance.id}>
                            <TableCell>{fragrance.name || ''}</TableCell>
                            <TableCell>{fragrance.description || ''}</TableCell>
                            <TableCell>{fragrance.category || ''}</TableCell>
                            <TableCell>{fragrance.image_url || ''}</TableCell>
                            <TableCell>{fragrance.created_at || ''}</TableCell>
                            <TableCell>{fragrance.updated_at || ''}</TableCell>
                            <TableCell>
                                <IconButton 
                                    size={IconButton.sizes.LARGE} 
                                    kind={IconButton.kinds.TERTIARY} 
                                    icon={Edit}
                                    onClick={()=>{
                                        setSelectedFragrance(fragrance)
                                        setShowModal(true)
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton 
                                    kind={IconButton.kinds.TERTIARY} 
                                    color={IconButton.colors.NEGATIVE} 
                                    icon={Delete}
                                    loading={deleteLoading}
                                    onClick={()=>{
                                        deleteFragrance({variables: {deleteFragranceId: fragrance.id}})
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    }):<></>}
                </TableBody>
            </Table>
            <Toast autoHideDuration={3000} type={Toast.types.NEGATIVE} open={deleteError}>Something went wrong. Please try again later.</Toast>
            { showModal && <FragranceForm fragrance={selectedFragrance} show={showModal} closeAction={()=>setShowModal(false)} />}
        </>
    )
}