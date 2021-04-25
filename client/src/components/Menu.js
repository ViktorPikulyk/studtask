import '../styles/Menu.css';
import { useQuery, gql } from '@apollo/client';
import { useHistory } from 'react-router';
import { AUTH_TOKEN } from '../constants';
import profilePic from '../styles/icons/profilePic.png'

const Menu = ({handleTaskListChange}) => {

  const history = useHistory();

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

    const GET_USER_QUERY = gql`
    {
      getUser{
        id,
        name,
        avatar
      }
    }`

  
  const data = useQuery(MY_TASK_LISTS_QUERY).data;
  const user = useQuery(GET_USER_QUERY).data;

  return (
    <div className="main_div">
      <input className="menu_button" type="checkbox" id="button"></input>
      <label htmlFor="button" className="menu_button_label">≡</label>
    <ul className="main_ul">
      <li className="user_li"><img alt="profilePic" src={profilePic}/>{user &&
          <>{user.getUser.name}</>}</li>
      <li className="main_li" onClick={() => handleTaskListChange(99, "")}>Semesters</li>
      <ul className="main_li">
        {data &&
          <>{data.myTaskLists.map((taskList, index) => (
            <li className="menu_taskList" key={taskList.id} onClick={() => handleTaskListChange(index, taskList.title)}>{taskList.title}</li>
          ))
          }</>}
      </ul>
      <li className="main_li">...</li>
      <li className="main_li">...</li>
      <li className="main_li">...</li>
      <li className="logout" onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              history.push(`/`);
            }}>Log Out</li>
    </ul>
    </div>
  );
}
  
export default Menu;