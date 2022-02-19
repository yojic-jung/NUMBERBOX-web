import React, { useEffect } from 'react';


const EditTableInnerUi = ({parentMethod})=>{


    useEffect(()=>{
        let tdList = document.getElementById('editTableUi').getElementsByTagName('button');
		for(let i=0; i<tdList.length; i++){
			tdList[i].addEventListener('mouseover', function(event){
				let rowIdx = tdList[i].dataset.row
				let colIdx = tdList[i].dataset.col;
				addCellUiClass(rowIdx, colIdx)
			});
			tdList[i].addEventListener('click', (event)=>addEditTable(event));
		}

        document.body.addEventListener('click',function(event){
            let tagetDom = event.target.closest('button');
            if(tagetDom==null) {
                document.getElementById("editTableUi").classList.add("hide");
                return;
            }
            let targetId = tagetDom.id;
            if(targetId != "editTableBtn" || targetId !="editTableBtn"){
                document.getElementById("editTableUi").classList.add("hide");
            } 
        });
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

    const addEditTable = (event)=>{
        event.preventDefault();



        //table 노드 생성
        let rowIdx = Number(event.target.dataset.row)+1
        let cellIdx = Number(event.target.dataset.col)+1;
        let tmpNode= document.createElement('table');
        tmpNode.className = "editInnerTable";
        for(let i=0;i<rowIdx;i++){
            let rowNode= document.createElement('tr');
            for(let j=0; j<cellIdx;j++){
                let colNode= document.createElement('td');
                let brNode = document.createElement('br');
                colNode.appendChild(brNode);
                rowNode.appendChild(colNode);
            }
            tmpNode.appendChild(rowNode);
        }

        let targetDomId ;
        if(!document.getElementById('contentsFormulaEditor').classList.contains('hide')) targetDomId="contentsFormulaEditor";
        else targetDomId="solutionFormulaEditor";

        //포커스를 한번도 주지 않은 경우(새로고침 후 클릭 한번 안한 경우)
        if(document.getSelection().focusNode==null){
            document.getElementById(targetDomId).appendChild(tmpNode);
            //show화면에 적용
            parentMethod(targetDomId);
            document.getElementById("editTableUi").classList.add("hide");
            event.stopPropagation();
            return;
        }

        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [start], 사용할지 안할지 판단 필요
        let startDom = document.getSelection().getRangeAt(0).startContainer.parentElement.closest('table');
        let endDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('table')
        if(startDom!=null && startDom.classList.contains('msbBox')){
            event.stopPropagation();
            return;
        }
        if(endDom!=null && endDom.classList.contains('msbBox')){
            event.stopPropagation();
            return;
        }
        //드래그가 수식에 걸쳐있는 경우 에디터 이벤트 적용X [end]

        const selection = document.getSelection();
        const newRange = selection.getRangeAt(0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        let focusId =document.activeElement.id;

        if(focusId != targetDomId){
            document.getElementById(targetDomId).appendChild(tmpNode);
        }else{ //포커스 있으면 그대로 진행
            newRange.deleteContents();
            newRange.insertNode(tmpNode);
            window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
        }
        document.getElementById("editTableUi").classList.add("hide");
        event.stopPropagation();

        //show화면에 적용
        parentMethod(targetDomId);
    }


  return (              <>
                            <div>
									<div className='editTbDivRow'>
                                        <button className="selectedTd" data-row="0" data-col="0"></button>
                                        <button data-row="0" data-col="1"></button>
                                        <button data-row="0" data-col="2"></button>
                                        <button data-row="0" data-col="3"></button>
                                        <button data-row="0" data-col="4"></button>
                                    </div>
									<div className='editTbDivRow'>
                                        <button data-row="1" data-col="0"></button>
                                        <button data-row="1" data-col="1"></button>
                                        <button data-row="1" data-col="2"></button>
                                        <button data-row="1" data-col="3"></button>
                                        <button data-row="1" data-col="4"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="2" data-col="0"></button>
                                        <button data-row="2" data-col="1"></button>
                                        <button data-row="2" data-col="2"></button>
                                        <button data-row="2" data-col="3"></button>
                                        <button data-row="2" data-col="4"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="3" data-col="0"></button>
                                        <button data-row="3" data-col="1"></button>
                                        <button data-row="3" data-col="2"></button>
                                        <button data-row="3" data-col="3"></button>
                                        <button data-row="3" data-col="4"></button>
                                    </div>
                                    <div className='editTbDivRow'>
                                        <button data-row="4" data-col="0"></button>
                                        <button data-row="4" data-col="1"></button>
                                        <button data-row="4" data-col="2"></button>
                                        <button data-row="4" data-col="3"></button>
                                        <button data-row="4" data-col="4"></button>
                                    </div>
							</div>
                            <div id="nByNtag" className="nByNtag">1&#9747;1</div>
                        </>
  );
}

export default EditTableInnerUi;