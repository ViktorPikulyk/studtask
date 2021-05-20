import '../styles/Grades.css';
import React, { useState } from 'react';

const Grades = ({data}) => {

    const [semester, setSemester] = useState('0');
    const [classes, setClasses] = useState(['']);
    const [grades, setGrades] = useState(['']);
    const [priorities, setPriority] = useState(['']);

    const handleSetClasses = (event, index) => {
        let items = [...classes];
        let item = {...items[index]};
        item = event.target.value;
        items[index] = item;
        setClasses(items);
    }

    const handleSetGrades = (event, index) => {
        let items = [...grades];
        let item = {...items[index]};
        item = event.target.value;
        items[index] = item;
        setGrades(items);
    }

    const handleSetPriorities = (event, index) => {
        let items = [...priorities];
        let item = {...items[index]};
        item = event.target.value;
        items[index] = item;
        setPriority(items);
    }

    const handleSemesterChange = event => {
        setSemester(event.target.value);
        if(event.target.value !== '0'){
            let items = [];
            let items2 = [];
            console.log(data.myTaskLists.find(x => x.id === event.target.value));
            data.myTaskLists.find(x => x.id === event.target.value).classes.map((c) => {
                items.push(c.title);
                items2.push('');
            });
            setClasses(items);
            setGrades(items2);
            setPriority(items2);
        }else{
            setClasses(['']);
            setGrades(['']);
            setPriority(['']);
        }
    }

    const updateResult = () => {
        let res = 0;
        let count = 0;
        grades.map((g, index) => {
            if(g !== '') {
                priorities[index] === '' ? res += parseFloat(g) : res += parseFloat(g) * parseFloat(priorities[index]);
                priorities[index] === '' ? count++ : count += parseFloat(priorities[index]);
            }
        })
        if(count === 0) count = 1;
        let color = 'red';
        if(res/count >= 50) color = 'rgb(243, 227, 0)';
        if(res/count >= 71) color = 'rgb(160, 218, 2)';
        if(res/count >= 88) color = 'rgb(0, 175, 29)';
        return <h1 style={{color:color}}>{Math.round((res/count + Number.EPSILON) * 100) / 100}</h1>
    }

    const handlePlusColumn = () => {
        let newClasses = [...classes];
        let newGrades = [...grades];
        let newPriorities = [...priorities];
        newClasses.push('');
        newGrades.push('');
        newPriorities.push('');
        setClasses(newClasses);
        setGrades(newGrades);
        setPriority(newPriorities);
    }

    const handleMinusColumn = () => {
        let newClasses = [...classes];
        let newGrades = [...grades];
        let newPriorities = [...priorities];
        if(newClasses.length > 1){
            newClasses.pop();
            newGrades.pop();
            newPriorities.pop();
        }
        setClasses(newClasses);
        setGrades(newGrades);
        setPriority(newPriorities);
    }


    console.log(classes);
    console.log(grades);
    console.log(priorities);
    console.log(semester);

    return(
        <div className="grades_main">
            <div className="grades_selector">
            <label htmlFor="semester_choose">Виберіть семестр:</label>
                <select name="semester_choose" className="semester_choose" onChange={(e) => {handleSemesterChange(e)}} value={semester}>
                    <option value={0}>Вручну</option>
                    {data && data.myTaskLists.map((semester) => (
                        <option key={semester.id} value={semester.id}>{semester.title}</option>
                    ))}
                </select>
            </div>
            <div className="table_container">
            <table className="tg">
                <thead>
                <tr className="tr_class">
                    <td className="table_title">Предмет</td>
                    <>{classes.map((course, index) => (
                        <td key={index} className="tg-0lax"><input title={course} value={course} onChange={(e) => {handleSetClasses(e, index)}}></input></td>
                    ))}</>
                </tr>
                </thead>
                <tbody>
                <tr className="tr_grade">
                    <td className="table_title">Бал</td>
                    <>{grades.map((grade, index) => (
                        <td key={index} className="tg-0lax"><input type="number" min="0" step="1" value={grade} onChange={(e) => {handleSetGrades(e, index)}}></input></td>
                    ))}</>
                </tr>
                <tr className="tr_priority">
                    <td className="table_title">Кредити</td>
                    <>{priorities.map((priority, index) => (
                        <td key={index} className="tg-0lax"><input type="number" min="0" step="1" value={priority} onChange={(e) => {handleSetPriorities(e, index)}}></input></td>
                    ))}</>
                </tr>
                </tbody>
            </table>
            <div className="row_control">
                <button onClick={handlePlusColumn}>+</button>
                <button onClick={handleMinusColumn}>-</button>
            </div>
            </div>
            {updateResult()}
        </div>
    );
}

export default Grades;