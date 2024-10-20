import React from 'react';
import { nb_fCustomSelDivClk, nb_fCustomOptClk } from 'js/common/common_nb.js';

const config = {
  tex2jax: {
    inlineMath: [
      ['$$', '$$'],
      ['$', '$'],
      ['\\(', '\\)'],
    ],
  },
};
const CustomTypeSelBox = ({ value, cusSelId, originSel }) => {
  const optList = value;
  const cusSelUlTitle = cusSelId + 'Title';
  const cusSelDiv = cusSelId + 'Div';
  const firLiId = cusSelId + 'Li000';
  const subjectItem = optList.map((opt, idx) => {
    let liIdTmp = cusSelId + 'Li' + idx;
    return (
      <li
        id={liIdTmp}
        key={idx}
        className='nbOptItem'
        data-value={opt.quesType}
        data-type-id={opt.typeId}
        data-unit-id={opt.unitId}
        onClick={(event) => {
          nb_fCustomOptClk(event, cusSelDiv, cusSelUlTitle, originSel);
        }}
        dangerouslySetInnerHTML={{ __html: opt.quesType }}></li>
    );
  });

  return (
    <div className='nbWrapSelBox'>
      <div id={cusSelDiv} className='nbCustomSel nbCustom3' onClick={(event) => nb_fCustomSelDivClk(event)}>
        <span id={cusSelUlTitle} className='nbCustomSelVal'>
          유형정보
        </span>
        <ul id={cusSelId} className='nbCustomOptList nbCustomOptList3'>
          <div className='backBox'>
            <li id={firLiId} key='00' className='nbOptItem' data-value='0'>
              유형을 선택해주세요...
            </li>
            {subjectItem}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default CustomTypeSelBox;
