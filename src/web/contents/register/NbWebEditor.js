import React from 'react';
import EditTableInnerUi from 'web/contents/register/EditTableInnerUi'
import {reg_undoStackByClick, reg_oneLineOneDiv, reg_undoArrPop} from 'js/contents/register/contents_reg';
import {nb_extensionCheck2, nb_module_handleImageUpload, nb_formDataFetch} from 'js/common/common_nb.js';
import editOutputScreen from 'img/editOutputScreen.PNG';
import formulaFocusAsistDesc from 'img/formulaFocusAsistDesc.PNG';
const NbWebEditor = ({parentMethod, showAsistDesc, showExceptBtn, isMultiMode, idx})=>{

	const tableUiShow = async function(event){
		event.preventDefault();
		
		if(event.target.closest(".editorToolBar").querySelector("#editTableUi").classList.contains('hide')){
			event.target.closest(".editorToolBar").querySelector("#editTableUi").classList.remove('hide');
		}else{
			event.target.closest(".editorToolBar").querySelector("#editTableUi").classList.add('hide');
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

		if(style === "insertImage"){
			//수식 안에서 이미지 삽입 금지(최상위 수식 뒤에 삽입)
			let currentNode = window.getSelection().anchorNode
			if(currentNode.classList === undefined){
				currentNode = currentNode.parentElement;
			}
			if(currentNode.closest(".nbBox") !== null){
				let rootFocusNbBox = currentNode.closest(".nbBox");
				while(rootFocusNbBox.parentElement.closest('.nbBox')!==null){
					rootFocusNbBox = rootFocusNbBox.parentElement.closest('.nbBox');
				}
				window.getSelection().getRangeAt(0).selectNode(rootFocusNbBox);
				window.getSelection().collapseToEnd();
			}

			if(event.target.value === "") return;
			//이미지 업로드
			let formData = new FormData();
			formData.append("actionId", 10);
      		formData.append("imgPath", "editorImgUpld");
			formData.append("multipartFile", event.target.files[0]);
			let returnObj = await nb_formDataFetch("/common/imgUpload", formData, true);
			let img=document.createElement("img");
			if(window.getSelection().anchorNode !== null && window.getSelection().anchorNode.parentElement !== null
			&& (
				window.getSelection().anchorNode.parentElement.closest(".contentsFormulaEditor")  !== null
				|| window.getSelection().anchorNode.parentElement.closest(".solutionFormulaEditor") !== null
				|| window.getSelection().anchorNode.parentElement.closest(".myHwpContents") !== null
			) ){
				let selection = document.getSelection();
				let newRange = selection.getRangeAt(0);
				if(newRange.startContainer.nodeName === "TR"){
					newRange.startContainer.querySelector("td").append(img);
					window.getSelection().collapseToEnd();
				}else{
					newRange.insertNode(img);
					window.getSelection().collapseToEnd();
				}
			}else{
				if(document.getElementById("myHwpContents") !== null && document.getElementById("myHwpContents") !== undefined){
					document.getElementById("myHwpContents").append(img);
				}else{
					if(isMultiMode){
						event.target.closest(".multiContents").querySelector(".contentsFormulaEditor").append(img);
					}else{
						if(!document.getElementById("contentsFormulaEditor").classList.contains("hide")){
							document.getElementById("contentsFormulaEditor").append(img);
						}else{
							document.getElementById("solutionFormulaEditor").append(img);
						}
					}
					
				}
			}
			img.style.width=367+"px";
			img.src=returnObj.s3ImgUrl;
			let contentEditClass;
			if(isMultiMode){
				event.target.closest(".multiContents").querySelector(".contents").value = event.target.closest(".multiContents").querySelector(".contentsFormulaEditor").innerHTML;
				event.target.closest(".multiContents").querySelector(".solution").value = event.target.closest(".multiContents").querySelector(".solutionFormulaEditor").innerHTML;
			}else{
				if(document.getElementById("contentsFormulaEditor") !==null){
					if(!document.getElementById("contentsFormulaEditor").classList.contains("hide")){
						contentEditClass = document.getElementById("contentsFormulaEditor");
						document.getElementById("contents").value = contentEditClass.innerHTML;
						document.getElementById("ques-show-contents").innerHTML = contentEditClass.innerHTML
					}else{
						contentEditClass = document.getElementById("solutionFormulaEditor");
						document.getElementById("solution").value = contentEditClass.innerHTML;
						document.getElementById("ques-solution-contents").innerHTML = contentEditClass.innerHTML;
					}
				}
			}
			

			event.target.value= "";
			/*
			let file =await nb_module_handleImageUpload(event)
			if(file !== undefined){
				let img=document.createElement("img");
				let reader  = new FileReader();
				img.style.width=367+"px";
				//포커스가 문제입력창 또는 해설 입력창에 있으면 포커스 위치에 이미지 삽입
				if(window.getSelection().anchorNode !== null && window.getSelection().anchorNode.parentElement !== null
				&& (
					window.getSelection().anchorNode.parentElement.closest(".contentsFormulaEditor") 
					|| window.getSelection().anchorNode.parentElement.closest(".solutionFormulaEditor")
					|| window.getSelection().anchorNode.parentElement.closest(".myHwpContents")
				) ){
					let selection = document.getSelection();
					let newRange = selection.getRangeAt(0);
					newRange.insertNode(img);
					window.getSelection().collapseToEnd();
				}else{
					if(document.getElementById("myHwpContents") !== null && document.getElementById("myHwpContents") !== undefined){
						document.getElementById("myHwpContents").append(img);
					}else{
						if(!document.getElementById("contentsFormulaEditor").classList.contains("hide")){
							document.getElementById("contentsFormulaEditor").append(img);
						}else{
							document.getElementById("solutionFormulaEditor").append(img);
						}
					}
				}
				
				reader.onload = async () => {
				   img.src=reader.result;
				   let contentEditClass;
				   if(document.getElementById("contentsFormulaEditor") !==null){
						if(!document.getElementById("contentsFormulaEditor").classList.contains("hide")){
							contentEditClass = document.getElementById("contentsFormulaEditor");
							document.getElementById("contents").value = contentEditClass.innerHTML;
							document.getElementById("ques-show-contents").innerHTML = contentEditClass.innerHTML
						}else{
							contentEditClass = document.getElementById("solutionFormulaEditor");
							document.getElementById("solution").value = contentEditClass.innerHTML;
							document.getElementById("ques-solution-contents").innerHTML = contentEditClass.innerHTML;
						}
				   }
				   
				}; 
				if (file) reader.readAsDataURL(file);
				event.target.value= "";
				return;
			}
			*/
		}

		//포커스를 한번도 주지 않은 경우(새로고침 후 클릭 한번 안한 경우)
		if(document.getSelection().focusNode==null){
			event.stopPropagation();
			return;
		} 

        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [start], 사용할지 안할지 판단 필요
        let startDom = document.getSelection().getRangeAt(0).startContainer.parentElement.closest('.nbBox');
        let endDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.nbBox')
        if(startDom!=null){
            event.stopPropagation();
            return;
        }
        if(endDom!=null){
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
		if(focusId === "contentsFormulaEditor" || focusId === "solutionFormulaEditor" || focusId === "myHwpContents" 
		|| focusId.indexOf("contentsFormulaEditor") >-1 || focusId.indexOf("solutionFormulaEditor") >-1){
			//정렬버그 해결
			if(style === "justifyLeft" || style === "justifyCenter" || style === "justifyRight" ){
				//복붙하여 span에 text-align적용되어 정렬 안되는 버그 해결
				let span = document.activeElement.querySelectorAll("span");
				for(let i=0; i<span.length; i++){
					if(span[i].style.textAlign !== ""){
						span[i].style.textAlign = ""
					}
				}
				//수식요소 뒤에 공백 주어 라인 마지막에 수식 있는 경우 수식요소 재성성되는 문제 해결
				let nbBoxes = document.activeElement.querySelectorAll(".nbBox");
				for(let i=0; i<nbBoxes.length; i++){
					let tmpNode = document.createElement('span');
					tmpNode.innerHTML = "&nbsp;"
					tmpNode.className = "tmpReGenerBugFix"
					let tmpNode2 = document.createElement('span');
					tmpNode2.innerHTML = "&nbsp;"
					tmpNode2.className = "tmpReGenerBugFix"
					nbBoxes[i].before(tmpNode2);
					nbBoxes[i].after(tmpNode);
				}
			}
			await reg_oneLineOneDiv();
			let strtContainer = window.getSelection().getRangeAt(0).startContainer;
			if(strtContainer.classList === undefined){
				if(strtContainer.parentElement.closest(".innerTbTd")!==null){
					strtContainer =strtContainer.parentElement.closest(".innerTbTd")
				}else{
					strtContainer = strtContainer.parentElement.closest("div")
				}
			}else{
				if(strtContainer.closest(".innerTbTd")!==null){
					strtContainer =strtContainer.closest(".innerTbTd")
				}else{
					strtContainer = strtContainer.closest("div")
				}
			}
			let endContainer = window.getSelection().getRangeAt(0).endContainer;
			if(endContainer.classList === undefined){
				if(endContainer.parentElement.closest(".innerTbTd")!==null){
					endContainer =endContainer.parentElement.closest(".innerTbTd")
				}else{
					endContainer = endContainer.parentElement.closest("div")
				}
			}else{
				if(endContainer.closest(".innerTbTd")!==null){
					endContainer =endContainer.closest(".innerTbTd")
				}else{
					endContainer = endContainer.closest("div")
				}
			}
			
			await reg_undoStackByClick(document.activeElement.id);

			if(style === "justifyLeft"){
				strtContainer.classList.remove("alignCenter");
				strtContainer.classList.remove("alignRight");
				strtContainer.classList.add("alignLeft");
				endContainer.classList.remove("alignCenter");
				endContainer.classList.remove("alignRight");
				endContainer.classList.add("alignLeft");
				let childDiv = document.activeElement.childNodes
				//셀렉트 안에 포함되는 div도 정렬
				for(let i=0; i<childDiv.length; i++){
					if(window.getSelection().containsNode(childDiv[i])){
						childDiv[i].classList.remove("alignCenter");
						childDiv[i].classList.remove("alignRight");
						childDiv[i].classList.add("alignLeft");
					}
				}
				//셀렉트 안에 포함되는 테이블 td도 정렬
				let nbSelectionTbTd = document.activeElement.querySelectorAll(".nbSelectionTbTd");
				for(let i=0; i<nbSelectionTbTd.length; i++){
					nbSelectionTbTd[i].classList.remove("alignCenter");
					nbSelectionTbTd[i].classList.remove("alignRight");
					nbSelectionTbTd[i].classList.add("alignLeft");
				}
			}else if(style === "justifyCenter"){
				strtContainer.classList.remove("alignLeft");
				strtContainer.classList.remove("alignRight");
				strtContainer.classList.add("alignCenter");
				endContainer.classList.remove("alignLeft");
				endContainer.classList.remove("alignRight");
				endContainer.classList.add("alignCenter");
				let childDiv = document.activeElement.childNodes
				//셀렉트 안에 포함되는 div도 정렬
				for(let i=0; i<childDiv.length; i++){
					if(window.getSelection().containsNode(childDiv[i])){
						childDiv[i].classList.remove("alignLeft");
						childDiv[i].classList.remove("alignRight");
						childDiv[i].classList.add("alignCenter");
					}
				}
				//셀렉트 안에 포함되는 테이블 td도 정렬
				let nbSelectionTbTd = document.activeElement.querySelectorAll(".nbSelectionTbTd");
				for(let i=0; i<nbSelectionTbTd.length; i++){
					nbSelectionTbTd[i].classList.remove("alignLeft");
					nbSelectionTbTd[i].classList.remove("alignRight");
					nbSelectionTbTd[i].classList.add("alignCenter");
				}
			}else if(style === "justifyRight"){
				strtContainer.classList.remove("alignCenter");
				strtContainer.classList.remove("alignLeft");
				strtContainer.classList.add("alignRight");
				endContainer.classList.remove("alignCenter");
				endContainer.classList.remove("alignLeft");
				endContainer.classList.add("alignRight");
				let childDiv = document.activeElement.childNodes
				//셀렉트 안에 포함되는 div도 정렬
				for(let i=0; i<childDiv.length; i++){
					if(window.getSelection().containsNode(childDiv[i])){
						childDiv[i].classList.remove("alignCenter");
						childDiv[i].classList.remove("alignLeft");
						childDiv[i].classList.add("alignRight");
					}
				}
				//셀렉트 안에 포함되는 테이블 td도 정렬
				let nbSelectionTbTd = document.activeElement.querySelectorAll(".nbSelectionTbTd");
				for(let i=0; i<nbSelectionTbTd.length; i++){
					nbSelectionTbTd[i].classList.remove("alignCenter");
					nbSelectionTbTd[i].classList.remove("alignLeft");
					nbSelectionTbTd[i].classList.add("alignRight");
				}
			}else if(style === "underline"){
				let uTag = document.createElement("u");
				if(window.getSelection().isCollapsed){
					let isActiveUnderLine = false;
					let activeSpan = null;
					if(window.getSelection().anchorNode.classList === undefined){
						if(window.getSelection().anchorNode.parentElement.tagName === "U"){
							isActiveUnderLine = true;
							activeSpan = window.getSelection().anchorNode.parentElement;
						}
					}else if(window.getSelection().anchorNode.classList !== undefined && window.getSelection().anchorNode.tagName === "U"){
						isActiveUnderLine = true;
						activeSpan = window.getSelection().anchorNode;
					}
					//underLine 효과 입혀진 태그 안에 있는 경우
					if(isActiveUnderLine){
						let tmpPositionDetect = document.createElement("span");
						tmpPositionDetect.className = "tmpPositionDetect"
						window.getSelection().getRangeAt(0).insertNode(tmpPositionDetect);
						let lastChild = null;
						for(let i=activeSpan.childNodes.length-1; i>=0; i--){
							if(!(activeSpan.childNodes[i].nodeName === "#text" && activeSpan.childNodes[i].length===0)) {
								lastChild=activeSpan.childNodes[i];
								break;
							}
						}
						//요소의 중간이면 효과 없음
						//요소의 마지막이면 효과 빠져나가기
						if(lastChild === tmpPositionDetect) {
							tmpPositionDetect.remove();
							window.getSelection().getRangeAt(0).selectNode(activeSpan);
							window.getSelection().collapseToEnd();
							let span = document.createElement("span");
							span.className = "cusUnderLineUnActive"
							span.innerHTML = "&#65279;";
							activeSpan.after(span);
							window.getSelection().getRangeAt(0).selectNode(span);
							window.getSelection().collapseToEnd();
							//keyup 이벤트에서 cusUnderLineUnActive 안에 요소 span 밖으로 빼내기 (span 없도록)
						}else{
							await reg_undoArrPop();
							tmpPositionDetect.remove();
						}
					//underLine 효과 안 입혀진 경우
					}else {
						uTag.innerHTML = "&#65279;";
						window.getSelection().getRangeAt(0).insertNode(uTag);
						window.getSelection().getRangeAt(0).selectNode(uTag);
						window.getSelection().collapseToEnd();
					}
				}
				else {
					document.execCommand(style);
					/*
					uTag.appendChild(window.getSelection().getRangeAt(0).cloneContents());
					window.getSelection().getRangeAt(0).deleteContents();
					window.getSelection().getRangeAt(0).insertNode(uTag);
					*/
				}
			}

			//정렬버그 공백 다시 제거
			if(style === "justifyLeft" || style === "justifyCenter" || style === "justifyRight" ){
				let tmpReGenerBugFix = document.getElementById(focusId).querySelectorAll(".tmpReGenerBugFix");
				for(let i=0; i<tmpReGenerBugFix.length; i++){
					tmpReGenerBugFix[i].remove();
				}
			}

		}else{
			//밑줄은 객관식도 가능
			if(style==="underline" ){
				await reg_oneLineOneDiv();
				await reg_undoStackByClick(document.activeElement.id);
				document.execCommand(style);
			}else{
				event.stopPropagation();
				return;
			}
		}
		parentMethod(document.activeElement.id);
		event.stopPropagation();
	}

	const asistDesc = async (event) => {
		document.getElementById("asistRootDiv").classList.remove('hide');
	}

	//사용불가(문항 제외 버튼 만들면 중간에 문항제외해도 form index가 앞에 있으면 disabled까지 끌고 올라감)
	const disabledFormEle = async (event) => {
		if(event.target.closest(".contentsRootDiv").classList.contains("disabled")){
			event.target.innerText = "문항제외";
			event.target.closest(".contentsRootDiv").classList.remove("disabled")
			let formEle = event.target.closest(".contentsRootDiv").querySelectorAll("input, select, button, textarea");
			for(let i=0; i<formEle.length; i++){
				if(formEle[i].classList.contains("contentsExcept")) continue;
				formEle[i].disabled = false;
				formEle[i].classList.remove("disabledBox");
			}
			let editEle = event.target.closest(".contentsRootDiv").querySelectorAll(".contentEditClass");
			for(let i=0; i<editEle.length; i++){
				if(editEle[i].classList.contains("contentsExcept")) continue;
				editEle[i].setAttribute("contenteditable", true);
				editEle[i].classList.remove("disabledBox");
			}
		}else{
			event.target.closest(".contentsRootDiv").classList.add("disabled")
			event.target.innerText = "제외취소";
			let formEle = event.target.closest(".contentsRootDiv").querySelectorAll("input, select, button, textarea");
			for(let i=0; i<formEle.length; i++){
				if(formEle[i].classList.contains("contentsExcept")) continue;
				formEle[i].disabled = true;
				formEle[i].classList.add("disabledBox");
			}
			let editEle = event.target.closest(".contentsRootDiv").querySelectorAll(".contentEditClass");
			for(let i=0; i<editEle.length; i++){
				if(editEle[i].classList.contains("contentsExcept")) continue;
				editEle[i].setAttribute("contenteditable", false);
				editEle[i].classList.add("disabledBox");
			}
		}
		
	}

  return (<>
    <div className="editorToolBar">
		<button className="editInsertImage editorBtn" title="이미지 추가" onClick={(event)=>{event.preventDefault();event.target.closest(".editorToolBar").querySelector("#webEditImageFile").click()}}></button>	

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

		{showAsistDesc && 
			<div className="asistDescBtn" title="도움말" onClick={(event) => asistDesc(event)}></div>
		}
		<input id="webEditImageFile" className='hide' type="file" accept="image/*" onChange={(event) => {nb_extensionCheck2(event);textEditor(event, 'insertImage');}} />

        <div id="editTableUi" className="editTableUi hide">
                <EditTableInnerUi parentMethod={parentMethod} idx={idx}></EditTableInnerUi>
                
            </div>
    </div>
		<div id="asistRootDiv" className="blindBox hide">
		<div className="asistDiv">
			<div className="closeBtn2" onClick={()=>{document.getElementById("asistRootDiv").classList.add('hide');}}>X</div>
				<div className="asistTitle">도움말</div>
				<div className="asistDescWrap">
					<div className="marginTenAuto">1. 사용자의 포커스가 위치하는 수식에는 노란색 점선으로 표시됩니다.<br/> 회색 굵은 점선 안의 영역은 수식을 표현하는 UI로 수식 UI가 변경되지 않게 입력이 불가합니다.</div>
					<div><img src={formulaFocusAsistDesc} className="formulaFocusAsistDesc" alt=""/></div>
					<div className="marginTenAuto">2. 편집화면은 수식의 테두리에 점선이 추가되어 미리보기 화면과 너비가 다를 수 있습니다.</div>
					<div><img src={editOutputScreen} className="etcEditOutpuScreenImg" alt=""/></div>
				</div>
		</div>
	</div>
	</>
  );
}

export default NbWebEditor;