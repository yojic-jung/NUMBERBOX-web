import React, {useState, useEffect } from 'react';
import EmptyList from 'web/common/EmptyList';
import RegisterResourceInp from 'web/mathResource/RegisterResourceInp';
import {Link} from "react-router-dom";
import {nb_dataFetch, nb_formDataFetch, nb_fadeInOut, nb_fadeInOutA, nb_dataFileFetch, nb_promptBox} from 'js/common/common_nb.js';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import "css/resourceFile/shareResource.css";
import hourglass from 'img/hourglass.gif';

const MyResource = ()=>{

    const [resourceList, setResourceList] = useState(new Array());
    const [resourceMenu, setResourceMenu] = useState(new Array());
    const [delResourceNo, setDelResourceNo] = useState(0);
    const [emptyListMsg, setEmptyListMsg] = useState("나의 컨텐츠가 존재하지 않습니다.");

    useEffect(()=>{
        const asyncUseEffect = async function(){
            document.getElementById("myPageProd").classList.remove("active");
            document.getElementById("myPageRepo").classList.remove("active");
            document.getElementById("myMathDocs").classList.remove("active");
            document.getElementById("myResource").classList.add("active");
            let returnObj= await nb_dataFetch("/mathInfo/takeMyResource", true);
            let myResourceList = returnObj.myResourceList;
            let resourceMenuList = returnObj.resourceMenuList;
            setResourceList(myResourceList);
            setResourceMenu(resourceMenuList);
        }
        asyncUseEffect();
        }, []);

    const showDetailedRes = async (event, title, pptFileName, resourceNo, resourceCate) =>{
        if(event.target.classList.contains("reviseBtn") || event.target.classList.contains("delBtn")) return;
        document.getElementById("resDetailedTitle").innerHTML=title;
        document.getElementById("resDetailedCate").innerHTML = "";
        for(let i=0; i<resourceCate.length; i++){
            for(let j=0; j<resourceMenu.length; j++){
                if(resourceMenu[j].mainCateNo === resourceCate[i].mainCateNo && resourceMenu[j].midCateNo === resourceCate[i].midCateNo){
                    let cateMenu = resourceMenu[j].mainCateName+"-"+resourceMenu[j].midCateName
                    let resourceCateDesc = document.createElement("span");
                    resourceCateDesc.innerHTML = cateMenu;
                    resourceCateDesc.className = "resourceCateDesc";
                    document.getElementById("resDetailedCate").append(resourceCateDesc);
                }
            }
        }
        
        document.getElementById("resDetailedPPtDownBtn").dataset.pptName = pptFileName;
        let returnObj = await nb_dataFetch('/mathInfo/takePPtSlideImge?resourceNo='+resourceNo, true);
        document.getElementById("resDetailedWrap").classList.remove("hide");
        
        document.getElementById("customImgSliderBtnDiv").innerHTML = "";
        document.getElementById("customImgSliderContainerDiv").innerHTML = "";
        let slideBox = document.querySelector('.customImgSliderContainerDiv');
        for(let i=0; i<returnObj.imgList.length;i++){
            let sliderDiv = document.createElement('div');
            sliderDiv.className = "customSliderBox";
            let sliderImg = document.createElement('img');
            sliderImg.src = returnObj.imgList[i].imgPath+"/"+returnObj.imgList[i].imgName;
            sliderDiv.append(sliderImg);
            sliderImg.classList.add("customSliderImg");
            if(i!==0) sliderImg.classList.add("hide");

            document.getElementById("customImgSliderContainerDiv").append(sliderDiv);
            let btn = document.createElement('button');
            if(i===0) btn.className = "customSliderBtn active";
            else  btn.className = "customSliderBtn";;
            btn.innerHTML = i+1;
            let moveX = -i*580;
            btn.addEventListener('click', function(event){ 
                slideBox.style.transform = 'translateX('+moveX+'px)'; 
                let activeBtn = document.getElementsByClassName("customSliderBtn active");
                for(let i=0; i<activeBtn.length; i++){
                    activeBtn[i].classList.remove("active");
                }
                event.target.classList.add("active");
                let customSliderImg = document.getElementsByClassName("customSliderImg");
                for(let i=0; i<customSliderImg.length; i++){
                    customSliderImg[i].classList.remove("hide");
                }
            })
            document.getElementById("customImgSliderBtnDiv").append(btn);
            document.getElementById("customImgSliderContainerDiv").style.width = (i+1)*580+"px";
        }
            
        }
    const downPptFile = async (filePath, fileName) => {
        let name = fileName.split(".")[0].split("_")[2];
        nb_dataFileFetch('/common/download?filePath='+filePath+"&fileName="+encodeURI(fileName), name);
    }

    const myResourceDel = async function(){
        let inputVal = document.getElementById("promptInput").value;
        if(inputVal !== "삭제"){
            document.getElementById("promptInput").classList.add("shake")
            setTimeout(function(){
                document.getElementById("promptInput").classList.remove("shake")
            }, 500);
            return;
        }
        document.getElementById("promptBoxClose").click();
        let returnObj = await nb_dataFetch("/mathInfo/myResourceDel?resourceNo="+Number(delResourceNo), true);
        if(!returnObj.existMsg){
            let newMyResourceList = resourceList.filter((resourceMap, idx)=>{
                if(resourceMap.resourceNo === Number(delResourceNo)) return false;
                else return true;
            });
            setResourceList(newMyResourceList);
            nb_fadeInOut("정상적으로 삭제되었습니다.", 2000);
        }
    }

    const updateResourceObj = async (newResource) => {
        let oldResourceIdx;
        let newResourceList = resourceList;
        resourceList.map((resourceMap, idx) => {
            if(resourceMap.resourceNo === newResource.resourceNo){
                oldResourceIdx=idx;
            }
        });
        newResourceList[oldResourceIdx] = newResource;
        setResourceList([])
        setResourceList(newResourceList);
    }

    const updtValSet = async (resourceNo, title, imgPath, imgName, pptName, mathResourceCate) => {
        let redBoxValid= document.getElementsByClassName("redBoxValid");
        for(let i=redBoxValid.length-1; i>=0; i--){
            redBoxValid[i].classList.remove("redBoxValid");
        }
        document.getElementById("titleValDesc").innerHTML="";
        document.getElementById("updateResResourceNo").value=Number(resourceNo);
        document.getElementById("title").value=title;
        document.getElementById("representImg").src=imgPath+"/"+imgName;
        document.getElementById("pptFileCustomDesc").innerHTML=pptName.split("_")[2];
        document.getElementById("userCateDiv").innerHTML = "";
        document.getElementById("pptFile").value = "";
        document.getElementById("imgFile").value = "";
        document.getElementById("mainCate").value = 0;
        document.getElementById("midCate").value = 0;
        
        for(let i=0; i<mathResourceCate.length; i++){
            let userCateWrap = document.createElement("div");
            userCateWrap.className = "userCateWrap";
            let userCate = document.createElement("span");
            userCate.className = "userCateBtn";
            userCate.dataset.cateNo=mathResourceCate[i].mainCateNo+"-"+mathResourceCate[i].midCateNo;
            let userCateDel = document.createElement("span");
            userCateDel.className = "cate-del";
            userCateDel.innerText = "x";
            userCateDel.addEventListener("click", function(event){
                event.target.closest(".userCateWrap").remove();
            });


            for(let j=0; j<resourceMenu.length; j++){
                if(resourceMenu[j].mainCateNo === mathResourceCate[i].mainCateNo && resourceMenu[j].midCateNo === mathResourceCate[i].midCateNo){
                    userCate.innerHTML = resourceMenu[j].mainCateName+"-"+resourceMenu[j].midCateName;
                }
            }

            userCate.append(userCateDel);
            userCateWrap.append(userCate);
            document.getElementById("userCateDiv").append(userCateWrap);
        }

        document.getElementById("updateResouce").classList.remove("hide");
    }

    

    const initResoureList = resourceList.map( (contentsMap, idx) => {
        return (<div id={"res-div-"+contentsMap.resourceNo} className="res-div" data-uniq-id={contentsMap.seqNo} key={idx}>
                    <div className='res-over-lay' onClick={(event)=>{showDetailedRes(event, contentsMap.title, contentsMap.pptName, contentsMap.resourceNo, contentsMap.mathResourceCate)}}>
                        <span className='pptPageCnt'>{contentsMap.pptPageCnt}</span>
                        <span className='reviseBtn' onClick={()=>{updtValSet(contentsMap.resourceNo, contentsMap.title, contentsMap.imgPath, contentsMap.imgName, contentsMap.pptName, contentsMap.mathResourceCate);}}></span>
                        <span className='delBtn' onClick={()=>{nb_promptBox("삭제를 진행하시려면 '삭제' 라고 입력해주세요. \n(따옴표 없이 입력해주시기 바랍니다.)", "삭제 라고 입력해주세요.");setDelResourceNo(contentsMap.resourceNo)}} ></span>
                    </div>
                    <div className="img-title">{contentsMap.title}</div>
                    <img id={"res-img-"+contentsMap.resourceNo} className="res-img" src={contentsMap.imgPath+"/"+contentsMap.imgName} alt="컨텐츠 이미지"/>
                </div>);
    });

  return (
    <div>
        <div className="bi-jutify-align2">
            <div></div>
            <div>
                <Link className='linkNoneCss' to="/registerResource">
                    <div className="updateBtn2">컨텐츠 등록</div>
                </Link>
            </div>
        </div>
        <div className='borderBottom'></div>
        <div className='resWrap contentsDiv'>
            {initResoureList.length !==0 ? 
                    initResoureList
                : <EmptyList msg={emptyListMsg} imgName="myResourceEmpty" addImgClass="miniSize" /> 
            }
        </div>
        <div id="resDetailedWrap" className='blindBox hide'>
            <div className="resDetailedDiv">
                <div className='closeBtn2' onClick={()=>{document.getElementById("resDetailedWrap").classList.add("hide"); document.getElementsByClassName("customSliderBtn")[0].click();}}>X</div>
                <div id="resDetailedTitle" className='resDetailedTitle'></div>
                <div id="resDetailedCate" className='resDetailedCate'></div>
                <div className='resDetailedDesc'>※미리보기 슬라이드는 실제 파일과 다소 차이가 날 수 있으며 낮은 화질로 보여집니다</div>
                <div className='overflowHidden'>
                    <div id="customImgSliderContainerDiv" className="customImgSliderContainerDiv"></div>
                </div>
                <div className="relative">
                    <div id="customImgSliderBtnDiv" className="customImgSliderBtnDiv">
                </div>
                </div>
                <div className='resDowwBtnWrap'>
                    <div id="resDetailedPPtDownBtn" className='resDetailedPPtDownBtn' onClick={(event)=>{downPptFile("resourcePpt", event.target.dataset.pptName)}}>ppt파일 다운</div>
                </div>
            </div>
            </div>
        <div id="promptBoxScreen" className='promptBoxScreen hide'>
                <div id="promptBox" className='promptBox'>
                    <div className='promptBoxTop'><span id="promptBoxClose" className="promptBoxClose" onClick={()=>{document.getElementById("promptBoxScreen").classList.add('hide'); document.getElementById("promptInput").value="";}}>X</span></div>
                    <div id="promptMsg" className="promptMsg"></div>
                    <div className='promptInputDiv'>
                        <input id="promptInput" className='promptInput' type="text" onKeyDown={(event)=>{if(event.keyCode===13){myResourceDel()} }}/>
                    </div>
                    <div className='alignCenter'>
                        <span id="promptBoxBtn" className='promptBoxBtn' onClick={()=>{myResourceDel()}}>확인</span>
                    </div>
                </div>
            </div>
            <div id="updateResouce" className='blindBox alignLeft hide'>
                <div className='updateResouceDiv'>
                <form method="post" id="resourceForm" encType="multipart/form-data">
                    <RegisterResourceInp isUpdtMode={true} parentMethod={updateResourceObj}/>
                    <input id="updateResResourceNo" type="number" name="resourceNo" className='hide'/>
                </form>
                </div>
            </div>

            <div className='paddingFiveZero'></div>

    </div>

  );
}

export default MyResource;