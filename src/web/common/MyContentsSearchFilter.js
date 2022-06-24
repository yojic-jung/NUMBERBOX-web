import React, {useState, useEffect } from 'react';
import {nb_dataFetch} from 'js/common/common_nb.js';
import {Link} from "react-router-dom";

const MyContentsSearchFilter = ({makeContentsShow, descMsg})=>{
    const [subjectList, setSubjectList] = useState(new Array());
    
    useEffect(()=>{
        window.addEventListener('click', hideSearchFilter);
        const asyncUseEffect = async () =>{
            let jsonObj = await nb_dataFetch('/mathInfo/unitInfo', true);
            setSubjectList(jsonObj["mathSubjectInfo"]);
        }
        asyncUseEffect();
        return ()=>removeAddedEvent();
    }, []);

    const removeAddedEvent = async ()=>{
        window.removeEventListener('click', hideSearchFilter);
    }

    const hideSearchFilter = async (event)=>{
        let target = event.target;
        if(!target.classList.contains("myConSeachFilter")){
            let mySearchFilter = document.getElementsByClassName("mySearchFilter-list");
            for(let i=0; i<mySearchFilter.length; i++){
                mySearchFilter[i].classList.add("hide");
            }
        }
        
    }
    const seachFilterClick = async (targetId)=>{
        let target = document.getElementById(targetId);
        if(target.classList.contains("hide")){
            target.classList.remove("hide");
        }else{
            target.classList.add("hide");
        }

        let mySearchFilter = document.getElementsByClassName("mySearchFilter-list");
        for(let i=0; i<mySearchFilter.length; i++){
            if(target !== mySearchFilter[i]){
                mySearchFilter[i].classList.add("hide");
            }
        }

    }
    

    const myContentsSortFilter = async(event, sortBy) =>{
        let contentsNodeList = document.getElementsByClassName("contents-show")[0].childNodes;
        var contentsArray = [].slice.call(contentsNodeList, 0);
        if(sortBy==="latest"){
            contentsArray.sort(function(a, b)  {
                return Number(b.dataset.sysCreateDate) - Number(a.dataset.sysCreateDate);       //내림차순, 날짜 큰것 부터 작 순으로
              });
        }else if(sortBy==="oldest"){
            
            contentsArray.sort(function(a, b)  {
                return Number(a.dataset.sysCreateDate) - Number(b.dataset.sysCreateDate);       //오름차순, 날짜 작은것 부터 큰 순으로
              });
        }
        for(let i=0;i<contentsNodeList.length; i++){
            contentsNodeList[i].remove();
        }
        for(let i=0;i<contentsArray.length; i++){
            document.getElementsByClassName("contents-show")[0].append(contentsArray[i]);
        }
        document.getElementById("mySortFilterTitle").innerText= event.target.innerText;
    }


    const myContentsSubFilter = async(event) =>{
        let target = event.target;
        let targetUnitUniqno = target.dataset.unitUniqNo.substr(0,2);
        if(targetUnitUniqno==="00"){ document.getElementById("mySubFilterTitle").innerText = "학년 및 과목";}
        else {document.getElementById("mySubFilterTitle").innerText= target.innerText;}

       
        let contentsDiv = document.getElementsByClassName("contentsDivForFilter");
        for(let i=0; i<contentsDiv.length; i++){
           if(targetUnitUniqno==="00"){
                contentsDiv[i].classList.remove("hide");
                continue;
           }
           let unitUniqNo =  contentsDiv[i].dataset.unitUniqNo.substr(0,2);
           if(targetUnitUniqno !==unitUniqNo){
                contentsDiv[i].classList.add("hide");
           }else{
                contentsDiv[i].classList.remove("hide");
           }
        }
        let filterdCnt = 0;
        for(let i=0; i<contentsDiv.length; i++){
            if(!contentsDiv[i].classList.contains("hide")){
                filterdCnt++;
            }
        }
        if(filterdCnt>0){
            document.getElementById("filetedEmptyMsg").classList.add("hide");
        }else{
            document.getElementById("filetedEmptyMsg").classList.remove("hide");
        }
    }
    const subjectFilterList = subjectList.map( (contentsMap, idx) => {
        return (
            <li key={contentsMap.unitUniqNo} data-unit-uniq-no={contentsMap.unitUniqNo} onClick={(event)=>{myContentsSubFilter(event)}}>{contentsMap.mainVal}</li>
        );
    });
    return (
            <>
                <div className="bi-jutify-align2">
                    <div>
                        <span className='relative'>
                            <span id="mySubFilterTitle" className="myConSeachFilter" onClick={()=>{seachFilterClick("subjectFilterList")}}>학년 및 과목</span>
                            <ul id="subjectFilterList" className="mySearchFilter-list hide">
                                <li data-unit-uniq-no="00" onClick={(event)=>{myContentsSubFilter(event)}}>전체</li>
                                {subjectFilterList}
                            </ul>
                        </span>
                        <span className='relative'>
                            <span id="mySortFilterTitle" className="myConSeachFilter" onClick={()=>{seachFilterClick("productFilterList")}}>정렬</span>
                            <ul id="productFilterList" className="mySearchFilter-list hide">
                                <li onClick={(event)=>{myContentsSortFilter(event, "latest")}}>최신순</li>
                                <li onClick={(event)=>{myContentsSortFilter(event, "oldest")}}>오래된순</li>
                            </ul>
                        </span>
                        <span className='mini-title3'>{descMsg}</span>
                    </div>
                    {makeContentsShow &&
                    <Link className='linkNoneCss' to="/makeContents">
                        <div className="updateBtn2">문제 만들기</div>
                    </Link>
                    }
                </div>
                <div className='relative'>
                        <div id="filetedEmptyMsg" className='filetedEmptyMsg hide'>해당하는 조건의 문제내역이 없습니다.</div>
                </div>
            </>
    )
}

export default MyContentsSearchFilter;