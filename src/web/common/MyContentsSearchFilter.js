import React, { useState, useEffect } from 'react';
import { nb_dataFetch } from 'js/common/common_nb.js';
import { Link } from 'react-router-dom';

const MyContentsSearchFilter = ({ makeContentsShow, descMsg }) => {
  const [subjectList, setSubjectList] = useState(new Array());
  const [secUnitList, setSecUnitList] = useState(new Array());

  useEffect(() => {
    window.addEventListener('click', hideSearchFilter);
    const asyncUseEffect = async () => {
      let jsonObj = await nb_dataFetch('/math/menu/unit', true);
      setSubjectList(jsonObj.data['subjectList']);
      setSecUnitList(jsonObj.data['secUnitList']);
    };
    asyncUseEffect();
    return () => removeAddedEvent();
  }, []);

  const removeAddedEvent = async () => {
    window.removeEventListener('click', hideSearchFilter);
  };

  const hideSearchFilter = async (event) => {
    let target = event.target;
    if (!target.classList.contains('myConSeachFilter')) {
      let mySearchFilter = document.getElementsByClassName('mySearchFilter-list');
      for (let i = 0; i < mySearchFilter.length; i++) {
        mySearchFilter[i].classList.add('hide');
      }
    }
  };
  const seachFilterClick = async (targetId) => {
    console.log(targetId);
    let target = document.getElementById(targetId);
    if (target.classList.contains('hide')) {
      target.classList.remove('hide');
    } else {
      target.classList.add('hide');
    }

    // 메뉴바 펼치기
    let mySearchFilter = document.getElementsByClassName('mySearchFilter-list');
    for (let i = 0; i < mySearchFilter.length; i++) {
      if (target !== mySearchFilter[i]) {
        mySearchFilter[i].classList.add('hide');
      }
    }
  };

  const myContentsSortFilter = async (event, sortBy) => {
    let filterContents = document.getElementsByClassName('filterContents');
    for (let j = 0; j < filterContents.length; j++) {
      let contentsNodeList = filterContents[j].childNodes;
      var contentsArray = [].slice.call(contentsNodeList, 0);
      if (sortBy === 'latest') {
        contentsArray.sort(function (a, b) {
          const date1 = new Date(a.dataset.sysCreateDate);
          const date2 = new Date(b.dataset.sysCreateDate);
          const differenceInMilliseconds = date1 - date2;
          return differenceInMilliseconds; //내림차순, 날짜 큰것 부터 작 순으로
        });
      } else if (sortBy === 'oldest') {
        contentsArray.sort(function (a, b) {
          const date1 = new Date(a.dataset.sysCreateDate);
          const date2 = new Date(b.dataset.sysCreateDate);
          const differenceInMilliseconds = date2 - date1;
          return differenceInMilliseconds; //오름차순, 날짜 작은것 부터 큰 순으로
        });
      }
      for (let i = 0; i < contentsNodeList.length; i++) {
        contentsNodeList[i].remove();
      }
      for (let i = 0; i < contentsArray.length; i++) {
        document.getElementsByClassName('contents-show')[j].append(contentsArray[i]);
      }
      document.getElementById('mySortFilterTitle').innerText = event.target.innerText;
    }
  };

  const myContentsSubFilter = async (event) => {
    let target = event.target;
    let targetSubject = target.dataset.unitName;
    if (targetSubject === '전체') {
      document.getElementById('mySubFilterTitle').innerText = '학년 및 과목';
      let subjectFilterList = document.getElementById('subjectFilterUnitList').querySelectorAll('li');
      for (let i = 0; i < subjectFilterList.length; i++) {
        subjectFilterList[i].classList.add('hide');
      }
      subjectFilterList[0].classList.remove('hide');
    } else {
      document.getElementById('mySubFilterTitle').innerText = target.innerText;
      let subjectFilterList = document.getElementById('subjectFilterUnitList').querySelectorAll('li');
      for (let i = 0; i < subjectFilterList.length; i++) {
        if (targetSubject === subjectFilterList[i].dataset.parentUnitName) {
          subjectFilterList[i].classList.remove('hide');
        } else {
          subjectFilterList[i].classList.add('hide');
        }
      }
      subjectFilterList[0].classList.remove('hide');
    }
    document.getElementById('mySubFilterTitle').dataset.currentVal = targetSubject;
    document.getElementById('mySubFilterUnit').innerText = '대단원';

    let contentsDiv = document.getElementsByClassName('contentsDivForFilter');
    for (let i = 0; i < contentsDiv.length; i++) {
      if (targetSubject === '전체') {
        contentsDiv[i].classList.remove('hide');
        continue;
      }
      let subject = contentsDiv[i].dataset.subject;
      if (targetSubject !== subject) {
        contentsDiv[i].classList.add('hide');
      } else {
        contentsDiv[i].classList.remove('hide');
      }
    }
    let filterdCnt = 0;
    for (let i = 0; i < contentsDiv.length; i++) {
      if (!contentsDiv[i].classList.contains('hide')) {
        filterdCnt++;
      }
    }
    //필터링 문제 갯수 초기화
    if (document.getElementById('searchFilterCnt') !== null && document.getElementById('searchFilterCnt') !== undefined) {
      document.getElementById('searchFilterCnt').innerText = filterdCnt;
    }
    if (filterdCnt > 0) {
      document.getElementById('filetedEmptyMsg').classList.add('hide');
    } else {
      document.getElementById('filetedEmptyMsg').classList.remove('hide');
    }
  };

  const myContentsSubFilterByUnit = async (event) => {
    let target = event.target;
    let targetSecUnit = target.dataset.unitName;
    console.log(targetSecUnit);
    if (targetSecUnit === '전체') {
      document.getElementById('mySubFilterUnit').innerText = '대단원';
    } else {
      document.getElementById('mySubFilterUnit').innerText = target.innerText;
    }

    let contentsDiv = document.getElementsByClassName('contentsDivForFilter');
    for (let i = 0; i < contentsDiv.length; i++) {
      //둘다 전체인 경우 => 필터 다 풀기
      if (document.getElementById('mySubFilterTitle').dataset.currentVal === '전체' && targetSecUnit === '전체') {
        contentsDiv[i].classList.remove('hide');
        continue;
        //과목 값 있고 대단원 전체 => 과목 값으로 필터링
      } else if (document.getElementById('mySubFilterTitle').dataset.currentVal !== '전체' && targetSecUnit === '전체') {
        if (document.getElementById('mySubFilterTitle').dataset.currentVal === contentsDiv[i].dataset.subject) {
          contentsDiv[i].classList.remove('hide');
        } else {
          contentsDiv[i].classList.add('hide');
        }
        //과목 값 있고 대단원 값 있음 => 과목, 대단원 값으로 필터링
      } else if (document.getElementById('mySubFilterTitle').dataset.currentVal !== '전체' && targetSecUnit !== '전체') {
        if (document.getElementById('mySubFilterTitle').dataset.currentVal === contentsDiv[i].dataset.subject && targetSecUnit === contentsDiv[i].dataset.secUnit) {
          contentsDiv[i].classList.remove('hide');
        } else {
          contentsDiv[i].classList.add('hide');
        }
      }
    }
    let filterdCnt = 0;
    for (let i = 0; i < contentsDiv.length; i++) {
      if (!contentsDiv[i].classList.contains('hide')) {
        filterdCnt++;
      }
    }
    //필터링 문제 갯수 초기화
    if (document.getElementById('searchFilterCnt') !== null && document.getElementById('searchFilterCnt') !== undefined) {
      document.getElementById('searchFilterCnt').innerText = filterdCnt;
    }

    if (filterdCnt > 0) {
      document.getElementById('filetedEmptyMsg').classList.add('hide');
    } else {
      document.getElementById('filetedEmptyMsg').classList.remove('hide');
    }
  };

  const subjectFilterList = subjectList.map((contentsMap, idx) => {
    return (
      <li
        key={contentsMap.unitId}
        data-unit-id={contentsMap.unitId}
        data-unit-name={contentsMap.unitName}
        onClick={(event) => {
          myContentsSubFilter(event);
        }}
        dangerouslySetInnerHTML={{ __html: contentsMap.unitName }}></li>
    );
  });
  const secUnitFilterList = secUnitList.map((contentsMap, idx) => {
    return (
      <li
        className='hide'
        key={contentsMap.unitId}
        data-unit-id={contentsMap.unitId}
        data-parent-unit-name={contentsMap.parentUnitName}
        data-unit-name={contentsMap.unitName}
        onClick={(event) => {
          myContentsSubFilterByUnit(event);
        }}
        dangerouslySetInnerHTML={{ __html: contentsMap.unitName }}></li>
    );
  });

  return (
    <>
      <div className='bi-jutify-align2'>
        <div>
          <span className='relative'>
            <span
              id='mySubFilterTitle'
              className='myConSeachFilter'
              onClick={() => {
                seachFilterClick('subjectFilterList');
              }}>
              학년 및 과목
            </span>
            <ul id='subjectFilterList' className='mySearchFilter-list hide'>
              <li
                id='mySubFilterOff'
                data-unit-id='00'
                data-unit-name='전체'
                onClick={(event) => {
                  myContentsSubFilter(event);
                }}>
                전체
              </li>
              {subjectFilterList}
            </ul>
          </span>
          <span className='relative'>
            <span
              id='mySubFilterUnit'
              className='myConSeachFilter'
              onClick={() => {
                seachFilterClick('subjectFilterUnitList');
              }}>
              대단원
            </span>
            <ul id='subjectFilterUnitList' className='mySearchFilter-list custom hide'>
              <li
                data-unit-id='00'
                data-unit-name='전체'
                onClick={(event) => {
                  myContentsSubFilterByUnit(event);
                }}>
                전체
              </li>
              {secUnitFilterList}
            </ul>
          </span>
          <span className='relative'>
            <span
              id='mySortFilterTitle'
              className='myConSeachFilter'
              onClick={() => {
                seachFilterClick('productFilterList');
              }}>
              정렬
            </span>
            <ul id='productFilterList' className='mySearchFilter-list hide'>
              <li
                onClick={(event) => {
                  myContentsSortFilter(event, 'latest');
                }}>
                최신순
              </li>
              <li
                onClick={(event) => {
                  myContentsSortFilter(event, 'oldest');
                }}>
                오래된순
              </li>
            </ul>
          </span>
          <span className='mini-title3'>{descMsg}</span>
        </div>
        {makeContentsShow && (
          <Link className='linkNoneCss' to='/makeContents'>
            <div className='updateBtn2'>문제 만들기</div>
          </Link>
        )}
      </div>
      <div className='relative'>
        <div id='filetedEmptyMsg' className='filetedEmptyMsg hide'>
          해당하는 조건의 문제내역이 없습니다.
        </div>
      </div>
    </>
  );
};

export default MyContentsSearchFilter;
