import React from 'react';
import EditTableInnerUi from 'web/contents/register/EditTableInnerUi'


const NbWebEditor = ({parentMethod})=>{

	const tableUiShow = async function(event){
		event.preventDefault();

		if(document.getElementById('editTableUi').classList.contains('hide')){
			document.getElementById('editTableUi').classList.remove('hide');
		}else{
			document.getElementById('editTableUi').classList.add('hide');
		}
        
		
		//포커스를 한번도 주지 않은 경우
		if(document.getSelection().focusNode==null){
			event.stopPropagation();
			return;
		}

		//표 버튼 클릭시 포커스 잃어버리지 않게 로직 구현 [start]
		//드래그 하지 않고 포커스가 한개인 경우
		if(document.getSelection().isCollapsed){
			const selection = document.getSelection();
			const newRange = selection.getRangeAt(0);
			selection.removeAllRanges();
			selection.addRange(newRange);
			window.getSelection().collapseToEnd();	//셀렉션객체의 마지막 부분에 포커스 맞춤
		
		//드래그 한 경우
		}else{
			const selection = document.getSelection();
			const newRange = selection.getRangeAt(0);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}
		//표 버튼 클릭시 포커스 잃어버리지 않게 로직 구현 [end]
		event.stopPropagation();
	}

	const textEditor = async function(event, style){
		event.preventDefault();

		//포커스를 한번도 주지 않은 경우(새로고침 후 클릭 한번 안한 경우)
		if(document.getSelection().focusNode==null){
			event.stopPropagation();
			return;
		} 

        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [start], 사용할지 안할지 판단 필요
        let startDom = document.getSelection().getRangeAt(0).startContainer.parentElement.closest('table');
        let endDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('table')
        if(startDom!=null && startDom.classList.contains('nbBox')){
            event.stopPropagation();
            return;
        }
        if(endDom!=null && endDom.classList.contains('nbBox')){
            event.stopPropagation();
            return;
        }
 		//드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [end]
		 
		 const selection = document.getSelection();
		 const newRange = selection.getRangeAt(0);
		 selection.removeAllRanges();
		 selection.addRange(newRange);
		 let focusId = document.activeElement.id;
		//드래그한 부분이 없이 오로지 포커스가 하나인 경우(밑줄 및 정렬 기능의 경우 스타일 적용 이후 드래그 유지 위해 드래그 여부 구분 필요)
		if(document.getSelection().isCollapsed) window.getSelection().collapseToEnd();	//셀렉션객체의 마지막 부분에 포커스 맞춤

		//문제입력과 해설입력 창에만 적용
		if(focusId == "contentsFormulaEditor" || focusId == "solutionFormulaEditor"){

			//정렬버그 해결(뒤에 공백 주어 수식요소 재성성되는 문제 해결)
			let nbBoxes = document.getElementById(focusId).querySelectorAll(".nbBox");
			let tmpNode= document.createElement('span');
			tmpNode.innerHTML = "&nbsp;"
			tmpNode.className = "tmpReGenerBugFix"
			for(let i=0; i<nbBoxes.length; i++){
				nbBoxes[i].after(tmpNode)
			}
			document.execCommand(style);
			//정렬버그 공백 다시 제거
			let tmpReGenerBugFix = document.getElementById(focusId).querySelectorAll(".tmpReGenerBugFix");
			for(let i=0; i<tmpReGenerBugFix.length; i++){
				tmpReGenerBugFix[i].remove();
			}

		}else{
			//밑줄은 객관식도 가능
			if(style==="underline" ){
				document.execCommand(style);
			}else{
				event.stopPropagation();
				return;
			}
		}
		/*
		if(style=="underline"){
			let styleTag = document.createElement('u');
			document.getSelection().getRangeAt(0).surroundContents(styleTag);
		}else if(style=="justifyLeft"){
			document.getSelection().getRangeAt(0).startContainer.parentElement.style.textAlign="left";
		}else if(style=="justifyCenter"){
			document.getSelection().getRangeAt(0).startContainer.parentElement.style.textAlign="center";
		}else if(style=="justifyRight"){
			document.getSelection().getRangeAt(0).startContainer.parentElement.style.textAlign="right";
		}
		*/
		parentMethod(document.activeElement.id);
		event.stopPropagation();
	}

  return (
    <div className="editorToolBar">
        <button className="editUnderLine editorBtn" title="밑줄" onClick={(event) => textEditor(event, 'underline')}>U</button>
        
        <button className="editLeftAlign editorBtn" title="왼쪽 정렬" onClick={(event) => textEditor(event, 'justifyLeft')}>
            <div className="burgerDiv">
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
            </div>
        </button>
        <button className="editBiDirAlign editorBtn" title="가운데 정렬" onClick={(event) => textEditor(event, 'justifyCenter')}>
            <div className="burgerDiv">
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
            </div>
        </button>
        <button className="editRightAlign editorBtn" title="오른쪽 정렬" onClick={(event) => textEditor(event, 'justifyRight')}>
            <div className="burgerDiv" align="right">
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
                <div className="burgerInline"></div>
            </div>
        </button>
        <button id="editTableBtn" className="editTable editorBtn" title="표" onClick={(event) => tableUiShow(event)}>
            <table id="editorTable">
                <tbody>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                </tbody>
            </table>
            <span className="editTableArrow">&#129171;</span>
        </button>

        <div id="editTableUi" className="editTableUi hide">
                <EditTableInnerUi parentMethod={parentMethod}></EditTableInnerUi>
                
            </div>
    </div>
  );
}

export default NbWebEditor;