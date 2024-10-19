import React, { useState, useEffect } from 'react';
import LicenseUi2 from 'web/common/LicenseUi2.js';
import { nb_postRequest, nb_deleteRequest } from 'js/common/common_nb.js';
const DetailedContentsWrap = ({ isBasedParent, modalRepoChange, modalLikeChange }) => {
  const [isModalBase, setIsModaBasel] = useState(isBasedParent);

  useEffect(() => {
    document.getElementById('workContentsDetailedDiv').addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    document.getElementById('workContentsDetailedDiv').addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
    document.getElementById('workContentsDetailedDiv').addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });
  }, []);

  const likeContents = async (event, isBasedParent) => {
    let contentsNo = Number(event.target.dataset.contentsNo);
    let jsonReq = new Object();
    jsonReq.contentsId = contentsNo;
    if (event.target.classList.contains('active')) {
      let rsBody = await nb_deleteRequest('/math/like/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.remove('active');
      if (isModalBase) {
        document.getElementById('contentsLike' + contentsNo).classList.remove('active');
      }
      modalLikeChange(contentsNo, true);
    } else {
      let rsBody = await nb_postRequest('/math/like/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.add('active');
      if (isModalBase) {
        document.getElementById('contentsLike' + contentsNo).classList.add('active');
      }
      modalLikeChange(contentsNo, false);
    }
  };

  const putInMyRepo = async (event, isBasedParent) => {
    let contentsNo = Number(event.target.dataset.contentsNo);
    let jsonReq = new Object();
    jsonReq.contentsId = contentsNo;
    if (event.target.classList.contains('active')) {
      let rsBody = await nb_deleteRequest('/math/repo/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.remove('active');
      if (isModalBase) {
        document.getElementById('contentsRepo' + contentsNo).classList.remove('active');
      }
      modalRepoChange(contentsNo, true);
    } else {
      let rsBody = await nb_postRequest('/math/repo/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.add('active');
      if (isModalBase) {
        document.getElementById('contentsRepo' + contentsNo).classList.add('active');
      }
      modalRepoChange(contentsNo, false);
    }
  };

  const goToUserProfile = async (event) => {
    let userNo = Number(document.getElementById('nicknamewrap').dataset.userNo);
    if (userNo !== 0 && userNo !== undefined && userNo !== null && userNo !== '') {
      window.location.href = '/userProfile?userNo=' + userNo;
    }
  };

  return (
    <div id='detailedConDiv' className='blindBox hide'>
      <div className='detailedConDiv '>
        <div
          className='closeBtn'
          onClick={() => {
            document.getElementById('detailedConDiv').classList.add('hide');
          }}>
          X
        </div>
        <LicenseUi2 />
        <div id='workContentsDetailedDiv' className='contentsDiv contentsDetailedDiv '>
          <table className='workListTable'>
            <thead>
              <tr className='workListTBHead2'>
                <td>
                  <div className='twoFlexLayout'>
                    <div className='twoFlexLayout'>
                      <div>
                        <span id='likeRepoWrap'>
                          <span className='userSearchBtn'>
                            <span
                              id='detailedContentsRepo'
                              className='putRepoBtn'
                              onClick={(event) => {
                                putInMyRepo(event);
                              }}></span>
                            <span className='putRepoToolTip'>나의 저장소에 저장되었습니다</span>
                          </span>
                          <span className='userSearchBtn'>
                            <span
                              id='detailedContentsLike'
                              className='likeBtn'
                              onClick={(event) => {
                                likeContents(event);
                              }}></span>
                          </span>
                        </span>
                        <span
                          id='nicknamewrap'
                          className='userSearchBtn'
                          onClick={(event) => {
                            goToUserProfile(event);
                          }}>
                          <img id='detailedConImg' src='' alt='' className='contentsListProfile' /> <span id='userNickname'></span>
                        </span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </td>
                <td>정답 및 해설</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='td1'>
                  <div id='workQuesDetailedShow' className='workQuesShow quesRootDiv'>
                    <div className='quesDiv'>
                      <div id='quesDetailedContents' className='quesContents'></div>
                      <div id='quesDetailedImg-show' className='quesImg-show'>
                        <img id='contentsDetailedImgOutput' src='' alt='' />
                      </div>
                      <div id='workMultiDetailedShow' className='quesConMultiShow quesDetailedConMultiShow'>
                        <div className='firDiv'>
                          <span className='multiChoiceNo'>&#9312;</span>
                          <span id='firDetailedDiv' className='firDivContents'></span>
                        </div>
                        <div className='secDiv'>
                          <span className='multiChoiceNo'>&#9313;</span>
                          <span id='secDetailedDiv' className='secDivContents'></span>
                        </div>
                        <div className='thrDiv'>
                          <span className='multiChoiceNo'>&#9314;</span>
                          <span id='thrDetailedDiv' className='thrDivContents'></span>
                        </div>
                        <div className='fourDiv'>
                          <span className='multiChoiceNo'>&#9315;</span>
                          <span id='fourDetailedDiv' className='fourDivContents'></span>
                        </div>
                        <div className='fifDiv'>
                          <span className='multiChoiceNo'>&#9316;</span>
                          <span id='fifDetailedDiv' className='fifDivContents'></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className='td2'>
                  <div className='solRootDiv'>
                    <div className='ansSolDiv'>
                      <div id='workAnsShow' className='ansShow'>
                        <div>
                          <div className='ansContents'>
                            <span className='mini-title6'>답</span>&nbsp;&nbsp;
                            <span id='answerDetailedSheet' className='answerSheet'></span>
                          </div>
                        </div>
                      </div>
                      <div id='workSolShow' className='solShow'>
                        <span className='mini-title6'>해설</span>
                        <div id='solDetailedImg-show' className='solImg-show '>
                          <img id='solutionDetailedImgOutput' alt='' />
                        </div>
                        <div id='solDetailedContents' className='solContents'></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='workContentsDetailedDiv2' className='workContentsDetailedDiv2 hide'>
          사용자가 삭제한 문제입니다.
          <br />
          삭제한 문제의 경우에도 라이선스는 삭제한 사용자의 소유입니다.
          <br />
          사용을 중지해 주시기 바랍니다.
        </div>
      </div>
    </div>
  );
};

export default DetailedContentsWrap;
