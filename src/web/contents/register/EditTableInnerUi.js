import React, { useEffect } from 'react';
import {reg_eraseEditTbUI, reg_reGenerFormulBugFix, reg_tbCellMouseDown, reg_tbCellMouseMove, reg_undoStackByClick} from 'js/contents/register/contents_reg';

const EditTableInnerUi = ({parentMethod})=>{

    useEffect(()=>{
        let tdList = document.getElementById('editTableUi').getElementsByTagName('button');
		for(let i=0; i<tdList.length; i++){
			tdList[i].addEventListener('mouseover', function(){
				let rowIdx = tdList[i].dataset.row
				let colIdx = tdList[i].dataset.col;
				addCellUiClass(rowIdx, colIdx)
			});
			tdList[i].addEventListener('click', (event)=>addEditTable(event));
		}
        document.body.addEventListener('click',reg_eraseEditTbUI);
    },[])

    const addCellUiClass = async (rowIdx, colIdx) => {
		let tdList = document.getElementById('editTableUi').getElementsByTagName('button');
		for(let i=0; i<tdList.length; i++){
			if(tdList[i].dataset.row<=rowIdx && tdList[i].dataset.col<=colIdx){
				tdList[i].classList.add('selectedTd');
			}else{
				tdList[i].classList.remove('selectedTd');
			}
		}
		document.getElementById('nByNtag').innerHTML= (Number(rowIdx)+1)+"&#9747;"+(Number(colIdx)+1)
	}

    


    let tableIdx=0;
    const addEditTable = async (event)=>{
        event.preventDefault();
        tableIdx++;
        let isNoneTdBorder = document.getElementById("tbBorderCheck").checked;

        //table 노드 생성
        let rowIdx = Number(event.target.dataset.row)+1
        let cellIdx = Number(event.target.dataset.col)+1;
        let tmpNode= document.createElement('table');
        tmpNode.className = "editInnerTable";
        tmpNode.id= "editInnerTable"+tableIdx;
        let tBody = document.createElement('tbody')
        tmpNode.append(tBody);
        for(let i=0;i<rowIdx;i++){
            let rowNode= document.createElement('tr');
            for(let j=0; j<cellIdx;j++){
                let colNode= document.createElement('td');
                colNode.className = "innerTbTd";
                colNode.id = "innerTbTd"+i+j;
                
                colNode.style.width= 260/cellIdx+"px";
                if(!isNoneTdBorder) colNode.className ="innerTbTd noneBorderTd"
                let brNode = document.createElement('br');
                colNode.appendChild(brNode);
                rowNode.appendChild(colNode);
            }
            tBody.appendChild(rowNode);
        }

        let targetDomId ;
        if(!document.getElementById('contentsFormulaEditor').classList.contains('hide')) targetDomId="contentsFormulaEditor";
        else targetDomId="solutionFormulaEditor";

        //포커스를 한번도 주지 않은 경우(새로고침 후 클릭 한번 안한 경우)
        if(document.getSelection().focusNode==null){
            await reg_undoStackByClick(targetDomId);
            document.getElementById(targetDomId).appendChild(tmpNode);
            let range = document.createRange();
            range.setStart(document.getElementById(tmpNode.id).childNodes[0].childNodes[0], 0);
            range.setEnd(document.getElementById(tmpNode.id).childNodes[0].childNodes[0], 0);

            let innerTbTd = document.getElementById(tmpNode.id).querySelectorAll(".innerTbTd");
            for(let i=0; i<innerTbTd.length; i++){
                innerTbTd[i].addEventListener('mousedown', reg_tbCellMouseDown);
                innerTbTd[i].addEventListener('mousemove', reg_tbCellMouseMove);
            }

            const selection1 = document.getSelection();
            selection1.removeAllRanges();
            selection1.addRange(range);
            //show화면에 적용
            parentMethod(targetDomId);
            document.getElementById("editTableUi").classList.add("hide");
            event.stopPropagation();
            return;
        }

        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [start], (걸쳐있는 수식 요소 모두 제거 후 추가할지 결정 후 개발 필요)
        let startDom = document.getSelection().getRangeAt(0).startContainer.parentElement.closest('.nbBox');
        let endDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.nbBox')
        if(startDom!=null){
            document.getElementById("editTableUi").classList.add("hide");
            event.stopPropagation();
            return;
        }
        if(endDom!=null){
            document.getElementById("editTableUi").classList.add("hide");
            event.stopPropagation();
            return;
        }
        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [end]

        //테이블 안에 테이블 생성 금지[start]
        let targetCell= document.getSelection().getRangeAt(0).endContainer; 
		if(targetCell.tagName !== undefined){ //수식 요소인 경우
			targetCell = document.getSelection().getRangeAt(0).endContainer.closest('.innerTbTd');
		}else{
			targetCell = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.innerTbTd');
		}
        if(targetCell!==null){
            document.getElementById("editTableUi").classList.add("hide");
            return;
        } 
        //테이블 안에 테이블 생성 금지[end]

        const selection = document.getSelection();
        const newRange = selection.getRangeAt(0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        let focusId =document.activeElement.id;

        if(focusId !== targetDomId){
            document.getElementById(targetDomId).focus()
            let tmpCaretPoint= document.createElement('span');
		    tmpCaretPoint.className = "tmpCaretPoint";
		    tmpCaretPoint.innerHTML = ".";
            document.getElementById(targetDomId).appendChild(tmpCaretPoint);
            window.getSelection().getRangeAt(0).selectNode(tmpCaretPoint);
            window.getSelection().collapseToStart();
            tmpCaretPoint.remove();
            await reg_undoStackByClick(targetDomId);
            document.getElementById(targetDomId).appendChild(tmpNode);
        }else{ //포커스 있으면 그대로 진행
            if( !document.getSelection().isCollapsed ){
                if(await reg_reGenerFormulBugFix(false)) return;
            }
            await reg_undoStackByClick(targetDomId);
            window.getSelection().getRangeAt(0).insertNode(tmpNode);
            let tmpReGenerBugFix = document.getElementsByClassName("tmpReGenerBugFix");
			for(let i=0; i<tmpReGenerBugFix.length; i++){
				tmpReGenerBugFix[i].remove();
			}
			let tmpReGenerBugFix2 = document.getElementsByClassName("tmpReGenerBugFix2");
			for(let i=0; i<tmpReGenerBugFix2.length; i++){
				tmpReGenerBugFix2[i].remove();
			}
        }
       
        let range = document.createRange();
        range.setStart(document.getElementById(tmpNode.id).childNodes[0].childNodes[0], 0);
        range.setEnd(document.getElementById(tmpNode.id).childNodes[0].childNodes[0], 0);
		const selection1 = document.getSelection();
		selection1.removeAllRanges();
		selection1.addRange(range);

        let innerTbTd = document.getElementById(tmpNode.id).querySelectorAll(".innerTbTd");
        for(let i=0; i<innerTbTd.length; i++){
            innerTbTd[i].addEventListener('mousedown', reg_tbCellMouseDown);
            innerTbTd[i].addEventListener('mousemove', reg_tbCellMouseMove);
        }

        document.getElementById("editTableUi").classList.add("hide");
        event.stopPropagation();

        //show화면에 적용
        parentMethod(targetDomId);
    }


  return (              <>
                            <div>   
                                    <div>
                                        <label id="tbBorderDesc" className='tbBorderDesc'>
                                        <input id="tbBorderCheck" type="checkbox" defaultChecked/>
                                        테이블 내 윤곽선 표시
                                        </label>
                                        </div>
									<div className='editTbDivRow'>
                                        <button className="selectedTd" data-row="0" data-col="0"></button>
                                        <button data-row="0" data-col="1"></button>
                                        <button data-row="0" data-col="2"></button>
                                        <button data-row="0" data-col="3"></button>
                                        <button data-row="0" data-col="4"></button>
                                        <button data-row="0" data-col="5"></button>
                                        <button data-row="0" data-col="6"></button>
                                    </div>
									<div className='editTbDivRow'>
                                        <button data-row="1" data-col="0"></button>
                                        <button data-row="1" data-col="1"></button>
                                        <button data-row="1" data-col="2"></button>
                                        <button data-row="1" data-col="3"></button>
                                        <button data-row="1" data-col="4"></button>
                                        <button data-row="1" data-col="5"></button>
                                        <button data-row="1" data-col="6"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="2" data-col="0"></button>
                                        <button data-row="2" data-col="1"></button>
                                        <button data-row="2" data-col="2"></button>
                                        <button data-row="2" data-col="3"></button>
                                        <button data-row="2" data-col="4"></button>
                                        <button data-row="2" data-col="5"></button>
                                        <button data-row="2" data-col="6"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="3" data-col="0"></button>
                                        <button data-row="3" data-col="1"></button>
                                        <button data-row="3" data-col="2"></button>
                                        <button data-row="3" data-col="3"></button>
                                        <button data-row="3" data-col="4"></button>
                                        <button data-row="3" data-col="5"></button>
                                        <button data-row="3" data-col="6"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="4" data-col="0"></button>
                                        <button data-row="4" data-col="1"></button>
                                        <button data-row="4" data-col="2"></button>
                                        <button data-row="4" data-col="3"></button>
                                        <button data-row="4" data-col="4"></button>
                                        <button data-row="4" data-col="5"></button>
                                        <button data-row="4" data-col="6"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="5" data-col="0"></button>
                                        <button data-row="5" data-col="1"></button>
                                        <button data-row="5" data-col="2"></button>
                                        <button data-row="5" data-col="3"></button>
                                        <button data-row="5" data-col="4"></button>
                                        <button data-row="5" data-col="5"></button>
                                        <button data-row="5" data-col="6"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="6" data-col="0"></button>
                                        <button data-row="6" data-col="1"></button>
                                        <button data-row="6" data-col="2"></button>
                                        <button data-row="6" data-col="3"></button>
                                        <button data-row="6" data-col="4"></button>
                                        <button data-row="6" data-col="5"></button>
                                        <button data-row="6" data-col="6"></button>
                                    </div>
							</div>
                            <div id="nByNtag" className="nByNtag">1&#9747;1</div>
                        </>
  );
}

export default EditTableInnerUi;