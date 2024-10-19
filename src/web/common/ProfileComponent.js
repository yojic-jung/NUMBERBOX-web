import React, { useState, useEffect } from 'react';
import FollowListBox from 'web/common/FollowListBox';
import { nb_extensionCheck2, nb_fadeInOutB, nb_getRequest, nb_putRequest, nb_postForm, nb_postRequest, nb_deleteRequest } from 'js/common/common_nb.js';
import defaultProfileImg from 'img/defaultProfile.png';
import profileAddImg from 'img/add.png';

const ProfileComponent = ({ isMine, userNo }) => {
  const [nickname, setNickname] = useState('');
  const [imgPath, setImgPath] = useState(defaultProfileImg);
  const [myFollowing, setMyFollowing] = useState(new Array());
  const [myFollower, setMyFollower] = useState(new Array());
  const [followList, setFollowList] = useState(new Array());
  const [isFollowing, setIsFollowing] = useState(new Array());

  useEffect(() => {
    const asyncUseEffect = async function () {
      let jsonObj;
      if (userNo !== undefined && userNo !== '') {
        jsonObj = await nb_getRequest('/member/profile/' + Number(userNo), true);
        if (jsonObj.status == 200) {
          setNickname(jsonObj.data.profile.nickname);
          if (jsonObj.data.profile.profileImgPath !== null && jsonObj.data.profile.profileImgName !== null) {
            setImgPath(process.env.REACT_APP_S3_PATH + '/' + returnObj.data.fileNameVo.profileImgPath + '/' + encodeURIComponent(returnObj.data.fileNameVo.profileImgName));
          }
          if (jsonObj.data.isFollowing) {
            document.getElementById('followingUser').classList.add('hide');
            document.getElementById('followedUser').classList.remove('hide');
          } else {
            document.getElementById('followingUser').classList.remove('hide');
            document.getElementById('followedUser').classList.add('hide');
          }

          document.getElementById('followerCnt').innerText = jsonObj.data.followerCnt;
        }
      } else {
        jsonObj = await nb_getRequest('/member/profile', true);
        if (jsonObj.status == 200) {
          setNickname(jsonObj.data.myProfile.nickname);
          if (jsonObj.data.myProfile.profileImgPath !== null && jsonObj.data.myProfile.profileImgName !== null) {
            setImgPath(process.env.REACT_APP_S3_PATH + '/' + jsonObj.data.myProfile.profileImgPath + '/' + encodeURIComponent(jsonObj.data.myProfile.profileImgName));
          }
        }
        setMyFollowing(jsonObj.data.followingProfile);
        setMyFollower(jsonObj.data.followerProfile);
        document.getElementById('myFollowerCnt').innerText = jsonObj.data.followerCnt;
        document.getElementById('myFollowingCnt').innerText = jsonObj.data.followingCnt;
      }
    };
    asyncUseEffect();
  }, []);

  const resetMyFollowing = async (userNo) => {
    let followingList = myFollowing.filter(function (element, idx) {
      if (element.id !== Number(userNo)) {
        return element;
      }
    });
    setMyFollowing(followingList);
    setFollowList(myFollowing);
    setIsFollowing(true);

    document.getElementById('myFollowingCnt').innerText = followingList.length;
  };

  const registerProfileImg = async (event) => {
    if (event.target.files[0] !== undefined) {
      let form = document.createElement('form');
      form.setAttribute('charset', 'UTF-8');
      form.setAttribute('encoding', 'multipart/form-data'); //Post 방식
      form.setAttribute('method', 'POST'); //Post 방식
      let formData = new FormData(form);
      formData.append('imgFile', event.target.files[0]);
      let returnObj = await nb_postForm('/member/profile/img', formData, true);
      if (returnObj.status == 200) {
        setImgPath(process.env.REACT_APP_S3_PATH + '/' + returnObj.data.fileNameVo.path + '/' + encodeURIComponent(returnObj.data.fileNameVo.name));
        document.getElementById('topMenuProfileImg').src =
          process.env.REACT_APP_S3_PATH + '/' + returnObj.data.fileNameVo.path + '/' + encodeURIComponent(returnObj.data.fileNameVo.name);
      } else {
        await nb_fadeInOutB('프로필 이미지 변경에 실패하였습니다.\n다시 등록해주시기 바랍니다.', 2000);
      }
    }
  };

  const nicknameChange = async (event) => {
    let nickval = document.getElementById('nickname').value;
    let regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,12}$/;
    if (!regex.test(nickval)) {
      await nb_fadeInOutB('닉네임은 공백 없이 한글, 영어, 숫자 조합 12글자까지 가능합니다.', 2000);
      return false;
    } else {
      const jsonReq = { nickname: nickval };
      let jsonObj = await nb_putRequest('/member/profile/nickname', jsonReq, true);
      if (jsonObj.data.isUpdated) {
        document.getElementById('myNickName').innerText = nickval;
        document.getElementById('nickChngCancelBtn').click();
      } else {
        await nb_fadeInOutB('닉네임 변경에 실패하였습니다.\n다시 시도해주시기 바랍니다.', 2000);
      }
    }
  };

  const followingUser = async (userNo) => {
    let returnObj = await nb_postRequest('/member/following/' + userNo, null, true);
    if (returnObj.status == 200) {
      document.getElementById('followingUser').classList.add('hide');
      document.getElementById('followedUser').classList.remove('hide');
      document.getElementById('followerCnt').innerText = returnObj.data.followerCnt;
    } else {
      await nb_fadeInOutB('팔로우에 실패하였습니다.\n다시 시도해주세요.', 2000);
    }
  };

  const followingCancel = async (userNo) => {
    let returnObj = await nb_deleteRequest('/member/following/' + userNo, null, true);
    if (returnObj.status == 200) {
      document.getElementById('followingUser').classList.remove('hide');
      document.getElementById('followedUser').classList.add('hide');
      document.getElementById('followerCnt').innerText = returnObj.data.followerCnt;
    } else {
      await nb_fadeInOutB('팔로우 취소에 실패하였습니다.\n다시 시도해주세요', 2000);
    }

    document.getElementById('followCancelScreen').classList.add('hide');
  };

  const showMyFollowList = async (isFollowingList) => {
    document.getElementById('followListBox').classList.remove('hide');
    if (isFollowingList) {
      document.getElementById('followListTitle').innerText = '팔로잉';
      setFollowList(myFollowing);
      setIsFollowing(true);
    } else {
      document.getElementById('followListTitle').innerText = '팔로워';
      setFollowList(myFollower);
      setIsFollowing(false);
    }
  };

  return (
    <>
      <div id='myProfileDiv' className='myProfileDiv'>
        <table className='myProfileTable'>
          <tbody>
            <tr>
              <td>
                <span
                  id='myProfile'
                  className='profileImgWrap'
                  onClick={() => {
                    document.getElementById('profileImgFile').click();
                  }}>
                  <img alt='프로필이미지' src={imgPath} className='profileImg' />
                  {isMine && (
                    <>
                      <img alt='프로필변경' src={profileAddImg} className='profileUpdateBtn' />
                      <input
                        id='profileImgFile'
                        accept='image/*'
                        type='file'
                        name='profileImgFile'
                        className='hide'
                        onChange={(event) => {
                          nb_extensionCheck2(event);
                          registerProfileImg(event);
                        }}
                      />
                    </>
                  )}
                </span>
              </td>
              <td>
                <div>
                  <div id='myNickNameWrap' className='relative'>
                    <span id='myNickName' className='myNickName'>
                      {nickname}
                    </span>
                    {isMine ? (
                      <>
                        <span
                          id='nicknameChngBtn'
                          className='nicknameChngBtn'
                          onClick={() => {
                            document.getElementById('myNickNameWrap').classList.add('hide');
                            document.getElementById('nickChngWrap').classList.remove('hide');
                            document.getElementById('nickname').focus();
                          }}></span>
                        <sup className='nicknameChngToolTip'>닉네임 수정하기</sup>
                      </>
                    ) : (
                      <>
                        <span
                          id='followingUser'
                          className='blueBoxBtn maginLTwoZero'
                          onClick={() => {
                            followingUser(userNo);
                          }}>
                          팔로우
                        </span>
                        <span
                          id='followedUser'
                          className='followedUser hide'
                          onClick={() => {
                            document.getElementById('followCancelScreen').classList.remove('hide');
                          }}></span>
                      </>
                    )}
                  </div>
                  <div id='nickChngWrap' className='nickChngWrap hide'>
                    <input id='nickname' className='profileNickname' name='nickname' type='text' defaultValue={nickname} />
                    <span
                      id='nickChngOkBtn'
                      className='nickChngOkBtn'
                      onClick={() => {
                        nicknameChange();
                      }}>
                      변경
                    </span>
                    <span
                      id='nickChngCancelBtn'
                      className='nickChngCancelBtn'
                      onClick={() => {
                        document.getElementById('myNickNameWrap').classList.remove('hide');
                        document.getElementById('nickChngWrap').classList.add('hide');
                      }}>
                      취소
                    </span>
                  </div>
                </div>
                <div className='followDiv'>
                  {isMine ? (
                    <>
                      <div>
                        <span
                          id='myFollowingInfo'
                          className='followWrap'
                          onClick={() => {
                            showMyFollowList(true);
                          }}>
                          팔로잉 <span id='myFollowingCnt' className='followCnt'></span>
                        </span>
                        <span
                          id='myFollowerInfo'
                          className='followWrap'
                          onClick={() => {
                            showMyFollowList(false);
                          }}>
                          팔로워 <span id='myFollowerCnt' className='followCnt'></span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      팔로워 <span id='followerCnt' className='followCnt'></span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      {isMine ? (
        <>
          <FollowListBox followArray={followList} isFollowings={isFollowing} parentMethod={resetMyFollowing} />
        </>
      ) : (
        <div id='followCancelScreen' className='promptBoxScreen hide'>
          <div className='followCancelDiv'>
            <img alt='프로필이미지' src={imgPath} className='profileImg' />
            <div className='marginTenAuto'>{nickname}님의 팔로우를 취소하시겠어요?</div>
            <div
              className='followCncl'
              onClick={() => {
                followingCancel(userNo);
              }}>
              팔로우 취소
            </div>
            <div
              className='followCnclCncl'
              onClick={() => {
                document.getElementById('followCancelScreen').classList.add('hide');
              }}>
              취소
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileComponent;
