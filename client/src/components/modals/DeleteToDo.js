import Modal from 'react-modal';
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/DeleteSemester.css'

const DELETE_TODO_MUTATION = gql`
mutation deleteToDo ($id:ID!){
    deleteToDo(id:$id)
}`

const DeleteToDo = ({deleteModalIsOpen, setDeleteModalIsOpen, deleteItemID, refetchClasses}) => {
      
    const [del] = useMutation(DELETE_TODO_MUTATION, {
        variables: {
          id: deleteItemID
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setDeleteModalIsOpen(false);
            refetchClasses();
        }
      });

    return(
        <Modal className="modalDeleteSemester" overlayClassName="modalDeleteSemesterOverlay" isOpen={deleteModalIsOpen} onRequestClose={() => setDeleteModalIsOpen(false)}>
            <h1 className="delete_modal_title">Are you sure?</h1>
            <button className="delete_modal_yes_button" onClick={del}>Yes</button>
            <button className="delete_modal_no_button" onClick={() => setDeleteModalIsOpen(false)}>No</button>
        </Modal>
    );
}

export default DeleteToDo;