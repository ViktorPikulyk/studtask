import Modal from 'react-modal';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/EditClass.css';

const EDIT_CLASS_MUTATION = gql`
mutation updateClass($id:ID!, $title:String, $teacher:String, $isCompleted:Boolean){
    updateClass(id:$id, title:$title, teacher:$teacher, isCompleted: $isCompleted){
      id
      title
      teacher
      isCompleted
      taskList{
        id
        title
        classes{
          id
          title
          teacher
          isCompleted
        }
      }
    }
}`

const EditClass = ({editModalIsOpen, setEditModalIsOpen, editItem, refetchClasses}) => {

    const [updatedClass, setUpdatedClass] = useState({
        title: '',
        teacher: ''
    });

    const [edit] = useMutation(EDIT_CLASS_MUTATION, {
        variables: {
          id: editItem.id,
          title: updatedClass.title ? updatedClass.title : editItem.title,
          teacher: updatedClass.teacher ? updatedClass.teacher : editItem.teacher
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setEditModalIsOpen(false);
            refetchClasses();
        }
    });

    return(
        <Modal closeTimeoutMS={300} className="modalEditClass" overlayClassName="modalEditClassOverlay" isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)}>
            <button className="modalEditClassCloseButton" onClick={() => setEditModalIsOpen(false)}>X</button>
            <input className="modalEditClassInput1" type="text" value={updatedClass.title} placeholder={editItem && editItem.title} onChange={(e)=> setUpdatedClass({...updatedClass, title:e.target.value})}></input>
            <input className="modalEditClassInput2" type="text" value={updatedClass.teacher} placeholder={editItem && editItem.teacher} onChange={(e)=> setUpdatedClass({...updatedClass, teacher:e.target.value})}></input>
            <button className="modalEditClassSubmit" onClick={edit}>Ок</button>
        </Modal>
    );
}

export default EditClass;