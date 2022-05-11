import React, { useState, useEffect } from 'react';
import TopMenuBar from 'web/common/TopMenuBar';
import ResourceMenuBar from 'web/common/ResourceMenuBar';
import RoundButtonList from 'web/common/RoundButtonList';
import {nb_dataFetch} from 'js/common/common_nb.js';
import "css/resourceFile/shareResource.css";

const ShareResource = ()=>{

    const [mainCate, setMainCate] = useState(new Array());	// 사용자 입력 문제
    const [resourceList, setResourceList] = useState(new Array());	// 사용자 입력 문제

    useEffect(() => {
        const asyncUseEffect = async function(){
            let returnVal = await nb_dataFetch('/mathInfo/takeResourceMenu', true);
            let resourceMenu = returnVal["resourceMenuList"];
            
            let uniqueArr = [];
            resourceMenu.filter((element, index) => {
                if(index!==0){
                    if(resourceMenu[index-1]["mainCateName"] !== element["mainCateName"]){
                        uniqueArr.push(element);
                    }
                }else{
                    uniqueArr.push(element);
                }
            });
            setMainCate(uniqueArr);

            document.getElementById("shareResource").classList.add("active")

            await takeResource();
        }
        asyncUseEffect();
    }, []);


    const takeResource = async (event) =>{
        

        let param ;
        if(event === undefined){
            param = "1";
        }else{
            param = event.target.dataset.uniqId;
        }
        let cateMenu = document.querySelectorAll(".cateMenu");
        for(let i=0; i<cateMenu.length; i++){
            cateMenu[i].classList.remove("active")
        }
        document.getElementById("category-"+param).classList.add("active")

        let returnVal = await nb_dataFetch('/mathInfo/takeResource?mainCateNo='+param, true);
        console.log(returnVal);
        const initResoureList = returnVal["resourceList"].map( (contentsMap, idx) => {
            let hasPpt = false;
            contentsMap = contentsMap["mathResource"]
            if(contentsMap.pptName !== null){
                hasPpt = true;
            }
            if(hasPpt){
                return (<div id={"res-div-"+contentsMap.seqNo} className="res-div" data-uniq-id={contentsMap.seqNo} data-has-ppt={hasPpt}>
                            <div className='res-over-lay'>
                                <span className='down-btn'></span>
                                <span className='down-ppt-btn'></span>
                            </div>
                            <div className="img-title">{contentsMap.title}</div>
                            <img id={"res-img-"+contentsMap.seqNo} className="res-img" src={contentsMap.imgPath+"/"+contentsMap.imgName} alt="컨텐츠 이미지"/>
                        </div>);
            }else{
                return (<div id={"res-div-"+contentsMap.seqNo} className="res-div" data-uniq-id={contentsMap.seqNo} data-has-ppt={hasPpt}>
                            <div className='res-over-lay'>
                                <span className='down-btn'></span>
                            </div>
                            <div className="img-title">{contentsMap.title}</div>
                            <img id={"res-img-"+contentsMap.seqNo} className="res-img" src={contentsMap.imgPath+"/"+contentsMap.imgName} alt="컨텐츠 이미지"/>
                        </div>);
            }
            
        });
        setResourceList(initResoureList);
    }
    
return (
    <>    
     <TopMenuBar />
     <ResourceMenuBar></ResourceMenuBar>
     <div className='cateDiv'>
        <RoundButtonList id="category" className="cateMenu" tabList={mainCate} dataId="mainCateNo" mainKey="mainCateName" clickEv={(event)=>{takeResource(event)}} ></RoundButtonList>
     </div>
     <div className='resWrap'>
        {resourceList}
     </div>
    </>
    )
}

export default ShareResource;