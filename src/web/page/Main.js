import React, {useEffect} from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
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

        const Confettiful = function(el) {
            this.el = el;
            this.containerEl = null;
            
            this.confettiFrequency = 3;
            this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
            this.confettiAnimations = ['slow', 'medium', 'fast'];
            
            this._setupElements();
            this._renderConfetti();
          };
          
          Confettiful.prototype._setupElements = function() {
            const containerEl = document.createElement('div');
            const elPosition = this.el.style.position;
            
            if (elPosition !== 'relative' || elPosition !== 'absolute') {
              this.el.style.position = 'relative';
            }
            
            containerEl.classList.add('confetti-container');
            
            this.el.appendChild(containerEl);
            
            this.containerEl = containerEl;
          };
          
          Confettiful.prototype._renderConfetti = function() {
            this.confettiInterval = setInterval(() => {
              const confettiEl = document.createElement('div');
              const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
              const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
              const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
              const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
              
              confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
              confettiEl.style.left = confettiLeft;
              confettiEl.style.width = confettiSize;
              confettiEl.style.height = confettiSize;
              confettiEl.style.backgroundColor = confettiBackground;
              
              confettiEl.removeTimeout = setTimeout(function() {
                confettiEl.parentNode.removeChild(confettiEl);
              }, 3000);
              
              this.containerEl.appendChild(confettiEl);
            }, 25);
          };
          window.confettiful = new Confettiful(document.querySelector('.js-container'));
    })

return (
    <>
    <BrowserView>
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
        
        <div className='relative'>
            <div className="js-container container"></div>
            <div className='js-container-inner'>
                <div className='mainSubTitle1'>N명의 공유플랫폼, &nbsp;&nbsp;&nbsp;<span className='mainSubTitileName'>"N명<span className='mainSubTitileName2'>의</span>수학"</span></div>
                <div className='mainSubDesc2'>
                지금 N명의 수학을 누려보세요!
                </div>
            </div>  
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
                <div>
                    <div className='mainSubDescTitle first'>쉽고 빠른 수식입력 문제 제작 툴!</div>
                    <div className='mainSubDescContents'>
                        교육과정 및 교과서, 참고서에 나오는 기호들로만 구성하여 원하는 수식 기호를 빠르게 찾을 수 있고, <br/>
                        수식 기호를 단축키화하여 빠르게 입력할 수 있도록하여 문제 제작시 불필요한 소요시간을 줄일 수 있습니다.
                    </div>
                </div>
                <div>
                    <div className='mainSubDescTitle second'>편집본 제공으로 변형문제 제작 가능</div>
                    <div className='mainSubDescContents'>
                        N명의 수학에서 제공하는 모든 문제는 완성된 원본 뿐만 아니라<br/>
                        해설이 포함된 편집본까지 함께 제공되어 사용자가 수정하여 새로운 변형문제로 만들어 낼 수 있습니다.<br/>
                    </div>
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
        </BrowserView>
        <MobileView>
            <div className='relative'>
            <div className="js-container container mobile"></div>
            <div className='js-container-inner mobile'>
                <div className='mainSubTitle1'>
                    N명의 공유플랫폼,<br/>
                    <span className='mainSubTitileName'>"N명<span className='mainSubTitileName2'>의</span>수학"</span>
                </div>
                <div className='mainSubDesc2 mobile'>
                <span className='fontEmphasis'>[PC버전]</span>에서 서비스 제공중입니다.<br/>
                <span className='fontEmphasis'>수학문제 만들기</span>, <span className='fontEmphasis'>문제 공유 서비스</span>,<br/>
                <span className='fontEmphasis'>학습지 제작</span>, <span className='fontEmphasis'>그래프 만들기</span>, <br/>
                <span className='fontEmphasis'>도형 파일 공유</span> 등의 서비스를 누려보세요!
                </div>
            </div>  
        </div>
        </MobileView>
    </>
    )
}

export default Main;