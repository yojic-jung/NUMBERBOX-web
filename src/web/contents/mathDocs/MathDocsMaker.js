import React, {useState, useEffect } from 'react';
import { Outlet } from "react-router";
import "css/page/mathDocs.css";
import {nb_dataFetch, nb_fadeInOutB} from 'js/common/common_nb.js';
import { Bar  } from 'react-chartjs-2';
const options = {
    legend: {
      display: false, // label 보이기 여부
    },
    scales: {
      yAxes: [{
        ticks: { 
          min: 0, // y축 스케일에 대한 최소값 설정
          stepSize: 1, // y축 그리드 한 칸당 수치
        }
      }]
    },
   
    // false : 사용자 정의 크기에 따라 그래프 크기가 결정됨.
    // true : 크기가 알아서 결정됨.
    maintainAspectRatio: false 
  }
  const data = {
    // 각 막대별 라벨
    labels: ['1번 막대', '2번 막대', '3번 막대'],
    datasets: [
      {
        borderWidth: 1, // 테두리 두께
        data: [1,2,3], // 수치
        backgroundColor:['yellow','red','green'] // 각 막대 색
      }
    ]
  };

const MathDocsMaker = ()=>{

    const [subjectList, setSubjectList] = useState(new Array());

    useEffect(() => {
            const asyncUseEffect = async function(){
                let jsonObj = await nb_dataFetch('/mathInfo/unitInfo', true);
                setSubjectList(jsonObj["mathSubjectInfo"])
                unitListSetFunction(jsonObj["mathSubjectInfo"], jsonObj["mathSecUnitInfo"], jsonObj["mathThrUnitInfo"]);
            }
            asyncUseEffect();
    },[]);

    const conCntSelect = (event) => {
        let conCntSelTd = document.getElementsByClassName("conCntSelTd");
        for(let i=0; i<conCntSelTd.length; i++){
            conCntSelTd[i].classList.remove("active");
        }
        event.target.classList.add("active");
        document.getElementById("conCntInput").value = event.target.innerHTML;
    }

    const levelSelect = (event) => {
        let levelSelTd = document.getElementsByClassName("levelSelTd");
        for(let i=0; i<levelSelTd.length; i++){
            levelSelTd[i].classList.remove("active");
        }
        event.currentTarget.classList.add("active");
        event.currentTarget.querySelector("label").click();
    }

    const firstStepCheck = async () => {
        if(document.getElementsByClassName("typeBtn active").length === 0){
            alert("단원 또는 유형을 선택해 주세요.");
            return;
        }

        if(document.getElementsByClassName("typeBtn active").length > 300){
            alert("선택할 수 있는 세부 유형은 최대 300개 입니다."
            +"\n현재 선택한 유형 개수는 "+document.getElementsByClassName("typeBtn active").length+"개 입니다."
            +"\n단원 또는 유형을 체크 해제하여 선택하신 유형을 줄여주세요.");
            return;
        }

        let typeBtn = document.getElementsByClassName("typeBtn")
        let unitUniqNoAndTypeNo = "";
        for(let i=0; i< typeBtn.length; i++){
            if(!typeBtn[i].classList.contains("active")) continue;
            if(unitUniqNoAndTypeNo === ""){
                unitUniqNoAndTypeNo += typeBtn[i].dataset.unitUniqNo+","+typeBtn[i].dataset.typeNo;
            }else{
                unitUniqNoAndTypeNo += "-"+typeBtn[i].dataset.unitUniqNo+","+typeBtn[i].dataset.typeNo;
            }
        }

        

        let isLevelChecked = false;
        let level = document.getElementsByName("level");
        let quesLevel;
        for(let i=0; i<level.length; i++){
            if(level[i].checked){
                quesLevel=level[i].value;
                isLevelChecked = true;
                break;
            }
        }

        if(!isLevelChecked){
            alert("난이도를 선택해 주세요.");
            return;
        }

        let conCntInput = document.getElementById("conCntInput").value;
        let check = /^[0-9]+$/; 
        if (!check.test(conCntInput)) {    
            alert("문항 수를 1 이상 100 이하의 숫자로 적어주세요.");
            return;
        }

        if (conCntInput<1 || conCntInput>100) {    
            alert("문항 수는 1문제 이상 100문제 이하로 입력해주시기 바랍니다.");
            return;
        }
        console.log(unitUniqNoAndTypeNo);

        let jsonObj = await nb_dataFetch('/mathDocs/mathDocs?unitUniqNoAndTypeNoList='+unitUniqNoAndTypeNo+"&quesLevel="+quesLevel+"&conCnt="+conCntInput, true);
        console.log(jsonObj);
        let mathContentsList = jsonObj["mathContentsList"];
        let lv1Len=0;
        let lv2Len=0;
        let lv3Len=0;
        let lv4Len=0;
        let lv5Len=0;
        for(let i=0; i<mathContentsList.length; i++){
            if(mathContentsList[i].quesLevel === 1){
                lv1Len +=1;
            }else if(mathContentsList[i].quesLevel === 2){
                lv2Len +=1;
            }else if(mathContentsList[i].quesLevel === 3){
                lv3Len +=1;
            }else if(mathContentsList[i].quesLevel === 4){
                lv4Len +=1;
            }else if(mathContentsList[i].quesLevel === 5){
                lv5Len +=1;
            }
        }
        console.log("[난이도 하] 개수:"+lv1Len+", 비율 : "+lv1Len/mathContentsList.length);
        console.log("[난이도 중하] 개수:"+lv2Len+", 비율 : "+lv2Len/mathContentsList.length);
        console.log("[난이도 중] 개수:"+lv3Len+", 비율 : "+lv3Len/mathContentsList.length);
        console.log("[난이도 중상] 개수:"+lv4Len+", 비율 : "+lv4Len/mathContentsList.length);
        console.log("[난이도 상] 개수:"+lv5Len+", 비율 : "+lv5Len/mathContentsList.length);
        console.log("전체 문제 개수 : "+mathContentsList.length);
    }

    const unitSelct = async (event) => {
        let subjectBtnWrap = document.getElementsByClassName("subjectBtnWrap");
        for(let i=0; i<subjectBtnWrap.length; i++){
            if(!event.target.classList.contains("active")){
                if(event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo){
                    subjectBtnWrap[i].classList.remove("hide");
                    if(event.target.dataset.typeExist === "false"){
                        let unitUniqNoList = "";
                        let thrUnitBtn = subjectBtnWrap[i].querySelectorAll(".thrUnitBtn");
                        for(let j=0; j<thrUnitBtn.length; j++){
                            if(j === 0){
                                unitUniqNoList += thrUnitBtn[j].dataset.unitUniqNo;
                            }else{
                                unitUniqNoList += ","+thrUnitBtn[j].dataset.unitUniqNo;
                            }
                        }
                        let jsonObj = await nb_dataFetch('/mathInfo/typeInfoList?unitUniqNoList='+unitUniqNoList, true);
                        let thrUnitBtnWrap = subjectBtnWrap[i].querySelectorAll(".thrUnitBtnWrap");
                        let mathTypeInfoList = jsonObj["mathTypeInfoList"];
                        console.log(mathTypeInfoList);
                        for(let j=0; j<thrUnitBtnWrap.length; j++){
                            for(let k=0; k<mathTypeInfoList.length; k++){
                                if(thrUnitBtnWrap[j].querySelector(".thrUnitBtn ").dataset.unitUniqNo === mathTypeInfoList[k].mathTypeDomain.unitUniqNo){
                                    let tmpDiv = document.createElement("div");
                                    tmpDiv.className="typeBtnWrap hide"
                                    let tmpSpan = document.createElement("span");
                                    tmpSpan.innerHTML = mathTypeInfoList[k].quesType;
                                    tmpSpan.className="typeBtn"
                                    tmpSpan.dataset.unitUniqNo = mathTypeInfoList[k].mathTypeDomain.unitUniqNo;
                                    tmpSpan.dataset.typeNo = mathTypeInfoList[k].mathTypeDomain.typeNo;
                                    tmpSpan.addEventListener("click", typeClickFunction);
                                    tmpDiv.append(tmpSpan);
                                    thrUnitBtnWrap[j].append(tmpDiv);
                                }
                            }
                           
                        }
                        event.target.dataset.typeExist = "true";
                    }
                }
            }else{
                if(event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo){
                    subjectBtnWrap[i].classList.add("hide");
                    let activeBtn = subjectBtnWrap[i].querySelectorAll(".active");
                    for(let i=0; i<activeBtn.length; i++){
                        if(!(activeBtn[i].classList.contains("subjectFoldBtn") || activeBtn[i].classList.contains("secUnitFoldBtn")
                        || activeBtn[i].classList.contains("thrUnitFoldBtn"))){
                            activeBtn[i].classList.remove("active")
                        }
                    }
                }
                
            }
           
        }
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
        }else{
            event.target.classList.add("active");
        }
    }

    const subjectClickFunction = (event) => {
        let secUnitBtn = event.target.parentElement.querySelectorAll(".secUnitBtn");
        let thrUnitBtn = event.target.parentElement.querySelectorAll(".thrUnitBtn");
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }
        }
    }

    const subjectClickFoldFunction = (event) => {
        let secUnitBtn = event.target.parentElement.querySelectorAll(".secUnitBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.remove("hide");
            }
        }
    }


    const secUnitClickFunction = (event) => {
        let thrUnitBtn = event.target.parentElement.querySelectorAll(".thrUnitBtn");
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }

            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }

        
    }

    const secUnitFoldClickFunction = (event)=>{
        let thrUnitBtnWrap = event.target.parentElement.querySelectorAll(".thrUnitBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<thrUnitBtnWrap.length; i++){
                thrUnitBtnWrap[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<thrUnitBtnWrap.length; i++){
                thrUnitBtnWrap[i].classList.remove("hide");
            }
            
        }
    }

    

    const thrUnitClickFunction = (event) => {
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }

            //중단원이 전부 체크 되어있으면 대단원 체크해주기
            let isThrAllChecked = true;
            let thrUnitBtn = event.target.closest(".secUnitBtnWrap").querySelectorAll(".thrUnitBtn");
            for(let i=0; i<thrUnitBtn.length; i++){
                if(!thrUnitBtn[i].classList.contains("active")){
                    isThrAllChecked = false;
                    break;
                }
            }

            if(isThrAllChecked){
                event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.add("active");
            }
           
            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }
    }

    const thrUnitFoldClickFunction = (event)=>{
        let typeBtnWrap = event.target.parentElement.querySelectorAll(".typeBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<typeBtnWrap.length; i++){
                typeBtnWrap[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<typeBtnWrap.length; i++){
                typeBtnWrap[i].classList.remove("hide");
            }
            
        }
    }

    const typeClickFunction = (event) => {
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".thrUnitBtnWrap").querySelector(".thrUnitBtn").classList.remove("active");
            event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
        }else{
            event.target.classList.add("active");

            //유형이 전부 체크 되어있으면 중단원 체크해주기
            let isTypeAllChecked = true;
            let typeBtn = event.target.closest(".thrUnitBtnWrap").querySelectorAll(".typeBtn");
            for(let i=0; i<typeBtn.length; i++){
                if(!typeBtn[i].classList.contains("active")){
                    isTypeAllChecked = false;
                    break;
                }
            }

            if(isTypeAllChecked){
                event.target.closest(".thrUnitBtnWrap").querySelector(".thrUnitBtn").classList.add("active");
            }

            //중단원이 전부 체크 되어있으면 대단원 체크해주기
            let isThrAllChecked = true;
            let thrUnitBtn = event.target.closest(".secUnitBtnWrap").querySelectorAll(".thrUnitBtn");
            for(let i=0; i<thrUnitBtn.length; i++){
                if(!thrUnitBtn[i].classList.contains("active")){
                    isThrAllChecked = false;
                    break;
                }
            }

            if(isThrAllChecked){
                event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.add("active");
            }
           
            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }
    }

    const unitListSetFunction = (subjectList, secUnitList, thrUnitList) => {
        for(let i=0; i<subjectList.length; i++){
            let tmpDiv = document.createElement("div");
            tmpDiv.className="subjectBtnWrap hide"
            tmpDiv.dataset.subjectInfo = subjectList[i].mainVal;
            let tmpSpanFoldBtn = document.createElement("span");
            tmpSpanFoldBtn.innerHTML = "&#10095;";
            tmpSpanFoldBtn.className="subjectFoldBtn active"
            tmpSpanFoldBtn.addEventListener("click", subjectClickFoldFunction);
            tmpDiv.append(tmpSpanFoldBtn);
            let tmpSpan = document.createElement("span");
            tmpSpan.innerHTML = subjectList[i].mainVal;
            tmpSpan.className="subjectBtn"
            tmpSpan.addEventListener("click", subjectClickFunction);
            tmpDiv.append(tmpSpan);
            document.getElementsByClassName("mathDocsSubjectListDiv")[0].append(tmpDiv);
        }

        let subjectBtnList = document.getElementsByClassName("subjectBtnWrap");
        for(let i=0; i<subjectBtnList.length; i++){
            for(let j=0; j< secUnitList.length; j++){
                if(subjectBtnList[i].dataset.subjectInfo === secUnitList[j].parentVal){
                    let tmpDiv = document.createElement("div");
                    tmpDiv.dataset.secUnitInfo = secUnitList[j].mainVal;
                    tmpDiv.className="secUnitBtnWrap"
                    let tmpSpanFoldBtn = document.createElement("span");
                    tmpSpanFoldBtn.innerHTML = "&#10095;";
                    tmpSpanFoldBtn.className="secUnitFoldBtn"
                    tmpSpanFoldBtn.addEventListener('click', secUnitFoldClickFunction);
                    tmpDiv.append(tmpSpanFoldBtn);
                    let tmpSpan = document.createElement("span");
                    tmpSpan.innerHTML = secUnitList[j].mainVal;
                    tmpSpan.className="secUnitBtn"
                    tmpSpan.addEventListener("click", secUnitClickFunction);
                    tmpDiv.append(tmpSpan);
                    subjectBtnList[i].append(tmpDiv);
                }
            }
        }

        let secUnitBtnList = document.getElementsByClassName("secUnitBtnWrap");
        for(let i=0; i<secUnitBtnList.length; i++){
            for(let j=0; j< thrUnitList.length; j++){
                if(secUnitBtnList[i].dataset.secUnitInfo === thrUnitList[j].parentVal){
                    let tmpDiv = document.createElement("div");
                    tmpDiv.dataset.thrUnitInfo = thrUnitList[j].mainVal;
                    tmpDiv.className="thrUnitBtnWrap hide"
                    let tmpSpanFoldBtn = document.createElement("span");
                    tmpSpanFoldBtn.innerHTML = "&#10095;";
                    tmpSpanFoldBtn.className="thrUnitFoldBtn"
                    tmpSpanFoldBtn.addEventListener("click", thrUnitFoldClickFunction);
                    tmpDiv.append(tmpSpanFoldBtn);
                    let tmpSpan = document.createElement("span");
                    tmpSpan.innerHTML = thrUnitList[j].mainVal;
                    tmpSpan.className="thrUnitBtn";
                    tmpSpan.dataset.unitUniqNo= thrUnitList[j].unitUniqNo;
                    tmpSpan.addEventListener("click", thrUnitClickFunction);
                    tmpDiv.append(tmpSpan);
                    secUnitBtnList[i].append(tmpDiv);
                }
            }
        }
    }

    const conCntKeyUp = (event) => {
        let conCntSelTd = document.getElementsByClassName("conCntSelTd");
        for(let i=0; i<conCntSelTd.length; i++){
            if(conCntSelTd[i].innerHTML === event.target.value){
                conCntSelTd[i].classList.add("active");
            }else{
                conCntSelTd[i].classList.remove("active");
            }
        }
    }

    const subjectInfoList = subjectList.map( (subjectInfo) => {
        //중등인 경우 
        if(subjectInfo.mainVal.includes("중등")){
            if( subjectInfo.mainVal.includes("1-1")){
                return <span key={subjectInfo.unitUniqNo}>
                            <span className="mathDocsGrade">중등</span>
                            <span className="mathDocsUnitBtn" data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
                       </span>
            }
            if( subjectInfo.mainVal.includes("3-2")){
                return <span key={subjectInfo.unitUniqNo}>
                            <span className="mathDocsUnitBtn" data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
                            <br/>
                       </span>
            }
            return <span className="mathDocsUnitBtn" key={subjectInfo.unitUniqNo} data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
        }
    });

return (
    <>
    <Outlet />
        <div className='pageTitle mini-title5'>원하는 단원을 선택하여 학습지를 만들어보세요.</div>
        <div className='noSelect'>
        <div className="mathDocsSubjectInfoDiv">
            {subjectInfoList}
        </div>
        <div className="mathDocsSubjectListDiv">
        </div>
        <div className='mathDocsLevelDiv'>
            <div className='inBlock'>
                <table className='levelSelTb'>
                    <tbody>
                        <tr>
                            <td>난이도</td>
                                <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                <label htmlFor='level1'>
                                    <input type="radio" id="level1" name="level" value="1" className='hide' /> 하
                                </label>
                                </td>
                            <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                <label htmlFor='level3'>
                                    <input type="radio" id="level3" name="level" value="3" className='hide' /> 중
                                </label>
                            </td>
                            <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                <label htmlFor='level5'>
                                    <input type="radio" id="level5" name="level" value="5" className='hide' /> 상
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='inBlock'>
                <table className='levelSelTb'>
                    <tbody>
                        <tr>
                            <td>문항 수</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>5</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>10</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>15</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>20</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>25</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>30</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>50</td>
                            <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>100</td>
                            <td><input id="conCntInput" className='conCnt' type="text" onKeyUp={(event)=>{conCntKeyUp(event)}} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='inBlock orangeBtn nextStep' onClick={(event)=>{firstStepCheck()}}>다음단계</div>
        </div>
        </div>
        <Bar  data={data} width={300} height={200} options={options}/>
    </>
    )
}

export default MathDocsMaker;