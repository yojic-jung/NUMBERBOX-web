import React from 'react';

const config = {
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
      ['$$', '$$'],
    ],
  },
};

const TypeSelBox = ({ value, myId }) => {
  const typeList = value;
  const quesTypeItem = typeList.map((quesType, idx) => (
    <option key={idx} data-parent-value={quesType.unitId} data-type-no={quesType.typeNo}>
      {quesType.quesType}
    </option>
  ));
  return (
    <div className='hide'>
      <select id={myId}>
        <option>--선택--</option>
        {quesTypeItem}
      </select>
    </div>
  );
};

export default TypeSelBox;
