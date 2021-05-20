import '../styles/TaskLists.css'
import React, { useState } from 'react';
import edit_0 from '../styles/icons/edit_0.svg'
import delete_red from '../styles/icons/delete_red.svg'

import CreateSemester from './modals/CreateSemester';
import DeleteSemester from './modals/DeleteSemester';
import EditSemester from './modals/EditSemester';

const TaskLists = ({handleTaskListChange, data, mainRefetch}) => {

    const [isChecked, setEditButtons] = useState(false);
    const handleCheckboxChange = event => {
        setEditButtons(event.target.checked)
    };

    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editItem, setEditItem] = useState({
        id:'',
        title:''
    });

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteItemID, setDeleteItemID] = useState('');

    return(
        <div className="taskListsMain">
            <div className="taskLists_navbar">
                <h1 className="tasklists_title">Семестри</h1>
                <input type="checkbox" id="main_edit_button" onChange={handleCheckboxChange}></input>
                <label htmlFor="main_edit_button" className="main_edit_button_label"><img alt="/" src={edit_0}/></label>
            </div>
           <ul className="taskListsList">
                <>{data &&
                    data.myTaskLists.map((taskListElement, index) => (
                        <li className="taskListItem" key={taskListElement.id}>
                            <div className="tasklist_meter">
                                <span style={{width:`${taskListElement.progress}%`}}></span>
                            </div>
                            <div className="under_meter">
                                <h2 className="taskListTitle" onClick={() => handleTaskListChange(index, taskListElement.title)}>{taskListElement.title}</h2>
                                {isChecked && <div className="taskListControls">
                                    <button className="taskListEditButton" onClick={() => {setEditModalIsOpen(true); setEditItem({id:taskListElement.id, title:taskListElement.title})}}><img alt="/" src={edit_0}/></button>
                                    <button className="taskListDeleteButton" onClick={() => {setDeleteModalIsOpen(true); setDeleteItemID(taskListElement.id)}}><img alt="X" src={delete_red}/></button>
                                </div>}
                            </div>
                        </li>
                    ))}
                </>
                <li className="taskListItem" id="plus_button" onClick={() => setCreateModalIsOpen(true)}>+</li>
           </ul>
           <CreateSemester createModalIsOpen={createModalIsOpen} setCreateModalIsOpen={setCreateModalIsOpen} handleTaskListChange={handleTaskListChange} mainRefetch={mainRefetch}/>
           <DeleteSemester deleteModalIsOpen={deleteModalIsOpen} setDeleteModalIsOpen={setDeleteModalIsOpen} deleteItemID={deleteItemID} mainRefetch={mainRefetch}/>
           <EditSemester editModalIsOpen={editModalIsOpen} setEditModalIsOpen={setEditModalIsOpen} editItem={editItem} mainRefetch={mainRefetch}/>
        </div>
    );
}

export default TaskLists;