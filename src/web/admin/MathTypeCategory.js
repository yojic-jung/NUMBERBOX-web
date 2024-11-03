import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { nb_dataFetch, nb_formDataFetch, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin, nb_isTopTester, nb_getRequest } from 'js/common/common_nb.js';
import { reg_convertSpanToNoTag, reg_removeStyleAttribute } from 'js/contents/register/contents_reg';

const MathTypeCategory = () => {
  let isAdmin = nb_isAdmin();
  let isTopTester = nb_isTopTester();
  let isTypeAppended = false; //유형변경, 삭제, 문제이동, 유형 추가 후 다시 초기화 할때, 유형 새롭게 모두 가져왔는지 구분 변수
  const [subjectList, setSubjectList] = useState(new Array());
  const [mathTypePopupContents, setMathTypePopupContents] = useState(new Array());

  useEffect(() => {
    const asyncUseEffect = async function () {
      if (!(isAdmin || isTopTester)) window.location.href = '/';
      let jsonObj = await nb_dataFetch('/math/menu/unit', true);
      setSubjectList(jsonObj.data['subjectList']);
      unitListSetFunction(jsonObj.data['subjectList'], jsonObj.data['firUnitList'], jsojsonObj.datanObj['secUnitList']);
    };
    asyncUseEffect();
  }, []);

  const unitFoldClickFunction = (event, btnWrapClassName, foldBtnClassName) => {
    let typeBtnWrap = event.target.parentElement.querySelectorAll(btnWrapClassName);
    let foldBtn = event.target.parentElement.querySelector(foldBtnClassName);
    if (foldBtn.classList.contains('active')) {
      foldBtn.classList.remove('active');
      for (let i = 0; i < typeBtnWrap.length; i++) {
        typeBtnWrap[i].classList.add('hide');
      }
    } else {
      foldBtn.classList.add('active');
      for (let i = 0; i < typeBtnWrap.length; i++) {
        typeBtnWrap[i].classList.remove('hide');
      }
    }
  };

  const subTypeChangeFunction = async (event) => {
    await mathTypeChangeCncl();
    let jsonObj = await nb_dataFetch('/mathInfo/takeConCntByUnitUniqNo?unitId=' + event.target.dataset.unitId, true);
    jsonObj = jsonObj.cntList;

    document.getElementById('mathTypeChngPopupDiv').classList.remove('hide');
    document.getElementById('mathTypeAddBtn').dataset.unitId = event.target.dataset.unitId;

    let typeBtn = event.target.closest('.thrUnitBtnWrap').querySelectorAll('.typeBtn');
    document.getElementById('mathTypeChngPopupTitle').innerHTML = event.target.closest('.thrUnitBtnWrap').querySelector('.thrUnitBtn').innerHTML;

    let contents = new Array();
    for (let i = 0; i < typeBtn.length; i++) {
      let conCnt = 0;
      for (let j = 0; j < jsonObj.length; j++) {
        if (parseInt(typeBtn[i].dataset.unitId) === jsonObj[j].unitId && parseInt(typeBtn[i].dataset.typeId) === jsonObj[j].typeId) {
          conCnt = jsonObj[j].cnt;
        }
      }
      let typeContents = {
        typeContents: typeBtn[i].innerHTML,
        unitId: typeBtn[i].dataset.unitId,
        typeId: typeBtn[i].dataset.typeId,
        conCnt: conCnt,
      };

      contents.push(typeContents);
    }
    setMathTypePopupContents(contents);
  };

  const unitListSetFunction = (subjectList, secUnitList, thrUnitList) => {
    for (let i = 0; i < subjectList.length; i++) {
      let tmpDiv = document.createElement('div');
      tmpDiv.className = 'subjectBtnWrap hide';
      tmpDiv.dataset.subjectInfo = subjectList[i].unitName;
      let tmpSpanFoldBtn = document.createElement('span');
      tmpSpanFoldBtn.innerHTML = '&#10095;';
      tmpSpanFoldBtn.className = 'subjectFoldBtn active';
      tmpSpanFoldBtn.addEventListener('click', (event) => unitFoldClickFunction(event, '.secUnitBtnWrap', '.subjectFoldBtn'));
      tmpDiv.append(tmpSpanFoldBtn);
      let tmpSpan = document.createElement('span');
      tmpSpan.innerHTML = subjectList[i].unitName;
      tmpSpan.className = 'subjectBtn';
      tmpSpan.addEventListener('click', (event) => unitFoldClickFunction(event, '.secUnitBtnWrap', '.subjectFoldBtn'));
      tmpDiv.append(tmpSpan);
      document.getElementsByClassName('mathDocsSubjectListDiv')[0].append(tmpDiv);
    }

    let subjectBtnList = document.getElementsByClassName('subjectBtnWrap');
    for (let i = 0; i < subjectBtnList.length; i++) {
      for (let j = 0; j < secUnitList.length; j++) {
        if (subjectBtnList[i].dataset.subjectInfo === secUnitList[j].parentVal) {
          let tmpDiv = document.createElement('div');
          tmpDiv.dataset.secUnitInfo = secUnitList[j].unitName;
          tmpDiv.className = 'secUnitBtnWrap';
          let tmpSpanFoldBtn = document.createElement('span');
          tmpSpanFoldBtn.innerHTML = '&#10095;';
          tmpSpanFoldBtn.className = 'secUnitFoldBtn';
          tmpSpanFoldBtn.addEventListener('click', (event) => unitFoldClickFunction(event, '.thrUnitBtnWrap', '.secUnitFoldBtn'));
          tmpDiv.append(tmpSpanFoldBtn);
          let tmpSpan = document.createElement('span');
          tmpSpan.innerHTML = secUnitList[j].unitName;
          tmpSpan.className = 'secUnitBtn';
          tmpSpan.addEventListener('click', (event) => unitFoldClickFunction(event, '.thrUnitBtnWrap', '.secUnitFoldBtn'));
          tmpDiv.append(tmpSpan);
          subjectBtnList[i].append(tmpDiv);
        }
      }
    }

    let secUnitBtnList = document.getElementsByClassName('secUnitBtnWrap');
    for (let i = 0; i < secUnitBtnList.length; i++) {
      for (let j = 0; j < thrUnitList.length; j++) {
        if (secUnitBtnList[i].dataset.secUnitInfo === thrUnitList[j].parentVal) {
          let tmpDiv = document.createElement('div');
          tmpDiv.dataset.thrUnitInfo = thrUnitList[j].unitName;
          tmpDiv.className = 'thrUnitBtnWrap hide';
          let tmpSpanFoldBtn = document.createElement('span');
          tmpSpanFoldBtn.innerHTML = '&#10095;';
          tmpSpanFoldBtn.className = 'thrUnitFoldBtn';
          tmpSpanFoldBtn.addEventListener('click', (event) => unitFoldClickFunction(event, '.typeBtnWrap', '.thrUnitFoldBtn'));
          tmpDiv.append(tmpSpanFoldBtn);

          let tmpSpan = document.createElement('span');
          tmpSpan.innerHTML = thrUnitList[j].unitName;
          tmpSpan.className = 'thrUnitBtn';
          tmpSpan.dataset.unitId = thrUnitList[j].unitId;
          tmpSpan.addEventListener('click', (event) => unitFoldClickFunction(event, '.typeBtnWrap', '.thrUnitFoldBtn'));

          let tmpSubAdd = document.createElement('span');
          tmpSubAdd.innerHTML = '하위유형 편집';
          tmpSubAdd.className = 'subTypeAddBtn';
          tmpSubAdd.dataset.unitId = thrUnitList[j].unitId;
          tmpSubAdd.addEventListener('click', subTypeChangeFunction);

          tmpDiv.append(tmpSpan);
          tmpDiv.append(tmpSubAdd);
          secUnitBtnList[i].append(tmpDiv);
        }
      }
    }
  };
  const unitSelect = async (event) => {
    isTypeAppended = false;
    let subjectBtnWrap = document.getElementsByClassName('subjectBtnWrap');
    for (let i = 0; i < subjectBtnWrap.length; i++) {
      if (!event.target.classList.contains('active')) {
        if (event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo) {
          subjectBtnWrap[i].classList.remove('hide');
          console.log(event.target.dataset.typeExist);
          if (event.target.dataset.typeExist === 'false') {
            let unitIdList = '';
            let thrUnitBtn = subjectBtnWrap[i].querySelectorAll('.thrUnitBtn');
            console.log(thrUnitBtn);
            for (let j = 0; j < thrUnitBtn.length; j++) {
              if (j === 0) {
                unitIdList += thrUnitBtn[j].dataset.unitId;
              } else {
                unitIdList += ',' + thrUnitBtn[j].dataset.unitId;
              }
            }
            console.log(unitIdList);
            let jsonObj = await nb_getRequest('/math/menu/type?unitIdList=' + unitIdList, true);
            let thrUnitBtnWrap = subjectBtnWrap[i].querySelectorAll('.thrUnitBtnWrap');
            let mathTypeInfoList = jsonObj.data.mathTypeList;
            for (let j = 0; j < thrUnitBtnWrap.length; j++) {
              let typeBtnWrap = thrUnitBtnWrap[j].querySelectorAll('.typeBtnWrap');
              for (let k = 0; k < typeBtnWrap.length; k++) {
                typeBtnWrap[k].remove();
              }

              for (let k = 0; k < mathTypeInfoList.length; k++) {
                if (thrUnitBtnWrap[j].querySelector('.thrUnitBtn').dataset.unitId === mathTypeInfoList[k].unitId) {
                  let tmpDiv = document.createElement('div');
                  if (thrUnitBtnWrap[j].querySelector('.thrUnitFoldBtn').classList.contains('active')) {
                    tmpDiv.className = 'typeBtnWrap admin';
                  } else {
                    tmpDiv.className = 'typeBtnWrap hide admin';
                  }

                  let tmpSpan = document.createElement('span');
                  tmpSpan.innerHTML = mathTypeInfoList[k].quesType;
                  tmpSpan.className = 'typeBtn admin';
                  tmpSpan.dataset.unitId = mathTypeInfoList[k].unitId;
                  tmpSpan.dataset.typeId = mathTypeInfoList[k].typeId;
                  tmpDiv.append(tmpSpan);
                  thrUnitBtnWrap[j].append(tmpDiv);
                }
              }
            }
            isTypeAppended = true;
            event.target.dataset.typeExist = 'true';
          }
        }
      } else {
        if (event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo) {
          subjectBtnWrap[i].classList.add('hide');
          let activeBtn = subjectBtnWrap[i].querySelectorAll('.active');
          for (let i = 0; i < activeBtn.length; i++) {
            if (!(activeBtn[i].classList.contains('subjectFoldBtn') || activeBtn[i].classList.contains('secUnitFoldBtn') || activeBtn[i].classList.contains('thrUnitFoldBtn'))) {
              activeBtn[i].classList.remove('active');
            }
          }
        }
      }
    }
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
    } else {
      event.target.classList.add('active');
    }
  };

  const subjectInfoList = subjectList.map((subjectInfo) => {
    //중등인 경우
    if (subjectInfo.unitName.includes('중등')) {
      if (subjectInfo.unitName.includes('1-1')) {
        return (
          <span key={subjectInfo.unitId}>
            <span className='mathDocsGrade'>중등</span>
            <span
              className='mathDocsUnitBtn'
              data-subject-info={subjectInfo.unitName}
              data-type-exist='false'
              onClick={(event) => {
                unitSelect(event);
              }}>
              {subjectInfo.unitName.replace('중등 ', '')}
            </span>
          </span>
        );
      }
      if (subjectInfo.unitName.includes('3-2')) {
        return (
          <span key={subjectInfo.unitId}>
            <span
              className='mathDocsUnitBtn'
              data-subject-info={subjectInfo.unitName}
              data-type-exist='false'
              onClick={(event) => {
                unitSelect(event);
              }}>
              {subjectInfo.unitName.replace('중등 ', '')}
            </span>
            <br />
          </span>
        );
      }
      return (
        <span
          className='mathDocsUnitBtn'
          key={subjectInfo.unitId}
          data-subject-info={subjectInfo.unitName}
          data-type-exist='false'
          onClick={(event) => {
            unitSelect(event);
          }}>
          {subjectInfo.unitName.replace('중등 ', '')}
        </span>
      );
    } else if (subjectInfo.unitName.includes('고등')) {
      if (subjectInfo.unitName.includes('고등수학')) {
        return (
          <span key={subjectInfo.unitId}>
            <span className='mathDocsGrade'>고등</span>
            <span
              className='mathDocsUnitBtn'
              data-subject-info={subjectInfo.unitName}
              data-type-exist='false'
              onClick={(event) => {
                unitSelect(event);
              }}>
              {subjectInfo.unitName}
            </span>
          </span>
        );
      }
    } else {
      return (
        <span
          className='mathDocsUnitBtn'
          key={subjectInfo.unitId}
          data-subject-info={subjectInfo.unitName}
          data-type-exist='false'
          onClick={(event) => {
            unitSelect(event);
          }}
          dangerouslySetInnerHTML={{ __html: subjectInfo.unitName }}></span>
      );
    }
  });

  const mathTypeChangeApply = async (event, mathTypeId) => {
    let unitId = event.target.dataset.unitId;
    let typeId = event.target.dataset.typeId;
    let quesType = document.getElementById(mathTypeId).innerHTML;
    let formData = new FormData();
    formData.append('unitId', unitId);
    formData.append('typeId', typeId);
    formData.append('quesType', quesType);

    let returnObj = await nb_formDataFetch('/mathInfo/changeQuesType', formData, true);
    if (returnObj.isSuccess) {
      await typeChngInitFunction(unitId);

      await nb_fadeInOutA('정상적으로 변경되었습니다.', 2000);
      await mathTypeChangeCncl();
      document.getElementById('mathTypeAddPopupBtn').classList.remove('hidden');
    } else {
      await nb_fadeInOutB('유형 변경에 실패하였습니다. 다시 시도해주세요.', 2000);
    }
  };

  const mathTypeDel = async (event, conCnt) => {
    if (conCnt > 0) {
      alert('해당유형에 문제가 존재하는 경우 삭제할 수 없습니다.');
      return false;
    }
    let inputVal = prompt("삭제를 진행하실 경우 '삭제'라고 따옴표 없이 입력해주세요.", '');
    if (inputVal !== '삭제') {
      await nb_fadeInOutB('삭제라고 입력해주시기 바랍니다.', 2000);
      return false;
    }

    let jsonObj = await nb_dataFetch('/mathInfo/typeDel?unitId=' + event.target.dataset.unitId + '&typeId=' + event.target.dataset.typeId, 2000);
    if (jsonObj.isSuccess) {
      await typeChngInitFunction(event.target.dataset.unitId);

      await nb_fadeInOutA('정상적으로 삭제되었습니다.', 2000);
    } else {
      await nb_fadeInOutB('삭제에 실패하였습니다.\n해당 유형에 문제가 존재하는 경우 삭제할 수 없습니다.', 2500);
    }
  };

  const mathContentsMoveSel = async (event) => {
    document.getElementById('mathTypeAddPopupBtn').classList.add('hidden');
    document.getElementById('mathTypeOrderChngBtn').classList.add('hidden');
    let typeChngBtnWrap = document.getElementsByClassName('typeChngBtnWrap');
    for (let i = 0; i < typeChngBtnWrap.length; i++) {
      typeChngBtnWrap[i].classList.add('hide');
    }

    event.target.closest('.typeChngBtnRootWrap').querySelector('.conMoveCnclBtnWrap').classList.remove('hide');

    let contentsMoveToBtn = document.getElementsByClassName('contentsMoveToBtn');
    for (let i = 0; i < contentsMoveToBtn.length; i++) {
      contentsMoveToBtn[i].classList.remove('hide');
      contentsMoveToBtn[i].classList.remove('from');
      contentsMoveToBtn[i].innerHTML = 'TO';
    }
    event.target.closest('.mathTypeChngPopupContentsTB').querySelector('.contentsMoveToBtn').classList.add('from');
    event.target.closest('.mathTypeChngPopupContentsTB').querySelector('.contentsMoveToBtn').innerHTML = 'FROM';
  };

  const mathContentsMoveTo = async (event) => {
    if (event.target.classList.contains('from')) {
      await nb_fadeInOutB('이동하려는 문제의 유형과 같은 유형을 선택할 수 없습니다.', 2500);
      return false;
    }

    let contentsMoveToBtn = document.getElementsByClassName('contentsMoveToBtn');
    for (let i = 0; i < contentsMoveToBtn.length; i++) {
      contentsMoveToBtn[i].classList.remove('to');
    }

    event.target.classList.add('to');
  };

  const mathTypeChange = async (event, mathTypeId) => {
    await mathTypeChangeCncl();
    document.getElementById('mathTypeAddPopupBtn').classList.add('hidden');
    document.getElementById('mathTypeOrderChngBtn').classList.add('hidden');
    let typeChngBtnWrap = document.getElementsByClassName('typeChngBtnWrap');
    for (let i = 0; i < typeChngBtnWrap.length; i++) {
      typeChngBtnWrap[i].classList.add('hide');
    }
    event.target.closest('.typeChngBtnRootWrap').querySelector('.typeConChngBtnWrap').classList.remove('hide');
    document.getElementById(mathTypeId).setAttribute('contentEditable', true);
    document.getElementById(mathTypeId).classList.add('active');
    window.getSelection().selectAllChildren(document.getElementById(mathTypeId));
    window.getSelection().collapseToEnd();
  };

  const mathTypePopupOpen = async () => {
    document.getElementById('mathTypeAddContents').innerHTML = '';
    document.getElementById('mathTypeAddRootDiv').classList.remove('hide');
    document.getElementById('mathTypeAddContents').focus();
  };

  const mathContentsMoveApply = async () => {
    let contentsMoveToBtn = document.getElementsByClassName('contentsMoveToBtn');
    let fromUnitId = 0;
    let fromTypeId = 0;
    let toUnitId = 0;
    let toTypeId = 0;
    for (let i = 0; i < contentsMoveToBtn.length; i++) {
      if (contentsMoveToBtn[i].classList.contains('from')) {
        fromUnitId = contentsMoveToBtn[i].dataset.unitId;
        fromTypeId = contentsMoveToBtn[i].dataset.typeId;
      }

      if (contentsMoveToBtn[i].classList.contains('to')) {
        toUnitId = contentsMoveToBtn[i].dataset.unitId;
        toTypeId = contentsMoveToBtn[i].dataset.typeId;
      }
    }

    if (fromUnitId === 0 || fromTypeId === 0 || toUnitId === 0 || toTypeId === 0) {
      await nb_fadeInOutB('이동하려는 유형을 선택해주세요.', 2500);
      return false;
    }

    let inputVal = prompt('"FROM"으로 선택하신 유형에 속해 있는 문제를 "TO"로 선택하신 유형으로 이동 시키겠습니까?\n이동시키려면 "예"라고 따옴표 없이 입력해주세요.');

    if (inputVal === '예') {
      let returnObj = await nb_dataFetch(
        '/mathInfo/contentsMoveFromTo?fromUnitId=' + fromUnitId + '&fromTypeId=' + fromTypeId + '&toUnitId=' + toUnitId + '&toTypeId=' + toTypeId,
        true
      );
      if (returnObj.isSuccess) {
        await nb_fadeInOutA('정상적으로 진행되었습니다.', 2000);
        document.getElementById('mathTypeAddPopupBtn').classList.remove('hidden');
        document.getElementById('mathTypeChngPopupCloseBtn').click();
        let subTypeAddBtn = document.getElementsByClassName('subTypeAddBtn');
        for (let i = 0; i < subTypeAddBtn.length; i++) {
          if (subTypeAddBtn[i].dataset.unitId === fromUnitId) {
            subTypeAddBtn[i].click();
          }
        }
      } else {
        await nb_fadeInOutB('문제 이동에 실패하였습니다. 다시 시도해주세요.', 2500);
      }
    } else {
      await nb_fadeInOutB('잘못 입력하였습니다.\n문제 이동을 원할 경우 다시 입력해주세요.', 2500);
    }
  };

  const mathTypeChngInit = async (event) => {
    let unitId = event.target.dataset.unitId;
    let typeId = event.target.dataset.typeId;
    let typeBtn = document.getElementsByClassName('typeBtn');
    for (let i = 0; i < typeBtn.length; i++) {
      if (typeBtn[i].dataset.unitId === unitId && typeBtn[i].dataset.typeId === typetypeIdNo) {
        document.getElementById('mathType-' + unitId + '-' + typeId).innerHTML = typeBtn[i].innerHTML;
      }
    }
  };

  const mathTypeChangeCncl = async () => {
    document.getElementById('mathTypeAddPopupBtn').classList.remove('hidden');
    document.getElementById('mathTypeOrderChngBtn').classList.remove('hidden');
    let typeChngBtnWrap = document.getElementsByClassName('typeChngBtnWrap');
    for (let i = 0; i < typeChngBtnWrap.length; i++) {
      typeChngBtnWrap[i].classList.remove('hide');
    }

    let typeConChngBtnWrap = document.getElementsByClassName('typeConChngBtnWrap');
    for (let i = 0; i < typeConChngBtnWrap.length; i++) {
      typeConChngBtnWrap[i].classList.add('hide');
    }

    let conMoveCnclBtnWrap = document.getElementsByClassName('conMoveCnclBtnWrap');
    for (let i = 0; i < conMoveCnclBtnWrap.length; i++) {
      conMoveCnclBtnWrap[i].classList.add('hide');
    }

    let contentsMoveToBtn = document.getElementsByClassName('contentsMoveToBtn');
    for (let i = 0; i < contentsMoveToBtn.length; i++) {
      contentsMoveToBtn[i].classList.add('hide');
      contentsMoveToBtn[i].classList.remove('from');
      contentsMoveToBtn[i].classList.remove('to');
    }

    let mathTypeContents = document.getElementsByClassName('mathTypeContents');
    for (let i = 0; i < mathTypeContents.length; i++) {
      mathTypeContents[i].setAttribute('contentEditable', false);
      mathTypeContents[i].classList.remove('active');
    }
  };

  const tagStyleRemove = async (event) => {
    //span 태그 없애기
    await reg_convertSpanToNoTag(event.target.id);

    //수식요소 및 div 태그 스타일 직접 적용된 경우 제거
    await reg_removeStyleAttribute(event.target.id);
  };

  const typeChngInitFunction = async (unitId) => {
    document.getElementById('mathTypeChngPopupCloseBtn').click();

    let mathDocsUnitBtn = document.getElementsByClassName('mathDocsUnitBtn');

    for (let i = 0; i < mathDocsUnitBtn.length; i++) {
      if (mathDocsUnitBtn[i].classList.contains('active')) {
        mathDocsUnitBtn[i].dataset.typeExist = 'false';
        mathDocsUnitBtn[i].click();
        mathDocsUnitBtn[i].click();
        //찾기
      }
    }

    let interval = setInterval(() => {
      if (isTypeAppended) {
        let subTypeAddBtn = document.getElementsByClassName('subTypeAddBtn');
        for (let i = 0; i < subTypeAddBtn.length; i++) {
          if (subTypeAddBtn[i].dataset.unitId === unitId) {
            subTypeAddBtn[i].click();
          }
        }
        clearInterval(interval);
      }
    }, 100);
  };

  const mathTypeAdd = async (event) => {
    let formData = new FormData();
    formData.append('unitId', event.target.dataset.unitId);
    formData.append('quesType', document.getElementById('mathTypeAddContents').innerHTML);
    let returnObj = await nb_formDataFetch('/mathInfo/mathTypeAdd', formData, true);

    if (returnObj.isSuccess) {
      document.getElementById('mathTypeAddRootDivClose').click();
      await typeChngInitFunction(event.target.dataset.unitId);

      await nb_fadeInOutA('정상적으로 추가되었습니다.', 2000);
    } else {
      await nb_fadeInOutB('유형 추가에 실패하였습니다.\n다시 시도해주세요.', 2500);
    }
  };

  const mathTypeOrderChng = async () => {
    let mathType = document.getElementsByClassName('mathTypeChngPopupContentsTB');
    let formData = new FormData();
    for (let i = 0; i < mathType.length; i++) {
      let mathTypeArr = mathType[i].dataset.id.split('-');
      formData.append('mathTypeInfoModel[' + i + '].unitId', mathTypeArr[0]);
      formData.append('mathTypeInfoModel[' + i + '].typeId', mathTypeArr[1]);
      formData.append('mathTypeInfoModel[' + i + '].typeOrder', i + 1);
    }
    let jsonObj = await nb_formDataFetch('/mathInfo/mathTypeOrderChng', formData, true);
    if (jsonObj.isSuccess) {
      await typeChngInitFunction(mathType[0].dataset.id.split('-')[0]);

      await nb_fadeInOutA('정상적으로 변경되었습니다.', 2000);
    } else {
      await nb_fadeInOutB('순서 변경에 실패하였습니다.\n다시 시도해주세요.', 2500);
    }
  };

  return (
    <>
      <div className='mathDocsSubjectInfoDiv'>{subjectInfoList}</div>
      <div className='mathDocsSubjectListDiv admin'></div>

      <div id='mathTypeChngPopupDiv' className='blindBox hide'>
        <div className='mathTypeChngPopupDiv'>
          <div
            id='mathTypeChngPopupCloseBtn'
            className='closeBtn2'
            onClick={() => {
              document.getElementById('mathTypeChngPopupDiv').classList.add('hide');
            }}>
            X
          </div>
          <div id='mathTypeChngPopupTitle' className='mathTypeChngPopupTitle'></div>
          <div className='alignRight'>
            <div
              id='mathTypeAddPopupBtn'
              className='mathTypeAddBtn'
              onClick={() => {
                mathTypePopupOpen();
              }}>
              유형추가
            </div>
          </div>
          <ReactSortable id='mathTypeChngPopupContents' list={mathTypePopupContents} animation={200} setList={setMathTypePopupContents}>
            {mathTypePopupContents.map((contents, idx) => {
              let keyValue = contents.unitId + '-' + contents.typeId;
              let mathTypeId = 'mathType-' + contents.unitId + '-' + contents.typeId;
              let mathConCntId = 'mathConCnt-' + contents.unitId + '-' + contents.typeId;
              return (
                <table key={keyValue} className='mathTypeChngPopupContentsTB'>
                  <tbody>
                    <tr>
                      <td>
                        <button
                          type='button'
                          className='contentsMoveToBtn hide'
                          data-unit-id={contents.unitId}
                          data-type-id={contents.typeId}
                          onClick={(event) => {
                            mathContentsMoveTo(event);
                          }}>
                          TO
                        </button>
                      </td>
                      <td>
                        <div className='hamburger'>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </td>
                      <td>
                        <span className='popupTypeOrderNo'>{idx + 1}.</span>
                      </td>
                      <td>
                        <span id={mathConCntId} className='conCntByTypeId'>
                          {contents.conCnt}
                        </span>
                        <div
                          id={mathTypeId}
                          className='mathTypeContents'
                          dangerouslySetInnerHTML={{
                            __html: contents.typeContents,
                          }}
                          onKeyUp={(event) => {
                            tagStyleRemove(event);
                          }}></div>
                      </td>
                      <td className='typeChngBtnRootWrap'>
                        <div className='typeChngBtnWrap'>
                          <span
                            className='typeChngBtn'
                            data-unit-id={contents.unitId}
                            data-type-id={contents.typeId}
                            onClick={(event) => {
                              mathTypeChange(event, mathTypeId);
                            }}>
                            변경
                          </span>
                          <span
                            className='typeDelBtn'
                            data-unit-id={contents.unitId}
                            data-type-id={contents.typeId}
                            onClick={(event) => {
                              mathTypeDel(event, contents.conCnt);
                            }}>
                            삭제
                          </span>
                          <span
                            className='typeDelBtn'
                            data-unit-id={contents.unitId}
                            data-type-id={contents.typeId}
                            onClick={(event) => {
                              mathContentsMoveSel(event);
                            }}>
                            문제이동
                          </span>
                        </div>
                        <div className='typeConChngBtnWrap hide'>
                          <span
                            className='typeConCnclBtn'
                            data-unit-id={contents.unitId}
                            data-type-id={contents.typeId}
                            onClick={(event) => {
                              mathTypeChangeCncl();
                              mathTypeChngInit(event);
                            }}>
                            취소
                          </span>
                          <span
                            className='typeConChngBtn'
                            data-unit-id={contents.unitId}
                            data-type-id={contents.typeId}
                            onClick={(event) => {
                              mathTypeChangeApply(event, mathTypeId);
                            }}>
                            적용
                          </span>
                        </div>
                        <div className='conMoveCnclBtnWrap hide'>
                          <span
                            className='conMoveCnclBtn'
                            onClick={() => {
                              mathTypeChangeCncl();
                            }}>
                            취소
                          </span>
                          <span
                            className='conMoveApplyBtn'
                            onClick={(event) => {
                              mathContentsMoveApply(event);
                            }}>
                            적용
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </ReactSortable>

          <div className='alignCenter '>
            <span
              id='mathTypeOrderChngBtn'
              className='mathTypeOrderChngBtn'
              onClick={() => {
                mathTypeOrderChng();
              }}>
              순서변경 적용
            </span>
          </div>
        </div>
      </div>

      <div id='mathTypeAddRootDiv' className='blindBox hide'>
        <div id='mathTypeAddDiv' className='mathTypeAddDiv'>
          <div
            id='mathTypeAddRootDivClose'
            className='closeBtn2'
            onClick={() => {
              document.getElementById('mathTypeAddRootDiv').classList.add('hide');
            }}>
            X
          </div>
          <div>추가하려는 유형명을 적어주세요...</div>
          <div
            id='mathTypeAddContents'
            className='mathTypeAddContents'
            contentEditable='true'
            onKeyUp={(event) => {
              tagStyleRemove(event);
            }}></div>
          <div
            id='mathTypeAddBtn'
            className='mathTypeAddBtn'
            onClick={(event) => {
              mathTypeAdd(event);
            }}>
            추가하기
          </div>
        </div>
      </div>
    </>
  );
};

export default MathTypeCategory;
