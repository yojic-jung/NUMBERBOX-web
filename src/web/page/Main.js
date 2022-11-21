import React, {useEffect} from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import {nb_getParameterByName, nb_fadeInOutA} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/common/common.css";
import nPeople from 'img/nPeople.png';
import main1 from 'img/mainDocsMake1.PNG';
import main2 from 'img/mainContentsMake.PNG';
import main3 from 'img/mainResourceShare.PNG';
import mainSubConMake from 'img/mainSubConMake.PNG';
import mainSubConMake2 from 'img/mainSubConMake2.PNG';
import hwpConverImg1 from 'img/hwpConverImg1.png';
import hwpConverImg2 from 'img/hwpConverImg2.PNG';
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
            
            this.confettiFrequency = 1;
            this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
            this.confettiAnimations = ['slow', 'medium', 'slow'];
            
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
    <Helmet>
        <title>N명의수학</title>
        <meta name="description" content="N명의 사용자와 함께 만들어가는 수학 플랫폼"/>
        <link rel="canonical" href="https://nsoohak.com/" />
        <meta property="og:title" content="N명의수학" />
        <meta property="og:description" content="N명의 사용자와 함께 만들어가는 수학플랫폼" />
    </Helmet>
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
                        교육과정 및 교과서, 참고서에 나오는 기호들을 <br/>
                        모두 단축키화하여 빠르고 편리하게 수학문제를 <br/>
                        제작할 수 있습니다.
                    </div>
                </div>
                <div>
                    <div className='mainSubDescTitle second'>편집본 제공으로 변형문제 제작 가능</div>
                    <div className='mainSubDescContents'>
                            원본 뿐만 아니라 편집본까지 함께 제공하여<br/>
                            사용자가 새로운 변형 문제로 만들 수 있습니다.<br/>
                    </div>
                </div>
            </div>
        </div>

        <div className='mainSubRootDiv3'>
            <div className='mainSubDiv2Title'>한글파일(hwp)로 나의 제작 문제 다운받기</div>
            <div className='mainSubDesc1'>
                사용자가 제작한 문제를 한글파일(hwp)로 변환하여 다운 받을 수 있습니다.
            </div>
            <div className='mainSubBox first hwp'>
                <img className='mainImgUI hwp1' src={hwpConverImg1} alt=""/>
                <img className='mainImgUI hwp2' src={hwpConverImg2} alt=""/>
            </div>
        </div>
        <div className='mainSubRootDiv4'>
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
        </div>
        </BrowserView>
        <MobileView>
            <div className='relative'>
                <div className="js-container container mobile"></div>
                <div className='js-container-inner mobile'>
                    <div className='mainSubTitle1 mobile'>
                        N명의 사용자와 함께 만드는<br/>
                        수학 컨텐츠 플랫폼
                    </div>
                    <div className="mainSubTitle1 mobile">
                        <span className='mainSubTitileName'>"N명<span className='mainSubTitileName2'>의</span>수학"</span>
                    </div>
                    <div className='mainSubDesc2 mobile'>
                    </div>
                </div>  
            </div>
            <div className='pcDescDiv'>
                [PC버전]에서 서비스 제공중입니다.
            </div>
            <div className='mainSubRootDiv1 mobile'>
                <div className='mainSubDiv1 mobile'>
                    <div>
                        <div className='mainSubTitle mobile'>손쉬운 학습지 제작</div>
                        <div className='mainSubDesc mobile'>
                            학년, 단원, 유형을 선택하여 난이도 및 문항 수에 맞게 사용자가 원하는
                            형식과 문제로 학습지를 만들어 사용할 수 있습니다.
                        </div>
                        <div className='mainSubBox2 first'><img className='mainImgUI' src={main1} alt=""/></div>
                    </div>
                    <div className='mainSubBox first mobile'><img className='mainImgUI' src={mainSubDocsMake} alt=""/></div>
                </div>
            </div>
            <div className='mainSubRootDiv2 mobile'>
                <div className='mainSubDiv2Title mobile'>수학문제 제작 툴과 문제공유 서비스</div>
                <div className='mainSubDiv2 mobile'>
                    <div className='mainSubBox first'><img className='mainImgUI' src={mainSubConMake} alt=""/></div>
                    <div className='mainSubBox second'><img className='mainImgUI' src={mainSubConMake2} alt=""/></div>
                </div>
                <div className='mainSubDiv2Desc mobile'>
                    <div>
                        <div className='mainSubDescTitle first mobile'>쉽고 빠른 수식입력 문제 제작 툴!</div>
                        <div className='mainSubDescContents mobile'>
                            교육과정 및 교과서, 참고서에 나오는 기호들을 <br/>
                            모두 단축키화하여 빠르고 편리하게 수학문제를 <br/>
                            제작할 수 있습니다.
                        </div>
                    </div>
                    <div>
                        <div className='mainSubDescTitle second mobile'>편집본 제공으로 변형문제 제작 가능</div>
                        <div className='mainSubDescContents mobile'>
                             원본 뿐만 아니라 편집본까지 함께 제공하여<br/>
                             사용자가 새로운 변형 문제로 만들 수 있습니다.<br/>
                        </div>
                    </div>
                    <div>
                        <div className='mainSubDescTitle third mobile'>한글파일(hwp)로 다운</div>
                        <div className='mainSubDescContents mobile'>
                                내가 제작한 수학문제들을 한글파일(hwP)로<br/>
                                변환하여 다운 받을 수 있습니다.<br/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mainSubDiv3 mobile'>
                <div>
                    <div className='mainSubTitle mobile'>도형 및 그래프 공유(그래프 제작 툴)</div>
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

            <div className='mobileTitle'>기능소개</div>
            
            <div className='mainSubRootRadiusWrap'>
                <div className='mainSubRootRadiusInnerWrap'>
                <div className='mainSubRootRadiusDiv first'>
                    <div className='mainSubRootRadiusTitle'>수식 편집기</div>
                    <div>편리한 제작툴로 문제를 빠르게 만들 수 있고 한글파일(hwp)로 다운 받을 수 있어요!</div>
                </div>

                <div className='mainSubRootRadiusDiv second'>
                    <div className='mainSubRootRadiusTitle'>학습지 제작</div>
                    <div>N명의 수학에서 제공하는 문제들로 학습지를 만들어 사용할 수 있어요!</div>
                </div>

                <div className='mainSubRootRadiusDiv third'>
                    <div className='mainSubRootRadiusTitle'>문제 공유</div>
                    <div>사용자들과 수학 문제를 공유할 수 있어요!</div>
                </div>

                <div className='mainSubRootRadiusDiv fourth'>
                    <div className='mainSubRootRadiusTitle'>그래프 제작 툴</div>
                    <div>함수만 입력하면 자동으로 그래프를 그려줘요!</div>
                </div>

                <div className='mainSubRootRadiusDiv fifth'>
                    <div className='mainSubRootRadiusTitle'>이미지 공유</div>
                    <div>수학문제에 사용되는 도형 및 이미지를 공유할 수 있어요!</div>
                </div>


                <div className='mainSubRootRadiusDiv hide'>
                    <div>저작물 판매</div>
                    <div>자신의 수학 문제 저작물을 판매 홍보할 수 있어요!</div>
                </div>
                </div>
            </div>

        </MobileView>
    </>
    )
}

export default Main;