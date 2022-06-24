import React from 'react';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import ProfileComponent from 'web/common/ProfileComponent';
import MyPageList from 'web/common/MyPageList';
import MyRepository from 'web/contents/list/MyRepository';

const MyRepositoryWrap = ()=>{
   
  return (
    <>
        <ProfileComponent isMine={true} />
        <MyPageList />
        <MyRepository />
    </>
  );
}

export default MyRepositoryWrap;