import {React, useEffect, useState} from "react";
import {reg_getMappingShortCutKeyClk, reg_writeDisableDom, reg_dressYellowBox, reg_reGenerFormulBugFix} from 'js/contents/register/contents_reg';

//입력불가 수식요소 (FormulaShorCutKey.js에도 똑같이 정의함)
const writeDisabledDom = ["nbTrigon", "nbL-R-Brck", "nbR-R-Brck" ,"nbL-C-Brck", "nbR-C-Brck", "nbL-S-Brck", "nbR-S-Brck", "nbAbsVal", "nbThrCaseBrck", "nbCaseBrck"];

const FormulaShortCutKey  = ({compId, keyName, parentShortCutKey, parentMethod}) => {
    const [shortCutKey, setShortCutKey] = useState(new Array());
    const jsonObj = {parentShortCutKey};
    const parentKeyList = jsonObj["parentShortCutKey"][keyName];
    const componentId = compId;

    useEffect(()=>{
        setShortCutKey(shortCutKeyList);
    },[]);

    const keepFocus = async (event) => {
        event.preventDefault();
        //첫 페이지 로드시 아무것도 클릭 안한상태(rangeCount=0)
		if(document.getSelection().rangeCount==0) return;
		if(document.getSelection().isCollapsed){
			const selection = document.getSelection();
			const newRange = selection.getRangeAt(0);
			selection.removeAllRanges();
			selection.addRange(newRange);
			window.getSelection().collapseToEnd();
		}
        event.stopPropagation();
    }

    const addFormulaKey = async (event)=>{
        //포커스를 한번도 주지 않은 경우
		if(document.getSelection().focusNode==null) return;

        const selection = document.getSelection();
        const newRange = selection.getRangeAt(0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        //셀렉트(드래그)한 부분이 없이 오로지 포커스가 하나인 경우
        if(document.getSelection().isCollapsed) window.getSelection().collapseToEnd();	   //포커스 줘야 activeElement.id 정상적으로 뽑아옴
        else{
            let childDiv = document.getElementById(document.activeElement.id).querySelectorAll("div");
            for(let i=0; i<childDiv.length; i++){
                //div태그의 마지막이 수식요소인 경우, 수식 재생성 오류 해결
                //마지막요소가 br이고 br 이전이 수식요소인 경우 재생성 안됨, 오직 마지막 요소가 수식요소인 경우 또는 수식이 span에 감싸져있는 경우 재생성됨
                if(childDiv[i].lastElementChild !== null && childDiv[i].lastElementChild.classList.contains("nbBox")){
                        if(childDiv[i].lastElementChild.nextSibling === null || childDiv[i].lastElementChild.nextSibling.length===0){
                            let tmpNode = document.createElement('span');
                            tmpNode.innerHTML = "&nbsp;"
                            tmpNode.className = "tmpReGenerBugFix";
                            childDiv[i].lastElementChild.after(tmpNode);
                        }
                //수식이 span에 감싸져있는 경우 재생성 버그 해결
                }else if(childDiv[i].lastElementChild !== null && childDiv[i].lastElementChild.tagName === "SPAN"){
                    let lastNbBox = childDiv[i].lastElementChild.querySelectorAll(".nbBox");
                    if(lastNbBox.length !== 0){
                        lastNbBox = lastNbBox[lastNbBox.length-1];
                        if(lastNbBox.parentElement !== undefined){
                            while(lastNbBox.parentElement.closest(".nbBox") !== null){
                                lastNbBox = lastNbBox.parentElement.closest(".nbBox");
                            }
                        }
                        
                        if(lastNbBox.nextSibling === null || lastNbBox.nextSibling.length===0){
                            let isLastDom = true;
                            let spanTag = lastNbBox
                            while(spanTag.parentElement.closest("span") !== null){
                                spanTag=spanTag.parentElement.closest("span") ;
                                if(spanTag.nextSibling !== null || (spanTag.nextSibling !== null && spanTag.nextSibling.length!==0)){
                                    isLastDom = false;
                                    break;
                                }
                            }
                            if(isLastDom){
                                let tmpNode = document.createElement('span');
                                tmpNode.innerHTML = "&nbsp;"
                                tmpNode.className = "tmpReGenerBugFix";
                                lastNbBox.after(tmpNode);
                            }
                        }
                    }
                }
            }
        }

        

        let focusId = document.activeElement.id;
        //문제입력, 해설입력, 객관식 보기, 주관식 정답에만 적용
        if( !(focusId == "contentsFormulaEditor" || focusId == "solutionFormulaEditor"
        || focusId == "firNoFormulaEditor" || focusId == "secNoFormulaEditor"
        || focusId == "thrNoFormulaEditor" || focusId == "fourNoFormulaEditor"
        || focusId == "fifNoFormulaEditor" || focusId == "answerFormulaEditor") ){
            return;
        }
 
        let formulaId = document.getElementById(event.currentTarget.id).dataset.formulaId;
        const mappingKey = await reg_getMappingShortCutKeyClk(formulaId, parentKeyList);
        const isWriteDisableDom = await reg_writeDisableDom(event)
		if(mappingKey!= null && !isWriteDisableDom){      //alt 단축키 사용한 경우
			let nbGrammer = mappingKey[0]["nbGrammer"];
            /*
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
            */
			//위 방식도 정상작동
			//ctrl+z 브라우저 자체 기능 사용위해 execCommand 방식으로 바꿈
			nbGrammer = "<span>"+nbGrammer+"</span>";
            if( !document.getSelection().isCollapsed ){
                await reg_reGenerFormulBugFix(true);
            }
            //document.execCommand버그, 셀렉트 된 상태에서 수식 들어가야 다음 줄 줄바꿈 없음
            if(window.getSelection().isCollapsed){
                const newRange = window.getSelection().getRangeAt(0)
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(newRange);
                let tmpNode= document.createElement('span');
                tmpNode.innerHTML = "&nbsp;"
                tmpNode.className = "tmpReGenerBugFix";
                let tmpNode2= document.createElement('span');
                tmpNode2.innerHTML = "&nbsp;"
                tmpNode2.className = "tmpReGenerBugFix2"

                if(newRange.commonAncestorContainer===document.activeElement && newRange.startOffset===0
                    && newRange.endOffset===0 && document.activeElement.childNodes[0] !== undefined
                    && document.activeElement.childNodes[0].tagName === "DIV"){
                        document.activeElement.childNodes[0].prepend(tmpNode2);
                        document.activeElement.childNodes[0].prepend(tmpNode);
                }else if( window.getSelection().getRangeAt(0).startContainer.tagName === "TR" && window.getSelection().getRangeAt(0).endContainer.tagName === "TR"
                && window.getSelection().getRangeAt(0).startOffset === 0 && window.getSelection().getRangeAt(0).endOffset === 0
                && window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd") !== null ){
                    window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd").prepend(tmpNode2);
                    window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd").prepend(tmpNode);
                }else{
                    newRange.insertNode(tmpNode2);
                    newRange.insertNode(tmpNode);
                }
                //div 마지막이 수식인 경우 tmpReGenerBugFix가 이미 추가되어 있어 수식이 tmpReGenerBugFix안으로 들어가 입력되지 않고 삭제되어버리는 버그 해결
                if(tmpNode2.nextSibling !== null && tmpNode2.nextSibling.classList !== undefined){
                    if(tmpNode2.nextSibling.classList.contains("tmpReGenerBugFix")){
                        tmpNode2.nextSibling.remove();
                    }
                }

                newRange.selectNode(tmpNode2);
            }else{
                let strtContainer = window.getSelection().getRangeAt(0).startContainer;
                if(window.getSelection().getRangeAt(0).startContainer.classList === undefined) strtContainer = window.getSelection().getRangeAt(0).startContainer.parentElement;
                strtContainer = strtContainer.closest("div");
                let tmpNode= document.createElement('span');
                tmpNode.innerHTML = "&nbsp;";
                tmpNode.className = "tmpReGenerBugFix";
                strtContainer.prepend(tmpNode);
            }
			document.execCommand("insertHTML", false ,nbGrammer);
            

            //nbCompile 루트 안의 분수 컴파일
            if(nbGrammer.indexOf("nbFracBox") > -1){
                let strtElement = window.getSelection().getRangeAt(0).startContainer;
                let endElement = window.getSelection().getRangeAt(0).endContainer;
                if(strtElement.classList === undefined) strtElement = strtElement.parentElement;
                if(endElement.classList === undefined) endElement = endElement.parentElement;
                strtElement = strtElement.closest(".nbRootBox");
                endElement = endElement.closest(".nbRootBox");
                if(strtElement !== null && endElement !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        strtElement.querySelector(".nbRootBase").classList.add("nbCompile");
                        strtElement.querySelector(".nbRootBase").classList.add("nbRootInFrac");
                        strtElement.classList.add("nbCompile");
                        strtElement.classList.add("nbRootInFrac");
                    }
                }
            }

            let tmpReGenerBugFix = document.getElementsByClassName("tmpReGenerBugFix");
			for(let i=0; i<tmpReGenerBugFix.length; i++){
				tmpReGenerBugFix[i].remove();
			}
			let tmpReGenerBugFix2 = document.getElementsByClassName("tmpReGenerBugFix2");
			for(let i=0; i<tmpReGenerBugFix2.length; i++){
				tmpReGenerBugFix2[i].remove();
			}

            //포커스 재설정 필요한 수식요소 포커스 설정
            let focusNbBorderBox = window.getSelection().focusNode;
			if(focusNbBorderBox.classList === undefined) focusNbBorderBox = focusNbBorderBox.parentElement;
			focusNbBorderBox = focusNbBorderBox.closest(".borderBox");

            if(focusNbBorderBox !== null) {
                //입력 불가 요소는 수식 오른쪽에 포커스
                for(let i=0; i<writeDisabledDom.length; i++){
                    if(focusNbBorderBox.classList.contains(writeDisabledDom[i])){
                        window.getSelection().getRangeAt(0).selectNode(focusNbBorderBox.closest(".nbBox"));
                        window.getSelection().collapseToEnd();

                    }
                }

                //연립방정식은 제일 첫번째 borderBox에 포커스
                if(focusNbBorderBox.classList.contains("nbThrCaseThr") && nbGrammer.indexOf("nbThrCaseThr") > -1){
                    window.getSelection().getRangeAt(0).setStart(focusNbBorderBox.closest(".nbBox").querySelector(".nbThrCaseFir"), 0);
                    window.getSelection().getRangeAt(0).setEnd(focusNbBorderBox.closest(".nbBox").querySelector(".nbThrCaseFir"), 0);

                }else if(focusNbBorderBox.classList.contains("nbCaseSec") && nbGrammer.indexOf("nbCaseSec") > -1){
                    window.getSelection().getRangeAt(0).setStart(focusNbBorderBox.closest(".nbBox").querySelector(".nbCaseFir"), 0);
                    window.getSelection().getRangeAt(0).setEnd(focusNbBorderBox.closest(".nbBox").querySelector(".nbCaseFir"), 0);
                }
            }

            await reg_dressYellowBox();
			event.preventDefault();
            // borderBox 수식 요소인 경우 borderBox안의 caret에 포커스 주기
            /*
            if(document.getElementsByClassName("caret").length !== 0){
                let range = document.createRange();
                range.setStart(document.getElementsByClassName("caret")[0], 0);
                range.setEnd(document.getElementsByClassName("caret")[0], 0);
                const selection1 = document.getSelection();
                selection1.removeAllRanges();
                selection1.addRange(range);
    
                let caretList = document.getElementsByClassName("caret");
                while(caretList.length>0){
                    caretList[0].classList.remove('caret');
                }
            }
            */
		}
        parentMethod(focusId);
    }

    //getShortCutKeyList(parentKeyList["shortCutKey"]);
    const shortCutKeyList = parentKeyList.map( (keyLabel, idx) => {
        let brtagVal = null;
        let domId = "shortCut"+keyLabel.id;
        let formulaBtnId = compId +"Id"+idx;
        if(keyLabel.lineChange == 1  ) brtagVal = <br/>;
        if(componentId=="shortKeyBoard"){
            return <span key={idx}>
                    <button type="button" className="keySpan" id={formulaBtnId} title={keyLabel.formulName} data-formula-id={keyLabel.id} onClick={(event)=>addFormulaKey(event)}>
                        <sup className="supShortCut" >{keyLabel.shortcutKey}</sup>
                        <span className="shortCutKey" id={domId} >
                                <span dangerouslySetInnerHTML={{ __html:keyLabel.formulUi}} />
                        </span>
                    </button>
                    {brtagVal}
                    </span>
        }else{
            if(keyLabel.lineChange == 1  ) brtagVal = <br/>;
            return <span key={idx}>
                    <button type="button" className="keySpan" id={formulaBtnId} title={keyLabel.formulName} data-formula-id={keyLabel.id} onClick={(event)=>addFormulaKey(event)}>
                        <span className="shortCutKey shortCutKeyEtc" id={domId} >
                                <span dangerouslySetInnerHTML={{ __html:keyLabel.formulUi}} />
                        </span>
                    </button>
                    {brtagVal}
                    </span>
        }
    });

    if(componentId=="shortKeyBoard"){
        return <div type="button" id={compId} className="shortKeyBoard" onMouseDown={(event)=>keepFocus(event)}>{shortCutKey}</div>
    }else{
        return <div type="button" id={compId} className="shortKeyBoard hide" onMouseDown={(event)=>keepFocus(event)}>{shortCutKey}</div>
    }
}

export default FormulaShortCutKey;


