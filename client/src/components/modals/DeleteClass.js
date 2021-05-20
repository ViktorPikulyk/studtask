import Modal from 'react-modal';
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/DeleteSemester.css'

const DELETE_CLASS_MUTATION = gql`
mutation deleteClass ($id:ID!) {
    deleteClass (id:$id)
}`

const DeleteClass = ({deleteModalIsOpen, setDeleteModalIsOpen, deleteItemID, refetchClasses}) => {
    const [del] = useMutation(DELETE_CLASS_MUTATION, {
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
            <h1 className="delete_modal_title">Ви впевнені?</h1>
            <button className="delete_modal_yes_button" onClick={del}>Так</button>
            <button className="delete_modal_no_button" onClick={() => setDeleteModalIsOpen(false)}>Ні</button>
        </Modal>
    );
}

export default DeleteClass;