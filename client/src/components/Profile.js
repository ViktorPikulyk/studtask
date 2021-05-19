import '../styles/Profile.css';
import React, { useEffect, useState } from 'react';
import profilePic from '../styles/icons/profilePic.png';
import { useQuery, gql } from '@apollo/client';

import ReportGenerator from './ReportGenerator';

const GET_USER_QUERY = gql`
{
  getUser{
    id,
    name,
    avatar,
    email
  }
}`

const MY_TASK_LISTS_QUERY = gql`
    {
      myTaskLists{
        id,
        title,
        createdAt,
        progress,
        user{
          name
        },
        classes{
          id,
          title,
          teacher,
          todos{
            id,
            content,
            state
          }
        }
      }
}`

const Profile = () => {

    const user = useQuery(GET_USER_QUERY).data;
    const {data} = useQuery(MY_TASK_LISTS_QUERY);

    return (
        <div className="profile_main">
            <div className="profile_avatar"><img alt="profilePic" src={profilePic}/></div>
            <div className="profile_name profile_item">Name: <input readOnly={true} defaultValue={user && user.getUser.name}></input></div>
            <div className="profile_email profile_item">Email: <input readOnly={true} defaultValue={user && user.getUser.email}></input></div>
            <div className="profile_password profile_item">New Password: <input readOnly={true}></input></div>
            <div className="profile_report profile_item">Create report:<button className="report_button"><ReportGenerator user={user} data={data}/></button></div>
        </div>
    );
}

export default Profile;