import React from 'react';
import { Link } from 'react-router-dom';

const PageNumBtn = ({ linkUrl, additionParam, totalPageCnt, curPageNum }) => {
  const rendering = () => {
    const result = [];
    let movePage = Number(curPageNum);
    if (Number(curPageNum) !== 0) {
      result.push(
        <td id='prevPageBtn' key='0000' className='pageNumBtn prevBtn'>
          <Link className='linkNoneCss' to={linkUrl + '?pageNum=' + movePage + additionParam}>
            Prev
          </Link>
        </td>
      );
    }
    for (let i = 0; i < totalPageCnt; i++) {
      result.push(
        curPageNum === i ? (
          <td key='curPage' className='pageNumBtn curPageBtn'>
            {i + 1}
          </td>
        ) : (
          <td key={i} className='pageNumBtn'>
            <Link className='linkNoneCss' to={linkUrl + '?pageNum=' + (i + 1) + additionParam}>
              {i + 1}
            </Link>
          </td>
        )
      );
    }

    if (Number(curPageNum) !== totalPageCnt - 1) {
      movePage = Number(curPageNum) + 2;
      result.push(
        <td id='nextPageBtn' key='0001' className={totalPageCnt === 1 ? 'pageNumBtn nextBtn' : 'pageNumBtn nextBtn'}>
          <Link className='linkNoneCss' to={linkUrl + '?pageNum=' + movePage + additionParam}>
            NEXT
          </Link>
        </td>
      );
    }

    return result;
  };

  return (
    <>
      <table className='pageNumBtnTable'>
        <tbody>
          <tr>{rendering()}</tr>
        </tbody>
      </table>
    </>
  );
};

export default PageNumBtn;
