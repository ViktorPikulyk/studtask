import '../styles/TaskListView1.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import edit_1 from '../styles/icons/edit_1.svg';
import draw_check_mark from '../styles/icons/draw-check-mark.svg'; 

import CreateClass from './modals/CreateClass';
import EditClass from './modals/EditClass';
import DeleteClass from './modals/DeleteClass';
import DeleteToDo from './modals/DeleteToDo';

    const MY_TASK_LISTS_QUERY = gql`
    {
        myTaskLists{
            id,
            title,
            createdAt,
            progress
            classes{
              id,
              title,
              teacher,
              isCompleted,
              todos{
                id,
                content,
                state
              }
            }
          }
    }`

    const UPDATE_TODO_MUTATION = gql`
    mutation updateToDo($id:ID!, $content:String, $state:Int){
      updateToDo(id: $id, content: $content, state:$state){
        id
        content
        state
      }
    }`

    const CREATE_TODO_MUTATION = gql`
    mutation createToDo($content: String!, $classId: ID!){
      createToDo(content: $content, classId:$classId){
        id
        content
        state
        class{
          id
          title
        }
      }
    }`

const Classes = ({taskListIndex, classesEditMode, selectedColor}) => {

    const {data, refetch } = useQuery(MY_TASK_LISTS_QUERY);


    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editItem, setEditItem] = useState({
        id:'',
        title:'',
        teacher:''
    });
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteItemID, setDeleteItemID] = useState('');
    const [deleteToDoModalIsOpen, setDeleteToDoModalIsOpen] = useState(false);
    const [deleteToDoItemID, setDeleteToDoItemID] = useState('');
    const [newColor, setNewColor] = useState({
      id: '',
      state: ''
    });
    const [newTodoState, setNewTodoState] = useState({
      classID: '',
      state: false
    });
    const [newToDoContent, setNewToDoContent] = useState({
      content:'',
      classID:''
    });

    const handleNewToDoContent = (event, classID) => {
      setNewToDoContent({
        content: event.target.value,
        classID: classID
      });
    };

    const handleNewTodoState = (classElementID) => {
      setNewTodoState({
        classID: classElementID,
        state: !newTodoState.state
      });
    };
    
    
    const handleTodoColorChange = (classId, todoId) => {
      console.log(classId);
      console.log(todoId);
      let newCourse = data.myTaskLists[taskListIndex].classes.find(x => x.id === classId).todos;
      let newColorTodo = newCourse.find(x => x.id === todoId);
  
      setNewColor({
        id: newColorTodo.id,
        state: selectedColor
      })

    }

     const [editState] = useMutation(UPDATE_TODO_MUTATION, {
      variables: {
        id: newColor.id,
        state: newColor.state
      },
      onError: (e) => {
        console.log(e);
      },
      onCompleted: ( ) => {
        setNewColor({
          id: '',
          state: ''
        });
        refetch();
      }
    });

    if(newColor.id !== '') editState();

    const [createToDo] = useMutation(CREATE_TODO_MUTATION, {
      variables: {
        content: newToDoContent.content,
        classId: newToDoContent.classID
      },
      onError: (e) => {
        console.log(e);
      },
      onCompleted: ( ) => {
        refetch();
        setNewToDoContent({
          content: '',
          classID: ''
        });
        setNewTodoState({
          classID: '',
          state: false
        });
      }
    });

    const chooseColor = (number) => {
      switch(number){
        case 0: return {backgroundColor:'white',
                        color:'black'};
        case 1: return {backgroundColor:'rgb(216, 216, 216)',
                        color:'black'};
        case 2: return {backgroundColor:'yellow',
                        color:'black'};
        case 3: return {backgroundColor:'rgb(62, 212, 87)',
                        color:'white'};
        default: return {backgroundColor:'white',
                        color:'black'};
      }
    }

    return(
        <>
        <div className="tasklist_main">
          <div className="progress_container">
            <div className="progress_bar">
              <span style={{width:`${data && data.myTaskLists[taskListIndex].progress}%`}}></span>
            </div>
            {data && <h2 className="progress_percent">{data && data.myTaskLists[taskListIndex].progress}%</h2>}
          </div>
          <div className="classes_container">
            {data &&
              data.myTaskLists[taskListIndex].classes.map((classElement) => (
                <ul className="class_container" key={classElement.id}>
                  {classesEditMode && <>
                    <button className="class_edit_button" onClick={() => {setEditModalIsOpen(true); setEditItem({id:classElement.id, title:classElement.title, teacher:classElement.teacher})}}><img alt="/" src={edit_1}/></button>
                    <button className="class_delete_button" onClick={() => {setDeleteModalIsOpen(true); setDeleteItemID(classElement.id)}}>X</button>
                  </>}
                  <div className="class_header">
                    <h2 className="class_title" title={classElement.title}>{classElement.title}</h2>
                    <h2 className="class_teacher">{classElement.teacher}</h2>
                  </div>
                  <hr className="class_line"/>
                  <div className="class_body">
                    {data && classElement.todos.map((todo) => (
                      <div  key={todo.id} className="todoItem">
                        <p style={chooseColor(todo.state)} title={todo.content} className="todoItemTitle" readOnly={!classesEditMode} onClick={() => data && !classesEditMode &&  handleTodoColorChange (classElement.id, todo.id)}>{todo.content}</p>
                        {classesEditMode && <button className="todoItemDeleteButton" onClick={() => {setDeleteToDoModalIsOpen(true); setDeleteToDoItemID(todo.id)}}>X</button>}
                      </div>
                    ))}
                    {classElement.id === newTodoState.classID && newTodoState.state && <div className="newToDoItem">
                      <input className="newToDoItemContent" onChange={(e) => handleNewToDoContent(e, classElement.id)}></input>
                      <button className="newToDoItemButton" onClick={createToDo}><img alt="V" src={draw_check_mark}/></button>
                    </div>}
                    <button className="todoPlusButton" onClick={() => handleNewTodoState(classElement.id)}>{(classElement.id === newTodoState.classID && newTodoState.state)?"-":"+"}</button>
                  </div>
                </ul>
            ))}
            <div className="class_container" id="plus" onClick={() => setCreateModalIsOpen(true)}>+</div>
          </div>
        </div>
        <CreateClass createModalIsOpen={createModalIsOpen} setCreateModalIsOpen={setCreateModalIsOpen} taskListID={data && data.myTaskLists[taskListIndex].id} refetchClasses={refetch}/>
        <EditClass editModalIsOpen={editModalIsOpen} setEditModalIsOpen={setEditModalIsOpen} editItem={editItem} refetchClasses={refetch}/>
        <DeleteClass deleteModalIsOpen={deleteModalIsOpen} setDeleteModalIsOpen={setDeleteModalIsOpen} deleteItemID={deleteItemID} refetchClasses={refetch}/>
        <DeleteToDo deleteModalIsOpen={deleteToDoModalIsOpen} setDeleteModalIsOpen={setDeleteToDoModalIsOpen} deleteItemID={deleteToDoItemID} refetchClasses={refetch}/>
        </>
    );
} 

export default Classes;