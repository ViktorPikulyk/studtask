import '../styles/Main.css';
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

import Menu from './Menu';
import Navbar from './Navbar';
import Classes from './Classes';
import TaskLists from './TaskLists';

    const MY_TASK_LISTS_QUERY = gql`
    {
      myTaskLists{
        id,
        title,
        createdAt,
        progress,
        user{
          name
        }
      }
    }`

function Main() {

    const [taskListIndex, setTaskList] = useState(99);
    const [taskListTitle, setTaskListTitle] = useState(0);
    const handleTaskListChange = (index, title) => {
        setTaskList(index);
        setTaskListTitle(title);
    };

    const [classesEditMode, setClassesEditMode] = useState(false);
    const handleClassesEditModeChange = event => {
      setClassesEditMode(event.target.checked);
    }

    const [selectedColor, setSelectedColor] = useState(3);
    const handleColorChange = event => {
      setSelectedColor(parseInt(event.target.value));
    }

    const {data, refetch } = useQuery(MY_TASK_LISTS_QUERY);

  return (
    <div className="main_window">
        <div className="menu">
            <Menu handleTaskListChange={handleTaskListChange}/>
        </div>
        <div className="right_panel">
            <>{ taskListIndex !== 99 ? 
              <>
                <div className="navbar">
                  {taskListIndex != null && <Navbar taskListTitle={taskListTitle} handleClassesEditModeChange={handleClassesEditModeChange} handleColorChange={handleColorChange}/>}
                </div>
                <div className="classes">
                  {taskListIndex != null && <Classes taskListIndex={taskListIndex} classesEditMode={classesEditMode} selectedColor={selectedColor}/>}
                </div>
              </>
               :
              <TaskLists data={data} handleTaskListChange={handleTaskListChange} mainRefetch={refetch}/>
            }</>
            
        </div>
    </div>
  );
}

export default Main;
