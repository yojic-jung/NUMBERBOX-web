import React, { useState, useEffect } from 'react';
import image from 'img/image.png';
import addImg from 'img/add.png';
import CustomSelectBox from 'web/common/CustomSelectBox';
import { nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_confirmBox } from 'js/common/common_nb.js';
import 'css/resourceFile/registerResource.css';
import hourglass from 'img/hourglass.gif';

const RegisterResourceInp = ({ isUpdtMode, parentMethod }) => {
  const [mainCate, setMainCate] = useState(new Array()); // 사용자 입력 문제

  useEffect(() => {
    const asyncUseEffect = async function () {
      let resourceMenu = await nb_dataFetch('/mathInfo/takeResourceMenu', true);
      setMainCate(resourceMenu['resourceMenuList']);
      if (!isUpdtMode) document.getElementById('registerResource').classList.add('active');
    };
    asyncUseEffect();
  }, []);

  const validUI = async (event) => {
    let targetId = event.target.id;
    if (targetId === 'title') {
      if (document.getElementById(targetId).value.length > 0 && document.getElementById(targetId).value.length < 11) {
        document.getElementById(targetId).classList.remove('redBoxValid');
        document.getElementById('titleValDesc').innerText = '';
      }
    }
  };

  const changeHandler = async (event) => {
    let target = event.target;
    target.classList.remove('redBoxValid');
    if (target.value === '0') {
      target.classList.add('bageText');
    } else {
      target.classList.remove('bageText');
    }

    let selectedIdx = target.options.selectedIndex;
    let parentKey = target[selectedIdx].value;
    document.querySelectorAll('#midCate option').forEach((element, idx) => {
      if (idx === 0) {
        element.classList.remove('hide');
        return;
      }
      if (element.dataset.parentKey === parentKey) element.classList.remove('hide');
      else element.classList.add('hide');
    });
    document.getElementById('midCate').value = '0';
    document.getElementById('midCate').classList.add('bageText');
  };

  const validUiHandler = async (event) => {
    let target = event.target;
    target.classList.remove('redBoxValid');
    if (target.value === '0') {
      target.classList.add('bageText');
    } else {
      let alreadyCateBtn = document.querySelectorAll('.userCateBtn');
      if (alreadyCateBtn.length === 5) {
        return;
      }

      let cateNo = document.getElementById('mainCate').value + '-' + document.getElementById('midCate').value;
      for (let i = 0; i < alreadyCateBtn.length; i++) {
        if (alreadyCateBtn[i].dataset.cateNo === cateNo) return;
      }
      let userCateWrap = document.createElement('div');
      userCateWrap.className = 'userCateWrap';
      let userCate = document.createElement('span');
      userCate.className = 'userCateBtn';
      userCate.dataset.cateNo = cateNo;
      let mainText = document.querySelectorAll('#mainCate option')[document.getElementById('mainCate').selectedIndex].text;
      let midText = document.querySelectorAll('#midCate option')[document.getElementById('midCate').selectedIndex].text;
      let userCateDel = document.createElement('span');
      userCateDel.className = 'cate-del';
      userCateDel.innerText = 'x';
      userCateDel.addEventListener('click', function (event) {
        event.target.closest('.userCateWrap').remove();
      });

      userCate.innerHTML = mainText + '-' + midText;
      userCate.append(userCateDel);
      userCateWrap.append(userCate);
      document.getElementById('userCateDiv').append(userCateWrap);
      target.classList.remove('bageText');
    }
  };

  const imgFileChange = async (event) => {
    if (event.target.files[0] === undefined) {
      document.getElementById('representImg').src = image;
    } else {
      let fileNames = event.target.files[0].name.split('.');
      let filetype = fileNames[fileNames.length - 1].toUpperCase();
      if (!(filetype === 'PNG' || filetype == 'JPG' || filetype == 'GIF' || filetype == 'PNG' || filetype == 'JPEG' || filetype == 'BMP')) {
        alert('이미지 파일만 등록 가능합니다.(PNG, JPG, GIF, PNG, JPEG, BMP 확장자만 가능)');
        document.getElementById('imgFile').value = '';
        document.getElementById('representImg').src = image;
        return false;
      }

      if (fileNames[0].length > 40) {
        alert('파일이름은 40글자 미만으로 설정해주시기 바랍니다.');
        document.getElementById('imgFile').value = '';
        document.getElementById('representImg').src = image;
        return false;
      }

      if (event.target.files[0].size > 1024 * 1024 * 3) {
        alert('파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.');
        document.getElementById('imgFile').value = '';
        document.getElementById('representImg').src = image;
        return false;
      }

      await nb_loadFile(event, 'representImg', undefined);
      document.getElementById('imgDiv').classList.remove('redBoxValid');
    }
  };

  const pptFileChange = async (event) => {
    if (event.target.files[0] === undefined) {
      document.getElementById('pptFileCustomDesc').innerText = 'choose File...';
    } else {
      let fileNames = event.target.files[0].name.split('.');
      let filetype = fileNames[fileNames.length - 1].toUpperCase();
      if (!(filetype === 'PPT' || filetype === 'PPTX')) {
        alert('ppt 파일만 등록 가능합니다.(PPT, PPTX 확장자만 가능)');
        document.getElementById('pptFile').value = '';
        document.getElementById('pptFileCustomDesc').innerText = 'choose File...';
        return false;
      }

      if (fileNames[0].length > 40) {
        alert('파일이름은 40글자 미만으로 설정해주시기 바랍니다.');
        document.getElementById('pptFile').value = '';
        document.getElementById('pptFileCustomDesc').innerText = 'choose File...';
        return false;
      }

      if (event.target.files[0].size > 1024 * 1024 * 3) {
        alert('파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.');
        document.getElementById('pptFile').value = '';
        document.getElementById('pptFileCustomDesc').innerText = 'choose File...';
        return false;
      }

      document.getElementById('pptFileCustomDesc').innerText = event.target.files[0].name;
      document.getElementById('pptDiv').classList.remove('redBoxValid');
    }
  };

  const resourceSubmit = async () => {
    let formData = new FormData(document.getElementById('resourceForm'));

    let isValid = true;
    if (formData.get('title').length === 0 || formData.get('title').length > 15) {
      document.getElementById('titleValDesc').innerText = '컨텐츠 타이틀(15글자 이하)';
      document.getElementById('title').classList.add('redBoxValid');
      isValid = false;
    }
    let alreadyCateBtn = document.querySelectorAll('.userCateBtn');
    if (alreadyCateBtn.length === 0) {
      document.getElementById('mainCate').classList.add('redBoxValid');
      document.getElementById('midCate').classList.add('redBoxValid');
      isValid = false;
    }

    if (!isUpdtMode && formData.get('pptFile').name === '') {
      document.getElementById('pptDiv').classList.add('redBoxValid');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (isUpdtMode) {
      if (formData.get('pptFile').name === '' || formData.get('imgFile').name === '') {
        nb_confirmBox('ppt파일 또는 대표 이미지를 수정하지 않으신 경우\n기존의 파일이 그대로 저장됩니다.');
      } else {
        resourceUpdate();
      }
      return;
    }

    let cateList = '';
    for (let i = 0; i < alreadyCateBtn.length; i++) {
      if (i === 0) {
        cateList = alreadyCateBtn[i].dataset.cateNo;
      } else {
        cateList += ',' + alreadyCateBtn[i].dataset.cateNo;
      }
    }
    formData.append('cateList', cateList);

    document.getElementById('resDetailedTimeDesc').classList.remove('hide');
    document.getElementById('hourGlassDesc').innerText = 'ppt를 등록하는데 시간이 걸릴 수 있습니다.\n잠시만 기다려 주세요...';
    let returnVal = await nb_formDataFetch('/mathInfo/registerResource', formData, false);
    document.getElementById('resDetailedTimeDesc').classList.add('hide');
    if (returnVal.isSuccess === true) {
      await nb_fadeInOutA('컨텐츠가 정상적으로 등록 되었습니다.\n나의 컨텐츠 페이지에서 확인 가능합니다.', 2000);
      document.getElementById('resourceForm').reset();
      document.getElementById('representImg').src = image;
      document.getElementById('pptFileCustomDesc').innerText = 'choose File...';
      document.getElementById('mainCate').classList.add('bageText');
      document.getElementById('midCate').classList.add('bageText');
      for (let i = 0; i < alreadyCateBtn.length; i++) {
        cateList = alreadyCateBtn[i].parentElement.remove();
      }
    } else {
      if (!returnVal.existMsg) {
        await nb_fadeInOutB('컨텐츠 등록에 실패하였습니다. 다시 시도해주세요.', 2000);
      }
    }
  };

  const resourceUpdate = async () => {
    let formData = new FormData(document.getElementById('resourceForm'));
    let alreadyCateBtn = document.querySelectorAll('.userCateBtn');
    let cateList = '';
    for (let i = 0; i < alreadyCateBtn.length; i++) {
      if (i === 0) {
        cateList = alreadyCateBtn[i].dataset.cateNo;
      } else {
        cateList += ',' + alreadyCateBtn[i].dataset.cateNo;
      }
    }
    formData.append('cateList', cateList);

    document.getElementById('confirmBoxClose').click();
    document.getElementById('resDetailedTimeDesc').classList.remove('hide');
    document.getElementById('hourGlassDesc').innerText = 'ppt를 등록하는데 시간이 걸릴 수 있습니다.\n잠시만 기다려 주세요...';
    let returnVal = await nb_formDataFetch('/mathInfo/updateResource', formData, false);
    document.getElementById('resDetailedTimeDesc').classList.add('hide');

    if (returnVal.isSuccess === true) {
      await nb_fadeInOutA('컨텐츠가 정상적으로 수정 되었습니다.', 2000);
      document.getElementById('updateResouceClose').click();
      parentMethod(returnVal.newMathResource);
      //수정된 컨텐츠로 초기화
    } else {
      if (!returnVal.existMsg) {
        await nb_fadeInOutB('컨텐츠 수정에 실패하였습니다. 다시 시도해주세요.', 2000);
      }
    }
  };

  return (
    <>
      <div className={isUpdtMode ? 'updateResCenterDiv' : ''}>
        <table className={isUpdtMode ? 'regResourceTb marginZero' : 'regResourceTb '}>
          <tbody>
            {isUpdtMode && (
              <>
                <tr>
                  <td colSpan={2}>
                    <div className='regResUpdtTitle'>컨텐츠 수정하기</div>
                    <div
                      id='updateResouceClose'
                      className='closeBtn2'
                      onClick={() => {
                        document.getElementById('updateResouce').classList.add('hide');
                      }}>
                      X
                    </div>
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td>
                <span>타이틀</span>{' '}
              </td>
              <td>
                <input id='title' type='text' name='title' className='regResTitle' placeholder='컨텐츠 타이틀 (15글자 이하)' onKeyUp={(event) => validUI(event)} />
                <div id='titleValDesc' className='redText2'></div>
              </td>
            </tr>
            <tr>
              <td>
                <span>카테고리</span>
              </td>
              <td>
                <CustomSelectBox
                  id='mainCate'
                  className='bageText'
                  name='mainCateNo'
                  firstVal='카테고리'
                  optList={mainCate}
                  val='mainCateNo'
                  unitName='mainCateName'
                  changeHandler={changeHandler}></CustomSelectBox>
              </td>
            </tr>
            <tr>
              <td>
                <span>세부 카테고리</span>
              </td>
              <td>
                <CustomSelectBox
                  id='midCate'
                  className='bageText'
                  name='midCateNo'
                  firstVal='세부 카테고리'
                  optList={mainCate}
                  val='midCateNo'
                  parentKey='mainCateNo'
                  unitName='midCateName'
                  displayMode='hide'
                  changeHandler={validUiHandler}></CustomSelectBox>
                <div className='regResourceDesc'>카테고리는 최대 5개까지 선택 가능합니다.</div>
              </td>
            </tr>
            <tr>
              <td colSpan='2' className='paddingZero'>
                <div id='userCateDiv' className='userCateDiv'></div>
              </td>
            </tr>
            <tr>
              <td>ppt파일</td>
              <td>
                <input
                  id='pptFile'
                  type='file'
                  name='pptFile'
                  className='hide'
                  onChange={(event) => {
                    pptFileChange(event);
                  }}
                />
                <span
                  id='pptDiv'
                  className='center'
                  onClick={() => {
                    document.getElementById('pptFile').click();
                  }}>
                  <span id='pptFileCustomDesc' className='imgFileCustomDesc'>
                    choose File...
                  </span>
                  <span className='imgFileCustomBtn2'>UPLOAD</span>
                </span>
                <div className='regResourceDesc'>ppt 파일만 등록 가능합니다.(PPT, PPTX 확장자만 가능)</div>
              </td>
            </tr>

            <tr>
              <td>
                <span>대표 이미지</span>
                <sup>(선택)</sup>
              </td>
              <td className='relative'>
                <span id='imgDiv' className='imgDiv'>
                  <img
                    id='representImg'
                    className='representImg'
                    src={image}
                    alt='대표이미지'
                    onClick={() => {
                      document.getElementById('imgFile').click();
                    }}
                  />
                  <img
                    id='regRepImg'
                    className='regRepImg'
                    src={addImg}
                    alt='이미지 등록'
                    onClick={() => {
                      document.getElementById('imgFile').click();
                    }}
                  />
                  <input
                    id='imgFile'
                    type='file'
                    name='imgFile'
                    accept='image/*'
                    className='hide'
                    onChange={(event) => {
                      imgFileChange(event);
                    }}
                  />
                </span>
                <div className='regResourceDesc'>
                  대표 이미지를 설정하지 않는 경우
                  <br />
                  ppt의 첫번째 슬라이드가 대표이미지로 지정됩니다.
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan='2'>
                <div className='submit-btn' onClick={() => resourceSubmit()}>
                  등록
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id='confirmBoxScreen' className='confirmBoxScreen hide'>
        <div id='confirmBox' className='confirmBox'>
          <div className='confirmBoxTop'>
            <span
              id='confirmBoxClose'
              className='confirmBoxClose'
              onClick={() => {
                document.getElementById('confirmBoxScreen').classList.add('hide');
              }}>
              X
            </span>
          </div>
          <div id='confirmMsg' className='confirmMsg'></div>
          <div className='alignCenter'>
            <span
              id='confirmBoxCnclBtn'
              className='confirmBoxCnclBtn'
              onClick={() => {
                document.getElementById('confirmBoxScreen').classList.add('hide');
              }}>
              취소
            </span>
            <span
              id='confirmBoxBtn'
              className='confirmBoxBtn'
              onClick={() => {
                resourceUpdate();
              }}>
              확인
            </span>
          </div>
        </div>
      </div>
      <div id='resDetailedTimeDesc' className='blindBox hide'>
        <div id='hourGlassBox' className='resDetailedTimeDesc'>
          <div>
            <img className='hourglass' src={hourglass} alt='' />
          </div>
          <div id='hourGlassDesc'></div>
        </div>
      </div>
    </>
  );
};

export default RegisterResourceInp;
