import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserView, MobileView } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import ResourceMenuBar from 'web/common/ResourceMenuBar';
import RoundButtonList from 'web/common/RoundButtonList';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';
import PageNumBtn from 'web/common/PageNumBtn';
import EmptyList from 'web/common/EmptyList';
import { nb_isLogin, nb_dataFetch, nb_getRequest, nb_dataFileFetch, nb_getParameterByName } from 'js/common/common_nb.js';
import 'css/resourceFile/shareResource.css';

let resourceMenuArr;
const ShareResource = () => {
  let location = useLocation();

  const [mainCateNo, setMainCateNo] = useState(nb_getParameterByName('mainCateNo') === '' ? 1 : nb_getParameterByName('mainCateNo'));
  const [mainCate, setMainCate] = useState(new Array());
  const [resourceList, setResourceList] = useState(new Array());
  const [resourceMenu, setResourceMenu] = useState(new Array());
  const [errContentsNo, setErrContentsNo] = useState(0);
  const emptyListMsg = '해당 카테고리의 컨텐츠가 존재하지 않습니다.';
  const [curPageNum, setCurPageNum] = useState(0);
  const [totalPageCnt, setTotalPageCnt] = useState(0);
  const pageVolume = 60;

  useEffect(() => {
    const asyncUseEffect = async function () {
      let returnVal = await nb_getRequest('/public/math/resource/menu', true);
      let resourceMenulist = returnVal.data.resourceMenu;
      setResourceMenu(resourceMenulist);
      resourceMenuArr = resourceMenulist;
      let uniqueArr = [];
      resourceMenulist.filter((element, index) => {
        if (index !== 0) {
          if (resourceMenulist[index - 1]['mainCateName'] !== element['mainCateName']) {
            uniqueArr.push(element);
          }
        } else {
          uniqueArr.push(element);
        }
      });
      setMainCate(uniqueArr);
      document.getElementById('shareResource').classList.add('active');
      let mainCateId = nb_getParameterByName('mainCateNo');
      let param2 = nb_getParameterByName('resourceNo');
      let param3 = nb_getParameterByName('pageNum');
      let movePage = 0;
      let returnObj;
      if (param2 !== '') {
        returnObj = await nb_dataFetch('/mathInfo/takeResourceByResourceNo?resourceNo=' + param2, true);
        param = returnObj.resourceList[0].mathResourceCate[0].mainCateNo;
      } else {
        if (param3 !== '') {
          movePage = Number(param3) - 1;
          returnObj = await nb_getRequest('/math/resource/' + mainCateId + '?' + 'pageNum=' + movePage + '&pageVolume=' + pageVolume, true);
        } else {
          returnObj = await nb_getRequest('/math/resource/' + mainCateId + '?' + 'pageNum=' + curPageNum + '&pageVolume=' + pageVolume, true);
        }
        setMainCateNo(mainCateId);
        setCurPageNum(movePage);
        setTotalPageCnt(Math.ceil(returnObj.data.total / returnObj.data.page.pageVolume));
      }

      let cateMenu = document.querySelectorAll('.cateMenu');
      for (let i = 0; i < cateMenu.length; i++) {
        cateMenu[i].classList.remove('active');
      }
      document.getElementById('category-' + mainCateId).classList.add('active');
      setResourceList(returnObj.data.contents);
    };
    asyncUseEffect();
    return () => {};
  }, [location]);

  const errorReportOpen = async (resoureNo) => {
    if (!nb_isLogin()) {
      alert('로그인 이후 사용해주시기 바랍니다.');
      return;
    }
    setErrContentsNo(resoureNo);
  };

  const errorReportClose = async (contentsNo) => {
    setErrContentsNo(0);
  };

  const downPptFile = async (filePath, fileName) => {
    if (!nb_isLogin()) {
      alert('로그인 이후 사용해주시기 바랍니다.');
      return;
    }
    let name = fileName.split('.')[0].split('_')[2];
    nb_dataFileFetch('/common/download?filePath=' + filePath + '&fileName=' + encodeURI(fileName), name);
  };

  const showDetailedRes = async (event, title, pptFileName, resourceNo, resourceCate) => {
    if (event.target.classList.contains('down-ppt-btn') || event.target.classList.contains('errBtn')) return;
    document.getElementById('resDetailedTitle').innerHTML = title;
    document.getElementById('resDetailedCate').innerHTML = '';
    for (let i = 0; i < resourceCate.length; i++) {
      for (let j = 0; j < resourceMenuArr.length; j++) {
        if (resourceMenuArr[j].mainCateNo === resourceCate[i].mainCateNo && resourceMenuArr[j].midCateNo === resourceCate[i].midCateNo) {
          let cateMenu = resourceMenuArr[j].mainCateName + '-' + resourceMenuArr[j].midCateName;
          let resourceCateDesc = document.createElement('span');
          resourceCateDesc.innerHTML = cateMenu;
          resourceCateDesc.className = 'resourceCateDesc';
          document.getElementById('resDetailedCate').append(resourceCateDesc);
        }
      }
    }

    document.getElementById('resDetailedPPtDownBtn').dataset.pptName = pptFileName;
    let returnObj = await nb_dataFetch('/mathInfo/takePPtSlideImge?resourceNo=' + resourceNo, true);
    document.getElementById('resDetailedWrap').classList.remove('hide');

    document.getElementById('customImgSliderErrBtn').dataset.resourceNo = resourceNo;
    document.getElementById('customImgSliderBtnDiv').innerHTML = '';
    document.getElementById('customImgSliderContainerDiv').innerHTML = '';
    let slideBox = document.querySelector('.customImgSliderContainerDiv');
    for (let i = 0; i < returnObj.imgList.length; i++) {
      let sliderDiv = document.createElement('div');
      sliderDiv.className = 'customSliderBox';
      let sliderImg = document.createElement('img');
      sliderImg.src = process.env.REACT_APP_SERVER_STATIC_HOST + returnObj.imgList[i].imgPath + returnObj.imgList[i].imgName;
      sliderDiv.append(sliderImg);
      sliderImg.classList.add('customSliderImg');
      if (i !== 0) sliderImg.classList.add('hide');

      document.getElementById('customImgSliderContainerDiv').append(sliderDiv);
      let btn = document.createElement('button');
      if (i === 0) btn.className = 'customSliderBtn active';
      else btn.className = 'customSliderBtn';
      btn.innerHTML = i + 1;
      let moveX = -i * 580;
      btn.addEventListener('click', function (event) {
        slideBox.style.transform = 'translateX(' + moveX + 'px)';
        let activeBtn = document.getElementsByClassName('customSliderBtn active');
        for (let i = 0; i < activeBtn.length; i++) {
          activeBtn[i].classList.remove('active');
        }
        event.target.classList.add('active');
        let customSliderImg = document.getElementsByClassName('customSliderImg');
        for (let i = 0; i < customSliderImg.length; i++) {
          customSliderImg[i].classList.remove('hide');
        }
      });
      document.getElementById('customImgSliderBtnDiv').append(btn);
      document.getElementById('customImgSliderContainerDiv').style.width = (i + 1) * 580 + 'px';
    }
  };

  const initResoureList = resourceList.map((contentsMap, idx) => {
    return (
      <div id={'res-div-' + contentsMap.resourceNo} className='res-div' data-uniq-id={contentsMap.seqNo} key={idx}>
        <div
          className='res-over-lay'
          onClick={(event) => {
            showDetailedRes(event, contentsMap.title, contentsMap.pptName, contentsMap.resourceNo, contentsMap.mathResourceCate);
          }}>
          <span className='pptPageCnt'>{contentsMap.pptPageCnt}</span>
          <span
            className='down-ppt-btn'
            onClick={() => {
              downPptFile('resourcePpt', contentsMap.pptName);
            }}></span>
          <div
            className='errBtn'
            onClick={() => {
              errorReportOpen(contentsMap.resourceNo);
            }}></div>
        </div>
        <div className='img-title'>{contentsMap.title}</div>
        <img
          id={'res-img-' + contentsMap.resourceNo}
          className='res-img'
          src={process.env.REACT_APP_SERVER_STATIC_HOST + contentsMap.imgPath + contentsMap.imgName}
          alt='컨텐츠 이미지'
        />
      </div>
    );
  });

  return (
    <>
      <Helmet>
        <title>컨텐츠 목록</title>
        <meta name='description' content='도형 및 그래프파일을 찾아보세요!' />
        <link rel='canonical' href='https://nsoohak.com/shareResource?mainCateNo=1&pageNum=1' />
        <meta property='og:title' content='컨텐츠 목록' />
        <meta property='og:description' content='도형 및 그래프파일을 찾아보세요!' />
      </Helmet>
      <BrowserView>
        <ResourceMenuBar></ResourceMenuBar>
        <div className='cateDiv'>
          <RoundButtonList id='category' className='cateMenu' tabList={mainCate} dataId='mainCateId' mainKey='mainCateName'></RoundButtonList>
        </div>
        <div className='resWrap'>{initResoureList}</div>
        {initResoureList.length === 0 && <EmptyList msg={emptyListMsg} imgName='myRepoEmpty' addImgClass='miniSize' />}
        {totalPageCnt > 1 && <PageNumBtn linkUrl={'/shareResource'} additionParam={'&mainCateNo=' + mainCateNo} curPageNum={curPageNum} totalPageCnt={totalPageCnt} />}
        <div className='paddingFiveZero'></div>
        <div id='resDetailedWrap' className='blindBox hide'>
          <div className='resDetailedDiv'>
            <div
              className='closeBtn2'
              onClick={() => {
                document.getElementById('resDetailedWrap').classList.add('hide');
                document.getElementsByClassName('customSliderBtn')[0].click();
              }}>
              X
            </div>
            <div id='resDetailedTitle' className='resDetailedTitle'></div>
            <div id='resDetailedCate' className='resDetailedCate'></div>
            <div className='resDetailedDesc'>
              ※ 미리보기 슬라이드는 실제 파일과 다소 차이가 날 수 있으며 낮은 화질로 보여집니다.
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div
              id='customImgSliderErrBtn'
              className='errBtn customImgSliderErrBtn'
              onClick={(event) => {
                errorReportOpen(event.target.dataset.resourceNo);
              }}></div>
            <div className='overflowHidden'>
              <div id='customImgSliderContainerDiv' className='customImgSliderContainerDiv'></div>
            </div>
            <div className='relative'>
              <div id='customImgSliderBtnDiv' className='customImgSliderBtnDiv'></div>
            </div>
            <div className='resDowwBtnWrap'>
              <div
                id='resDetailedPPtDownBtn'
                className='resDetailedPPtDownBtn'
                onClick={(event) => {
                  downPptFile('resourcePpt', event.target.dataset.pptName);
                }}>
                ppt파일 다운
              </div>
            </div>
          </div>
        </div>

        {errContentsNo !== 0 && <ErrorReportForMathCon title='컨텐츠 오류 신고' errType={2} parentMethod={errorReportClose} conNo={errContentsNo} />}
      </BrowserView>
      <MobileView>
        <ResourceMenuBar></ResourceMenuBar>
        <div className='cateDiv mobile'>
          <RoundButtonList id='category' className='cateMenu' tabList={mainCate} dataId='mainCateNo' mainKey='mainCateName'></RoundButtonList>
        </div>
        <div className='resWrap'>{initResoureList}</div>
        <div id='resDetailedWrap' className='blindBox hide'>
          <div className='resDetailedDiv mobile'>
            <div
              className='closeBtn2'
              onClick={() => {
                document.getElementById('resDetailedWrap').classList.add('hide');
                document.getElementsByClassName('customSliderBtn')[0].click();
              }}>
              X
            </div>
            <div id='resDetailedTitle' className='resDetailedTitle'></div>
            <div id='resDetailedCate' className='resDetailedCate'></div>
            <div className='resDetailedDesc mobile'>
              ※ 미리보기 슬라이드는 실제 파일과 다소 차이가 날 수 있으며 낮은 화질로 보여집니다.
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div
              id='customImgSliderErrBtn'
              className='errBtn customImgSliderErrBtn'
              onClick={(event) => {
                errorReportOpen(event.target.dataset.resourceNo);
              }}></div>
            <div className='overflowHidden'>
              <div id='customImgSliderContainerDiv' className='customImgSliderContainerDiv'></div>
            </div>
            <div className='relative'>
              <div id='customImgSliderBtnDiv' className='customImgSliderBtnDiv'></div>
            </div>
            <div className='resDowwBtnWrap'>
              <div
                id='resDetailedPPtDownBtn'
                className='resDetailedPPtDownBtn'
                onClick={(event) => {
                  downPptFile('resourcePpt', event.target.dataset.pptName);
                }}>
                ppt파일 다운
              </div>
            </div>
          </div>
        </div>

        {errContentsNo !== 0 && <ErrorReportForMathCon title='컨텐츠 오류 신고' errType={2} parentMethod={errorReportClose} conNo={errContentsNo} />}
      </MobileView>
    </>
  );
};

export default ShareResource;
