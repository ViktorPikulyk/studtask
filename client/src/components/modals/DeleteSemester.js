import Modal from 'react-modal';
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/DeleteSemester.css'

const DELETE_SEMESTER_MUTATION = gql`
mutation deleteTaskList ($id:ID!) {
    deleteTaskList (id:$id)
}`

const DeleteSemester = ({deleteModalIsOpen, setDeleteModalIsOpen, deleteItemID, mainRefetch}) => {
      
    const [del] = useMutation(DELETE_SEMESTER_MUTATION, {
        variables: {
          id: deleteItemID
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setDeleteModalIsOpen(false);
            mainRefetch();
        }
      });

    return(
        <Modal closeTimeoutMS={300} className="modalDeleteSemester" overlayClassName="modalDeleteSemesterOverlay" isOpen={deleteModalIsOpen} onRequestClose={() => setDeleteModalIsOpen(false)}>
            <h1 className="delete_modal_title">Are you sure?</h1>
            <button className="delete_modal_yes_button" onClick={del}>Yes</button>
            <button className="delete_modal_no_button" onClick={() => setDeleteModalIsOpen(false)}>No</button>
        </Modal>
    );
}

export default DeleteSemester;