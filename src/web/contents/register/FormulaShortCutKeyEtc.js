import {React, useEffect, useState} from "react";
import {reg_getMappingShortCutKeyClk} from 'js/contents/register/contents_reg';

const FormulaShortCutKeyEtc  = ({parentShortCutKey, parentMethod}) => {
    const [shortCutKey, setShortCutKey] = useState(new Array());
    const jsonObj = {parentShortCutKey};
    const parentKeyList = jsonObj["parentShortCutKey"]["shortCutKeyEtc"];
    useEffect(()=>{
        setShortCutKey(shortCutKeyList);
    },[]);

    const addFormulaKey = async (event)=>{
        event.preventDefault();

        //포커스를 한번도 주지 않은 경우
		if(document.getSelection().focusNode==null){
			event.stopPropagation();
			return;
		}

        const selection = document.getSelection();
        const newRange = selection.getRangeAt(0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        //셀렉트(드래그)한 부분이 없이 오로지 포커스가 하나인 경우
        if(document.getSelection().isCollapsed) window.getSelection().collapseToEnd();	   //포커스 줘야 activeElement.id 정상적으로 뽑아옴

        let focusId = document.activeElement.id;
        //문제입력, 해설입력, 객관식 보기, 주관식 정답에만 적용
        if( !(focusId == "contentsFormulaEditor" || focusId == "solutionFormulaEditor"
        || focusId == "firNoFormulaEditor" || focusId == "secNoFormulaEditor"
        || focusId == "thrNoFormulaEditor" || focusId == "fourNoFormulaEditor"
        || focusId == "fifNoFormulaEditor" || focusId == "answerFormulaEditor") ){
            event.stopPropagation();
            return;
        }
 
        let formulaId = document.getElementById(event.currentTarget.id).dataset.formulaId;
        const mappingKey = await reg_getMappingShortCutKeyClk(formulaId, parentKeyList);
		if(mappingKey!= null){      //alt 단축키 사용한 경우
			let nbGrammer = mappingKey[0]["nbGrammer"];
			//현재 포커스에 단축키 수식 추가
            const selection = document.getSelection();
            const newRange = selection.getRangeAt(0);
            selection.removeAllRanges();
            selection.addRange(newRange);
            let tmpNode= document.createElement('span');
            tmpNode.innerHTML = nbGrammer;
            newRange.deleteContents();
            newRange.insertNode(tmpNode);
			window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
		}
        
        parentMethod(focusId);
        event.stopPropagation();
    }


    //getShortCutKeyList(parentKeyList["shortCutKey"]);
    const shortCutKeyList = parentKeyList.map( (keyLabel, idx) => {
        let brtagVal = null;
        let domId = "shortCut"+keyLabel.id;
        let formulaBtnId = "formulaEtcBtnId"+idx;
        if(keyLabel.lineChange == 1  ) brtagVal = <br/>
        return <span key={idx}>
                <button className="keySpan" id={formulaBtnId} title={keyLabel.formulName} data-formula-id={keyLabel.id} onClick={(event)=>addFormulaKey(event)}>
                    <span className="shortCutKey shortCutKeyEtc" id={domId} >
                            <span dangerouslySetInnerHTML={{ __html:keyLabel.formulUi}} />
                    </span>
                </button>
                {brtagVal}
                </span>
    });

    
    

    return <div id="shortKeyBoardEtc" className="shortKeyBoard hide">{shortCutKey}</div>
}

export default FormulaShortCutKeyEtc;


