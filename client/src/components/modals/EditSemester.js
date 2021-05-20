import Modal from 'react-modal';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client'; 
import './styles/EditSemester.css'

const EDIT_SEMESTER_MUTATION = gql`
mutation updateTaskList($id:ID!, $title:String!){
    updateTaskList(id: $id, title: $title){
      id
      title
      user{
        id
        name
      }
    }
}`

const EditSemester = ({editModalIsOpen, setEditModalIsOpen, editItem, mainRefetch}) => {
    
    const [updatedTitle, setUpdatedTitle] = useState(editItem.title);

    const [edit] = useMutation(EDIT_SEMESTER_MUTATION, {
        variables: {
          id: editItem.id,
          title: updatedTitle
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setEditModalIsOpen(false);
            setUpdatedTitle('');
            mainRefetch();
        }
      });

    return(
        <Modal  closeTimeoutMS={300} className="modalEditSemester" overlayClassName="modalEditSemesterOverlay" isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)}>
            <button className="modalEditSemesterCloseButton" onClick={() => setEditModalIsOpen(false)}>X</button>
            <input className="modalEditSemesterInput" type="text" value={updatedTitle} placeholder={editItem && editItem.title} onChange={(e)=> setUpdatedTitle(e.target.value)}></input>
            <button className="modalEditSemesterSubmit" onClick={edit}>Ок</button>
        </Modal>
    );
}

export default EditSemester;