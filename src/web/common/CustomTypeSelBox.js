import React from 'react';
import { msb_fCustomSelDivClk, msb_fCustomSelSpanClk, msb_fCustomOptClk} from 'js/common/common_msb.js';

const CustomTypeSelBox = ({value, cusSelId, originSel}) => {
    const optList = value;
    const cusSelUlTitle = cusSelId+"Title";
    const cusSelDiv = cusSelId+"Div";
    const firLiId = cusSelId+"Li000"
    const subjectItem = optList.map( (opt, idx) => {
        let liIdTmp = cusSelId+"Li"+idx;
               return <li id={liIdTmp} key={idx} className="msbOptItem" data-value={opt.quesType}
                        onClick={event=>{ msb_fCustomOptClk(event, cusSelDiv, cusSelUlTitle, originSel);}}>{opt.quesType}</li>
        }
        
    );

    return (
        <div className="msbWrapSelBox">
            <div id={cusSelDiv} className="msbCustomSel msbCustom3" onClick={event=>msb_fCustomSelDivClk(event)}>
                <span id={cusSelUlTitle} className="msbCustomSelVal" onClick={event=>msb_fCustomSelSpanClk(event)}>유형정보</span>
                <ul id={cusSelId} className="msbCustomOptList msbCustomOptList3">
                    <li id={firLiId} key="00" className="msbOptItem" data-value="0" >유형을 선택해주세요...</li>
                   {subjectItem}
                </ul>
            </div>
        </div>
    );

}

export default CustomTypeSelBox;