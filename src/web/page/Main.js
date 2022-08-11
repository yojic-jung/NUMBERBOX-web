import React, {useEffect} from 'react';
import {nb_getParameterByName, nb_fadeInOutA} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/common/common.css";
import nPeople from 'img/nPeople.png';
import main1 from 'img/mainDocsMake1.PNG';
import main2 from 'img/mainContentsMake.PNG';
import main3 from 'img/mainResourceShare.PNG';
import mainSubConMake from 'img/mainSubConMake.PNG';
import mainSubConMake2 from 'img/mainSubConMake2.PNG';
import mainSubDocsMake from 'img/mainSubDocsMake.PNG';
import mainResourceMake from 'img/mainResourceMake.PNG';

const Main = ()=>{

    useEffect(function(){
        let param = nb_getParameterByName("succeedSignUp");
        if(param !== ""){
            nb_fadeInOutA("감사합니다. 회원가입이 정상적으로 완료 되었습니다.", 2000);
            window.history.pushState("", "N명의 수학", '/');
        }
    })

    

return (
    <>
        <div className='mainDiv'>
            <div className='mainImgBox first'><img className='mainImgUI' src={main1} alt=""/></div>
            <div className='mainImgBox second'><img className='mainImgUI' src={main2} alt=""/></div>
            <div className='mainImgBox third'><img className='mainImgUI' src={main3} alt=""/></div>
            <div className='mainImgDiv'>
                <img className='mainImgUI people' src={nPeople} alt=""/>
            </div>
            <div className='mainImgDesc first'>편리한 문제제작 툴</div>
            <div className='mainImgDesc second'>문제 공유와 손쉬운 학습지 제작</div>
            <div className='mainTitle'>N명의 사용자와 만들어가는,<br/>수학문제 공유 플랫폼</div>
        </div>
        <div className='mainSubRootDiv1'>
            <div className='mainSubDiv1'>
                <div>
                    <div className='mainSubBox2 first'><img className='mainImgUI' src={main1} alt=""/></div>
                    <div className='mainSubTitle'>손쉬운 학습지 제작</div>
                    <div className='mainSubDesc'>
                        학년, 단원, 유형을 선택하여 난이도 및 문항 수에 맞게 사용자가 원하는<br/>
                        형식과 문제로 학습지를 만들어 사용할 수 있습니다.
                    </div>
                </div>
                <div className='mainSubBox first'><img className='mainImgUI' src={mainSubDocsMake} alt=""/></div>
            </div>
        </div>
        <div className='mainSubRootDiv2'>
            <div className='mainSubDiv2Title'>나의 제작 문제 및 변형 문제 만들기</div>
            <div className='mainSubDiv2'>
                <div className='mainSubBox first'><img className='mainImgUI' src={mainSubConMake} alt=""/></div>
                <div className='mainSubBox second'><img className='mainImgUI' src={mainSubConMake2} alt=""/></div>
            </div>
            <div className='mainSubDiv2Desc'>
                <div className='mainSubDescTitle first'>수학 문제 제작시 번거로운 수식기호 입력을 쉽고 빠르게</div>
                <div className='mainSubDescContents'>
                    일반적인 문서편집기에서 수학문제를 만드는 경우,<br/>
                    수식 기호를 입력하기 위해 여러 메뉴를 거쳐야하고 수많은 기호 중 원하는 기호를 찾는데 오랜 시간이 걸리는 불편함이 있어<br/>
                    N명의 수학에서는 교육과정 및 교과서, 참고서에 나오는 기호들로만 구성하고, 사용 빈도수가 높은 기호를 단축키화하여 <br/>
                    수식 입력시 불필요한 소요시간을 줄여 불편함을 줄이고 사용자들이 문제의 퀄리티를 높이는데 집중할 수 있도록 하였습니다.</div>
                <div className='mainSubDescTitle second'>편집본까지 함께 제공되어 원본 문제를 수정하여 새로운 문제를 만들 수 있습니다.</div>
                <div className='mainSubDescContents'>
                    N명의 수학에서 제공하는 모든 문제는 완성된 원본 뿐만 아니라<br/>
                    해설이 포함된 편집본까지 함께 제공되어 사용자가 수정하여 새로운 변형문제로 만들어 낼 수 있습니다.<br/>
                </div>
            </div>
        </div>
        <div className='mainSubDiv3'>
            <div>
                <div className='mainSubTitle'>도형 및 그래프 공유(그래프 제작 툴)</div>
                <div className='mainSubDesc'>
                수학문제 제작시 많은 시간이 소요되는 이미지나 그래프 등을 사용자들과 공유하여 사용할 수 있습니다.<br/>
                또한, 그래프 제작 툴을 제공하여 사용자들이 쉽게 그래프를 만들 수 있습니다.
                </div>
            </div>
            <div className='relative alignRight'>
                <div className='mainSubBox first'><img className='mainImgUI' src={main3} alt=""/></div>
                <div className='mainSubBox second'><img className='mainImgUI' src={mainResourceMake} alt=""/></div>
            </div>
        </div>
        
        
    </>
    )
}

export default Main;