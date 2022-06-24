import React from 'react';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import ProfileComponent from 'web/common/ProfileComponent';
import MyContentsList from 'web/contents/list/MyContentsList';
import {nb_getParameterByName} from 'js/common/common_nb.js';

const UserProfileWrap = ()=>{
    
    let param = nb_getParameterByName("userNo");
    
return (
                <>
                  <ProfileComponent isMine={false} userNo={param} />
                  <MyContentsList isMine={false} userNo={param}/>
                </>
)
}

export default UserProfileWrap;