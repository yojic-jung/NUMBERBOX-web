import React from 'react';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import ProfileComponent from 'web/common/ProfileComponent';
import MyPageList from 'web/common/MyPageList';
import MyContentsList from 'web/contents/list/MyContentsList';

const MyContentListWrap = ()=>{
  return (
    <>
        <ProfileComponent isMine={true} />
        <MyPageList />
        <MyContentsList isMine={true} />
    </>
  );
}

export default MyContentListWrap;