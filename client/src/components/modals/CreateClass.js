import Modal from 'react-modal';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import './styles/CreateClass.css';

const  CREATE_CLASS_MUTATION = gql`
mutation createClass($title:String!, $teacher:String!, $taskListID:ID!){
    createClass(title: $title, teacher:$teacher, taskListId:$taskListID){
      id
      title
      teacher
      isCompleted
      taskList{
        id
        title
      }
    }
}`

const CreateClass = ({createModalIsOpen, setCreateModalIsOpen, taskListID, refetchClasses}) => {

    const [newClass, setNewClass] = useState({
        title: '',
        teacher: ''
    });

    const [create] = useMutation(CREATE_CLASS_MUTATION, {
        variables: {
          title: newClass.title,
          teacher: newClass.teacher,
          taskListID: taskListID
        },
        onError: (e) => {
          console.log(e);
        },
        onCompleted: ( ) => {
            setCreateModalIsOpen(false);
            refetchClasses();
        }
    });

    return(
        <Modal closeTimeoutMS={300} className="modalCreateClass" overlayClassName="modalCreateClassOverlay" isOpen={createModalIsOpen} onRequestClose={() => setCreateModalIsOpen(false)}>
            <button className="modalCreateClassCloseButton" onClick={() => setCreateModalIsOpen(false)}>X</button>
            <h1 className="create_class_modal_title">New Class</h1>
            <input
                className="modalCreateClassInput1"
                value={newClass.title}
                onChange={(e) => {setNewClass({
                    ...newClass,
                    title: e.target.value
                })}}
                type="text"
                placeholder="Title"
            />
            <input
                className="modalCreateClassInput2"
                value={newClass.teacher}
                onChange={(e) => {setNewClass({
                    ...newClass,
                    teacher: e.target.value
                })}}
                type="text"
                placeholder="Teacher"
            />
            <button className="modalCreateClassSubmit" onClick={create}>Create</button>
        </Modal>
    );
}

export default CreateClass;