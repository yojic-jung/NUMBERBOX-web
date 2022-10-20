import {React, useEffect, useState} from "react";
import {reg_getMappingShortCutKeyClk, reg_writeDisableDom, reg_dressYellowBox, reg_reGenerFormulBugFix, reg_undoStackByClick, 
    reg_undoArrPop, reg_addBrInLastPosition} from 'js/contents/register/contents_reg';
import shortCutButExImg1 from 'img/shortCutButExImg1.PNG';
import shortCutButExImg2 from 'img/shortCutButExImg2.PNG';


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

        if(event.target.classList.contains("shortcutBugBtn") || event.target.querySelector(".shortcutBugBtn") !== null){
            document.getElementById("bugUiRootDiv").classList.remove('hide');
        }

        if(event.currentTarget.classList.contains("etcShotcutDesc")){
            window.getSelection().setBaseAndExtent(event.currentTarget, 0, event.currentTarget, 0);
            document.getElementById("etcShortCutRootDiv").classList.remove('hide');
        }
        

        let targetId = event.currentTarget.id;
        let focusId = document.activeElement.id;
        
        //문제입력, 해설입력, 객관식 보기, 주관식 정답에만 적용
        if( !(focusId === "contentsFormulaEditor" || focusId === "solutionFormulaEditor"
        || focusId === "firNoFormulaEditor" || focusId === "secNoFormulaEditor"
        || focusId === "thrNoFormulaEditor" || focusId === "fourNoFormulaEditor"
        || focusId === "fifNoFormulaEditor" || focusId === "answerFormulaEditor") ){
            //셀렉트 상태에서 수식 탭 버튼 클릭하면 activeElement가 버튼으로 셋팅되어 anchorNode의 부모요소 파악
            if(!window.getSelection().isCollapsed && (window.getSelection().anchorNode.parentElement.closest(".contentEditClass") !== null)){
            }else{
                return;
            }
        }
        
        //tbody버그 해결(tbody에 포커스 잡히면 보더박스로 들어가게끔 구현)(tbody 2개인 적분, 로그, 시그마, 리밋에서 에러 발생할 수 있음)
        if((window.getSelection().anchorNode.tagName !== undefined && window.getSelection().anchorNode.tagName === "TBODY")
        || (window.getSelection().focusNode.tagName !== undefined && window.getSelection().focusNode.tagName === "TBODY")){
            let borderBox = window.getSelection().focusNode.querySelector(".borderBox");
            window.getSelection().setBaseAndExtent(borderBox, 0, borderBox, 0);
        }

        await reg_undoStackByClick(document.activeElement.id);      //ctrl+z undo 스택 메모리에 데이터 추가

         //셀렉트 상태에서 수식 입력시 셀렉트 안의 수식이 마지막 요소인 경우 재생성 버그
         if( !document.getSelection().isCollapsed ){
            await reg_reGenerFormulBugFix(true);
        }

        let formulaId = document.getElementById(targetId).dataset.formulaId;
        const mappingKey = await reg_getMappingShortCutKeyClk(formulaId, parentKeyList);
        const isWriteDisableDom = await reg_writeDisableDom(event);
        
        //nb문법 삽입 전 커서 위치 요소 파악(nbConvert)
        let strtElement = window.getSelection().getRangeAt(0).startContainer;
		let endElement = window.getSelection().getRangeAt(0).endContainer;
		if(strtElement.classList === undefined) strtElement = strtElement.parentElement;
		if(endElement.classList === undefined) endElement = endElement.parentElement;
		if(mappingKey!= null && !isWriteDisableDom){      //alt 단축키 사용한 경우
			let nbGrammer = mappingKey[0]["nbGrammer"];
			//현재 포커스에 단축키 수식 추가
			let selection = document.getSelection();
			let newRange = selection.getRangeAt(0);
            //테이블 tr에 포커스 있으면 td 안의 br로 넣어주기(tr에 포커스 있으면 테이블 분리됨)
			if(window.getSelection().isCollapsed && newRange.startContainer.nodeName === "TR"){
                window.getSelection().getRangeAt(0).selectNode(newRange.startContainer.querySelector("br"));
			}
			//span 노드 추가 안하고 nbGrammer 추가시 백스페이스 및 del 오류 날 수 있음(reg_preventKeyEvent)
			let tmpNode= document.createElement('span');
			tmpNode.innerHTML = nbGrammer;
			newRange.deleteContents();
			newRange.insertNode(tmpNode);
			if(tmpNode.querySelectorAll(".nbBox").length !== 0){
				tmpNode.outerHTML = nbGrammer;
				let focusElement = document.getElementsByClassName("nbBoxFocusElement")[0];
				window.getSelection().setBaseAndExtent(focusElement, 0, focusElement, 0);
				focusElement.remove();
				window.getSelection().collapseToStart();
			}else{
				let positionDetect= document.createElement('span');
				positionDetect.className ="fomulaPositionDetect"
				tmpNode.after(positionDetect);
				window.getSelection().getRangeAt(0).selectNode(positionDetect);
				tmpNode.outerHTML = nbGrammer;
				window.getSelection().collapseToEnd();
				positionDetect.remove();
			}
           


            //nbConvert 루트 안의 분수 컴파일
            if(nbGrammer.indexOf("nbFracBox") > -1){
                let nbRootBoxStrt = strtElement.closest(".nbRootBox");
                let nbRootBoxEnd = endElement.closest(".nbRootBox");
                if(nbRootBoxStrt !== null && nbRootBoxEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbRootBoxStrt.querySelector(".nbRootBase").classList.add("nbConvert");
                        nbRootBoxStrt.querySelector(".nbRootBase").classList.add("nbFracInRoot");
                        nbRootBoxStrt.classList.add("nbConvert");
                        nbRootBoxStrt.classList.add("nbFracInRoot");
                    }
                }
                //분모 안의 분수 또는 분자 안의 분수 컴파일
                let nbFracBoxStrt = strtElement.closest(".nbFracBox");
                let nbFracBoxEnd = endElement.closest(".nbFracBox");
                if(nbFracBoxStrt !== null && nbFracBoxEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        if(strtElement.closest(".nbDenom") !== null && endElement.closest(".nbDenom") !== null){
                            nbFracBoxStrt.classList.add("nbConvert");
                            nbFracBoxStrt.classList.add("nbFracInDenom");
                        }
                        if(strtElement.closest(".nbNumer") !== null && endElement.closest(".nbNumer") !== null){
                            nbFracBoxStrt.classList.add("nbConvert");
                            nbFracBoxStrt.classList.add("nbFracInNumer");
                        }
                    }

                    //nbFracInDenom위에 리밋 있는 경우
                    let nbFracBoxInLimStrt = nbFracBoxStrt.closest(".nbLimBase");
                    let nbFracBoxInLimEnd = nbFracBoxEnd.closest(".nbLimBase");
                    if(nbFracBoxInLimStrt !== null && nbFracBoxInLimEnd !== null){
                        if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                            if(nbFracBoxStrt.classList.contains("nbFracInDenom") && nbFracBoxStrt.classList.contains("nbFracInNumer")){
                                nbFracBoxInLimEnd.closest(".nbLimBox").classList.add("nbConvert");
                                nbFracBoxInLimEnd.closest(".nbLimBox").classList.add("nbFracInDenomInLim");
                                nbFracBoxInLimEnd.closest(".nbLimBox").classList.add("nbFracInFracInLim");
                            }
                            else if(nbFracBoxStrt.classList.contains("nbFracInDenom")){
                                nbFracBoxInLimEnd.closest(".nbLimBox").classList.add("nbConvert");
                                nbFracBoxInLimEnd.closest(".nbLimBox").classList.add("nbFracInDenomInLim");
                            }
                        }
                    }
                }
                

                //lim 안의 분수 컴파일
                let nbLimBaseStrt = strtElement.closest(".nbLimBase");
                let nbLimBaseEnd = endElement.closest(".nbLimBase");
                if(nbLimBaseStrt !== null && nbLimBaseEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbLimBaseStrt.closest(".nbBox").classList.add("nbConvert");
                        nbLimBaseEnd.closest(".nbBox").classList.add("nbFracInLim");
                    }
                }

                //적분 안의 분수 컴파일
                let nbIntegralStrt = strtElement.closest(".nbIntBase");	//base가 아닌 box로 처음부터 찾으면 base 아닌 sup이나 sub에 넣어도 컨버트 됨
                let nbIntegralEnd = endElement.closest(".nbIntBase");
                if(nbIntegralStrt === null && nbIntegralEnd === null){
                    nbIntegralStrt = strtElement.closest(".nbDoubleIntBase");
                    nbIntegralEnd = endElement.closest(".nbDoubleIntBase");
                }
                if(nbIntegralStrt === null && nbIntegralEnd === null){
                    nbIntegralStrt = strtElement.closest(".nbTripleIntBase");
                    nbIntegralEnd = endElement.closest(".nbTripleIntBase");
                }
                if(nbIntegralStrt !== null && nbIntegralEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbIntegralStrt.closest(".nbBox").classList.add("nbConvert");
                        nbIntegralStrt.closest(".nbBox").classList.add("nbFracInIntegral");
                    }
                }

                //시그마 안 분수 컴파일
                let nbSigmaStrt = strtElement.closest(".nbSigmaSumBase");	//base가 아닌 box로 처음부터 찾으면 base 아닌 sup이나 sub에 넣어도 컨버트 됨
                let nbSigmaEnd = endElement.closest(".nbSigmaSumBase");
                if(nbSigmaStrt !== null && nbSigmaEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbSigmaStrt.closest(".nbBox").classList.add("nbConvert");
                        nbSigmaStrt.closest(".nbBox").classList.add("nbFracInSigmaSum");
                    }
                }
                //ln함수 안 분수 컴파일
                let nbLnStrt = strtElement.closest(".nbLnBase");	//base가 아닌 box로 처음부터 찾으면 base 아닌 sup이나 sub에 넣어도 컨버트 됨
                let nbLnEnd = endElement.closest(".nbLnBase");
                if(nbLnStrt !== null && nbLnEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbLnStrt.closest(".nbBox").classList.add("nbConvert");
                        nbLnStrt.closest(".nbBox").classList.add("nbFracInLn");
                    }
                }

                //로그함수 안 분수 컴파일
                let nbLogStrt = strtElement.closest(".nbLogBase");	//base가 아닌 box로 처음부터 찾으면 base 아닌 sup이나 sub에 넣어도 컨버트 됨
                let nbLogEnd = endElement.closest(".nbLogBase");
                if(nbLogStrt !== null && nbLogEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbLogStrt.closest(".nbBox").classList.add("nbConvert");
                        nbLogStrt.closest(".nbBox").classList.add("nbFracInLog");
                    }
                }
            }

            //시그마 컴파일
            if(nbGrammer.indexOf("nbSigmaSumBox") > -1){
                //리밋 안 시그마
                let nbLimBoxStrt = strtElement.closest(".nbLimBase");
                let nbLimBoxEnd = endElement.closest(".nbLimBase");
                if(nbLimBoxStrt !== null && nbLimBoxEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbLimBoxStrt.closest(".nbBox").classList.add("nbConvert");
                        nbLimBoxEnd.closest(".nbBox").classList.add("nbSigmaSumInLim");
                    }
                }
                //분모 안의 시그마 컴파일
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbSigmaSumInDenom");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
                //분자 안의 시그마 컴파일
                let nbNumerStrt = strtElement.closest(".nbNumer");
                let nbNumerEnd = endElement.closest(".nbNumer");
                if(nbNumerStrt !== null && nbNumerEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbSigmaSumInNumer");
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }
            
            //nbConvert 분모 안에 루트, 순환소수, 악센트 들어가는 경우(분모, 분자에 padding:2)
            if(nbGrammer.indexOf("nbRootBox") > -1 || nbGrammer.indexOf("nbOverDotBox") > -1 || nbGrammer.indexOf("nbAccentBox") > -1 ){
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbFracLineConvert");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }

            //nbConvert 분모 안에 리밋 들어가는 경우
            if(nbGrammer.indexOf("nbLimBox") > -1){
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbLimInDenom");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }

                let nbNumerStrt = strtElement.closest(".nbNumer");
                let nbNumerEnd = endElement.closest(".nbNumer");
                if(nbNumerStrt !== null && nbNumerEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbLimInNumer");
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }
            
            //nbConvert 분모 안에 직선, 선분 들어가는 경우(분모, 분자에 padding:3)
            if(nbGrammer.indexOf("nbArrowBox") > -1 || nbGrammer.indexOf("nbOverlineBox") > -1){
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbFracLineConvert2");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }

            //nbConvert 분수 안에 조건박스
            if(nbGrammer.indexOf("nbCondBox") > -1){
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbCondBoxInFracDenomConvert");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }

                let nbNumerStrt = strtElement.closest(".nbNumer");
                let nbNumerEnd = endElement.closest(".nbNumer");
                if(nbNumerStrt !== null && nbNumerEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbNumerEnd.closest(".nbFracBox").classList.add("nbCondBoxInFracNumerConvert");
                        nbNumerEnd.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }

            //분모, 분자 안에 적분 들어가는 경우
            if(nbGrammer.indexOf("nbIntegralBox") > -1 || nbGrammer.indexOf("nbDoubleIntegralBox") > -1 || nbGrammer.indexOf("nbTripleIntegralBox") > -1){
                let nbDenomStrt = strtElement.closest(".nbDenom");
                let nbDenomEnd = endElement.closest(".nbDenom");
                if(nbDenomStrt !== null && nbDenomEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbIntegralInDenom");
                        nbDenomStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }

                let nbNumerStrt = strtElement.closest(".nbNumer");
                let nbNumerEnd = endElement.closest(".nbNumer");
                if(nbNumerStrt !== null && nbNumerEnd !== null){
                    if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbIntegralInNumer");
                        nbNumerStrt.closest(".nbFracBox").classList.add("nbConvert");
                    }
                }
            }

            //nbConvert 분수의 분모 안에 분수가 있고 이 분수의 분모 또는 분자에 
			//루트 순환소수, 루트 악센트, 루트 직선, 루트 선분 들어가는 경우는 구현 안함, 추후 이런 수식 기호를 사용할 일 있으면 추가해야함
            //사용성이 낮아보여 구현 안함, 현재 줄맞춤 안맞는 에러 존재

            let tmpReGenerBugFix = document.getElementsByClassName("tmpReGenerBugFix");
            while (tmpReGenerBugFix.length > 0) {
                tmpReGenerBugFix[0].remove();
            }
            let tmpReGenerBugFix2 = document.getElementsByClassName("tmpReGenerBugFix2");
            while (tmpReGenerBugFix2.length > 0) {
                tmpReGenerBugFix2[0].remove();
            }


            await reg_addBrInLastPosition();    //div 태그 마지막이 수식인 경우 마지막 요소에 br 추가
            await reg_dressYellowBox();
			event.preventDefault();
		}else{
            await reg_undoArrPop();
        }
        parentMethod(focusId);
    }

    //getShortCutKeyList(parentKeyList["shortCutKey"]);
    const shortCutKeyList = parentKeyList.map( (keyLabel, idx) => {
        let brtagVal = null;
        let domId = "shortCut"+keyLabel.id;
        let formulaBtnId = compId +"Id"+idx;
        if(keyLabel.lineChange == 1  ) brtagVal = <br/>;
        let arrowKeyClass="";
        if(keyLabel.formulUi === "="){
            arrowKeyClass=" shortCutBugWarn"
        }

        if(keyLabel.formulUi === "etc."){
            arrowKeyClass=" etcShotcutDesc"
        }

        if(keyLabel.formulUi === "&#8593;" || keyLabel.formulUi === "&#8657;"){
            arrowKeyClass=" shortCutKeyTop"
        }
        if(keyLabel.formulUi === "&#8592;" || keyLabel.formulUi === "&#8656;"){
            arrowKeyClass=" shortCutKeyLeft"
        }
        if(keyLabel.formulUi === "&#8595;" || keyLabel.formulUi === "&#8659;"){
            arrowKeyClass=" shortCutKeyBelow"
        }
        if(keyLabel.formulUi === "&#8594;" || keyLabel.formulUi === "&#8658;"){
            arrowKeyClass=" shortCutKeyRight"
        }
            return <span key={idx}>
                    <button type="button" className={"keySpan"+arrowKeyClass} id={formulaBtnId} title={keyLabel.formulName} data-formula-id={keyLabel.id} onClick={(event)=>addFormulaKey(event)}>
                        <sup className="supShortCut" >{keyLabel.shortcutKey}</sup>
                        <span className="shortCutKey" id={domId} >
                                <span dangerouslySetInnerHTML={{ __html:keyLabel.formulUi}} />
                        </span>
                    </button>
                    {brtagVal}
                    </span>
        
    });

    if(componentId=="shortKeyBoard"){
        return <>
                <div type="button" id={compId} className="shortKeyBoard" onMouseDown={(event)=>keepFocus(event)}>{shortCutKey}</div>
                
                <div id="etcShortCutRootDiv" className="blindBox hide">
                    <div className="etcShortCutDiv">
                        <div className="closeBtn2" onClick={()=>{document.getElementById("etcShortCutRootDiv").classList.add('hide');}}>X</div>
                            <div className="etcShortCutTitle">기타 단축키</div>
                            <div className="etcShortCutKeyDiv">
                                <div><span className="keyboardUI">shift</span>+<span className="keyboardUI">space</span> : 띄어쓰기 다섯칸</div>
                                <div><span className="keyboardUI">alt</span>+<span className="keyboardUI">→</span> : 수식 단축키 탭 오른쪽으로 이동</div>
                                <div><span className="keyboardUI">alt</span>+<span className="keyboardUI">←</span> : 수식 단축키 탭 왼쪽으로 이동</div>
                            </div>
                    </div>
                </div>

                <div id="bugUiRootDiv" className="blindBox hide">
                    <div className="bugUiDescDiv">
                        <div className="closeBtn2" onClick={()=>{document.getElementById("bugUiRootDiv").classList.add('hide');}}>X</div>
                        <div className="bugUiTitle"><span className="keyboardUI">alt</span>+<span className="keyboardUI">=</span> 단축키 버그 유의</div>
                        <div className="bugUiDesc">
                            alt+'=' 키는 인터넷 브라우저 자체 버그로 아래와 같은 현상이 발생할 수 있습니다.<br/>
                            해당 버그 발생시 한번 더 alt+'=' 키를 다시 누르고 글을 입력하면 정상 출력 됩니다.
                        </div>
                        <div className="bugUiImgWrap">
                            <div>alt+'=' 키 입력 후 텍스트 입력 화면</div>
                            <div><img src={shortCutButExImg1} className="bugUiImg" alt=""/></div>
                            <div className="greenText">정상 화면</div>
                            <div><img src={shortCutButExImg2} className="bugUiImg" alt=""/></div>
                        </div>
                    </div>
                </div>
                
            </>
    }else{
        return <>
            <div type="button" id={compId} className="shortKeyBoard hide" onMouseDown={(event)=>keepFocus(event)}>{shortCutKey}</div>
            
            <div id="bugUiRootDiv" className="blindBox hide">
                    <div className="bugUiDescDiv">
                        <div className="closeBtn2" onClick={()=>{document.getElementById("bugUiRootDiv").classList.add('hide');}}>X</div>
                        <div className="bugUiTitle"><span className="keyboardUI">alt</span>+<span className="keyboardUI">=</span> 단축키 버그 유의</div>
                        <div className="bugUiDesc">
                            alt+'=' 키는 브라우저 자체 버그로 아래와 같은 현상이 발생할 수 있습니다.<br/>
                            해당 버그 발생시 한번 더 alt+'=' 키를 다시 누르고 글을 입력하면 정상 출력 됩니다.
                        </div>
                        <div className="bugUiImgWrap">
                            <div>alt+'=' 키 입력 후 텍스트 입력 화면</div>
                            <div><img src={shortCutButExImg1} className="bugUiImg" alt=""/></div>
                            <div>정상 화면</div>
                            <div><img src={shortCutButExImg2} className="bugUiImg" alt=""/></div>
                        </div>
                    </div>
                </div>
        </>
    }
}

export default FormulaShortCutKey;


