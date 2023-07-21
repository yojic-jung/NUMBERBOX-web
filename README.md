# NUMBERBOX-web

![image](https://github.com/yojic-jung/NUMBERBOX-web/assets/45252387/9fb52c3b-5e61-473f-8096-2df605df0be9)  
  
## 프로젝트 소개 및 개발동기
N명의수학은 초중고 수학교육과정에 맞춤화된 수학컨텐츠 제작 및 공유 플랫폼입니다.  
수학문제 공유 서비스를 목적으로 웹에서 수식 입력 가능한 에디터 라이브러리를 찾아보았으나 기능의 한계가 있고 수식문법을 사용 해야하는 제약조건을 발견하였습니다. 시중 수학컨텐츠 업체들이 수식 입력 관련된 서비스를 제공하고 있지 않으며 이와 관련하여 사용자들의 불만이 있어 이를 해결하여 수학 컨텐츠 제작 툴에 초점을 맞춰 서비스를 개발했습니다.

## 개발환경
* 프레임워크 : 리액트  
* 웹서버 : nginx  
* 패키지 매니지먼트 : npm  
  
## 라이브러리
* react-geogebra
* react-helmet-async  
* react-router-dom
* react-sortablejs


## 화면구성

## 자체제작 기능 소개
* 수식에디터 : 웹환경에서 수식문법 없이 수식을 입력할 수 있는 편집기
    
   [수식에디터 기능 구현 및 버그 제어 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/contents/register/contents_reg.js#L1943)  


* hwp문서 변환 : 웹에서 제작한 컨텐츠와 *.hwp문서 파일 간의 양방향 파일 변환 기능  
[수식문법 변환 규칙 정의 및 구현 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/convertGrammer/nbToTexConvert_cvt.js)  


  
## 패지지 구조
```bash
.
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── rss.xml
│   └── sitemap.xml
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── css
    ├── font
    ├── img
    ├── index.css
    ├── index.js
    ├── js            // js 폴더
    │   ├── common                //공통 js함수 폴더
    │   │   ├── common_nb.js
    │   │   ├── makePdf.js
    │   │   └── useScript.js
    │   ├── contents              
    │   │   └── register
    │   │       └── contents_reg.js        // 수식에디터 기능 및 버그제어 js함수
    │   └── convertGrammer        
    │       └── nbToTexConvert_cvt.js      // web수식과 hwp수식 변환 js함수
    ├── logo.svg
    ├── reportWebVitals.js
    ├── setupTests.js
    └── web            //컴포넌트(각 컴포넌트에 실행되는 js포함)
        ├── admin                      //관리자 
        │   ├── AdminSvcCenter.js
        │   ├── MathTypeCategory.js
        │   └── MembersStatistic.js
        ├── common                    //공통 컴포넌트
        │   ├── BottomMenuBar.js
        │   ├── CustomBarChart.js
        │   ├── CustomPieChart.js
        │   ├── CustomPrivateRoute.js
        │   ├── CustomSelBoxDown.js
        │   ├── CustomSelBoxUp.js
        │   ├── CustomSelectBox.js
        │   ├── CustomTypeSelBox.js
        │   ├── CustomUnitSelBox.js
        │   ├── DetailedContentsWrap.js
        │   ├── EmptyList.js
        │   ├── ErrorReportForMathCon.js
        │   ├── FollowListBox.js
        │   ├── LicenseUi.js
        │   ├── LicenseUi2.js
        │   ├── MultiRangeSlider.js
        │   ├── MyContentsSearchFilter.js
        │   ├── MyPageList.js
        │   ├── PageNumBtn.js
        │   ├── ProfileComponent.js
        │   ├── ResourceMenuBar.js
        │   ├── RoundButtonList.js
        │   ├── ServiceCenter.js
        │   ├── StatisticTable.js
        │   ├── TabButton.js
        │   ├── TabTable.js
        │   ├── ToggleButton.js
        │   ├── TopMenuBar.js
        │   ├── TypeSelBox.js
        │   ├── UnitSelBox.js
        │   └── UnitTypeCombo.js
        ├── contents
        │   ├── list                      //문제검색 및 공유, 나의 제작문제, 저장소 문제, 프로필
        │   │   ├── ContentsList.js
        │   │   ├── IpsiWorkContentsList.js
        │   │   ├── MyAccountDrop.js
        │   │   ├── MyContentsList.js
        │   │   ├── MyMathDocs.js
        │   │   ├── MyPageWrap.js
        │   │   ├── MyProfile.js
        │   │   ├── MyRepository.js
        │   │   ├── MyResource.js
        │   │   ├── UserProfileWrap.js
        │   │   └── WorkContentsList.js
        │   ├── mathDocs                //학습지 제작 및 결과 템플릿
        │   │   ├── MathDocsMaker.js 
        │   │   └── MathDocsPaperA.js
        │   └── register                //수식에디터 컴포넌트
        │       ├── EditTableInnerUi.js
        │       ├── FormulaEditor.js
        │       ├── FormulaEditorMulti.js
        │       ├── FormulaEditorUnitForMulti.js
        │       ├── FormulaShortCutKey.js
        │       ├── NbWebEditor.js
        │       ├── RegisterContents.js
        │       ├── RegisterContentsForImg.js
        │       ├── RegisterContentsInfo.js
        │       └── RegisterContentsMulti.js
        ├── fileConvert
        │   └── HwpToHtml.js          //파일변환 컴포넌트
        ├── mathResource              //도형 및 이미지 제작 및 공유 컴포넌트
        │   ├── GraphMake.js
        │   ├── RegisterResource.js
        │   ├── RegisterResourceInp.js
        │   └── ShareResource.js
        └── page                     // 기타 컴포넌트
            ├── AccessDenied.js
            ├── AdminMenuBar.js
            ├── EmailPassFind.js
            ├── Login.js
            ├── Main.js
            ├── NaverLoginSuccess.js
            ├── NotFound.js
            ├── PrivacyPolicy.js
            ├── ServicePolicy.js
            └── SignUp.js


```
