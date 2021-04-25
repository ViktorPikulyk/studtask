import Modal from 'react-modal';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/CreateSemester.css'

const CREATE_SEMESTER_MUTATION = gql`
mutation createTaskList($title:String!){
    createTaskList(title: $title){
      id,
      createdAt,
      title,
      progress,
      user{
        id,
        name
      }
    }
  }`

const CreateSemester = ({createModalIsOpen, setCreateModalIsOpen, mainRefetch}) => {

    const [newTitle, setTitle] = useState("");
    const handleTitleChange = event => {
        setTitle(event.target.value);
    };
      
    const [create] = useMutation(CREATE_SEMESTER_MUTATION, {
        variables: {
          title: newTitle
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setCreateModalIsOpen(false);
            setTitle('');
            mainRefetch();
        }
      });

    return(
        <Modal  closeTimeoutMS={300} className="modalCreateSemester" overlayClassName="modalCreateSemesterOverlay" isOpen={createModalIsOpen} onRequestClose={() => setCreateModalIsOpen(false)}>
            <button className="modalCreateSemesterCloseButton" onClick={() => setCreateModalIsOpen(false)}>X</button>
            <h1 className="create_semester_modal_title">New Semester</h1>
            <input
                className="modalCreateSemesterInput"
                value={newTitle}
                onChange={handleTitleChange}
                type="text"
                placeholder="Input semester title (e.g. 2021(I))"
            />
            <button className="modalCreateSemesterSubmit" onClick={create}>Submit</button>
        </Modal>
    );
}

export default CreateSemester;