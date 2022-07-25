import React, {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import ProfileComponent from 'web/common/ProfileComponent';
import MyPageList from 'web/common/MyPageList';
import MyContentsList from 'web/contents/list/MyContentsList';
import MyResource from 'web/contents/list/MyResource';
import MyRepository from 'web/contents/list/MyRepository';

const MyPageWrap = ()=>{
    let location = useLocation();
    
    const [isMyContentList, setIsMyContentList] = useState(false);
    const [isMyRepository, setIsMyRepository] = useState(false);
    const [isMyResource, setIsMyResource] = useState(false);

    useEffect(()=>{
        const asyncUseEffect = async function(){
            if(location.pathname === "/myContentsList"){
                setIsMyContentList(true);
                setIsMyRepository(false);
                setIsMyResource(false);
            }else if(location.pathname === "/myRepository"){
                setIsMyContentList(false);
                setIsMyRepository(true);
                setIsMyResource(false);
            }else if(location.pathname === "/myResource"){
                setIsMyContentList(false);
                setIsMyRepository(false);
                setIsMyResource(true);
            }
        }
        asyncUseEffect();
    },[location]);

  return (
    <>
        <ProfileComponent isMine={true} />
        <MyPageList />
        {isMyContentList && <MyContentsList isMine={true} />}
        {isMyRepository && <MyRepository />}
        {isMyResource && <MyResource />}
    </>
  );
}

export default MyPageWrap;