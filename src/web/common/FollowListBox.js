import React, {useState, useEffect } from 'react';
import {nb_dataFetch, nb_fadeInOutB} from 'js/common/common_nb.js';
import {Link} from "react-router-dom";
import defaultProfile from 'img/defaultProfileWhite.png';

const FollowListBox = ({followArray, isFollowings, parentMethod})=>{

    const [followList, setFollowList] =useState(followArray);
    const [isFollowing, setIsFollowing] =useState(isFollowings);

    const showFollowCancelpop = async(event) => {
        document.getElementById("myFollowCancelScreen").classList.remove("hide");
        let target = event.target
        let userNo = target.dataset.userNo;
        let followingProfile = followList.filter(function(element, idx){
            if(element.userNo ===  Number(userNo)){
                return element;
            }
        });
        followingProfile = followingProfile[0];
        let imgPath = defaultProfile;
        if(followingProfile.profileImgPath !== null && followingProfile.profileImgName !== null){
            imgPath = followingProfile.profileImgPath+"/"+followingProfile.profileImgName;
        }
        document.getElementById("myFollowingImgpath").src = imgPath;
        
        let nickname = followingProfile.nickname;
        document.getElementById("myFollowingNickname").innerText = nickname;
        document.getElementById("myFollowCncl").dataset.userNo = userNo;
    }


    const followCncl = async(event) =>{
        let userNo = event.target.dataset.userNo;
        let returnObj = await nb_dataFetch('/followingCancel?userNo='+userNo, true);
        if(returnObj.isSuccess){
            parentMethod(userNo, )
            let newFollowList = followList.filter(function(element, idx){
                if(element.userNo !==  Number(userNo)){
                    return element;
                }
            });
            followArray = newFollowList;
            setFollowList(followArray);
        }else{
            await nb_fadeInOutB("팔로우 취소에 실패하였습니다.\n다시 시도해주세요", 2000);
        }
        document.getElementById("myFollowCancelScreen").classList.add("hide")
    }

    useEffect(()=>{
        setFollowList(followArray);
        setIsFollowing(isFollowings);
    }, [followArray, isFollowings]);

    const myFollowList = followList.map( (followUser, idx) => {
        let profileImgPath=defaultProfile;
        if(followUser.profileImgPath !== null && followUser.profileImgName !== null){
            profileImgPath=followUser.profileImgPath+followUser.profileImgName;
        }
        if(isFollowing){
            return (
                <div key={idx}>
                    <table className='followListTable'>
                        <tbody>
                            <tr>
                                <td>
                                    <Link className='linkNoneCss' to={"/userProfile?userNo="+followUser.userNo}><img alt="프로필이미지" src={profileImgPath} className="contentsListProfile"/></Link>
                                </td>
                                <td>
                                    <Link className='linkNoneCss' to={"/userProfile?userNo="+followUser.userNo}><span className='hoverUnderLine'>{followUser.nickname}</span></Link>
                                    
                                </td>
                                <td className='alignRight'>
                                    <span className='miniRedBtn' data-user-no={followUser.userNo} onClick={(event)=>{showFollowCancelpop(event)}}>팔로잉</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )  
        }else{
            return (
                <div key={idx}>
                    <table className='followListTable'>
                        <tbody>
                            <tr>
                                <td>
                                    <Link className='linkNoneCss' to={"/userProfile?userNo="+followUser.userNo}><img alt="프로필이미지" src={profileImgPath} className="contentsListProfile"/></Link>
                                </td>
                                <td>
                                    <Link className='linkNoneCss' to={"/userProfile?userNo="+followUser.userNo}><span className='hoverUnderLine'>{followUser.nickname}</span></Link>
                                </td>
                                <td className='alignRight'>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )  
        }
        
    });

return (
    <div id="followListBox" className='promptBoxScreen hide'>
        <div className='followList'>
            <div className='mini-closeBtn' onClick={()=>{document.getElementById("followListBox").classList.add("hide")}}>X</div>
            <div id="followListTitle" className='followListTitle'></div>
            {myFollowList}
        </div>
        <div id="myFollowCancelScreen" className='promptBoxScreen hide'>
                <div className='followCancelDiv'>
                    <img id="myFollowingImgpath" alt="프로필이미지" src="" className="profileImg"/> 
                    <div className='marginTenAuto'><span id="myFollowingNickname"></span>님의 팔로우를 취소하시겠어요?</div>
                    <div id="myFollowCncl" className='followCncl' onClick={(event)=>{followCncl(event)}}>팔로우 취소</div>
                    <div className='followCnclCncl' onClick={(ev)=>{document.getElementById("myFollowCancelScreen").classList.add("hide")}}>취소</div>
                </div>
                
        </div>
    </div>
    )
}

export default FollowListBox;