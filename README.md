# NUMBERBOX-web
<div align="center">
<img src="https://github.com/yojic-jung/NUMBERBOX-web/assets/45252387/9b32deda-0e8f-43ed-8f9a-10977abca07e" width="300">
</div>

## 프로젝트 소개
N명의수학은 초중고 수학교육과정에 맞춤화된 수학컨텐츠 제작 및 공유 플랫폼입니다.  
초창기 프로젝트의 방향은 수학문제 공유 서비스였습니다. 사용자에게 제공할 수학문제 제작을 위해 기존의 수식에디터 라이브러리들은 사용해보았으나 수식문법을 사용한다거나 수식과 텍스트가 분리되는 등 제약조건이 있었습니다. 이로인해 제약조건을 해결할 프로토타입을 1달간 제작하여 대학후배들과 테스트 해본 결과 생산성이 향상되고 기존방식의 방식에서 제공하지 못하는 기능들을 제공할 수 있기에 프로젝트의 비중을 문제 제작 및 관리 서비스에 더욱 높여 현재는 수학문제 제작 툴, 학습지 자동제작, 한글문서 변환, 문제 공유 등의 기능을 제공하고 있습니다.

## 개발환경
* 프레임워크 : 리액트
* 패키지 매니지먼트 : npm  
* 웹서버 : nginx  
  
## 라이브러리
* react-geogebra
* react-helmet-async  
* react-router-dom  
* react-sortablejs  
  
## 구현로직
* [수식에디터 기능 구현 및 버그 제어 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/contents/register/contents_reg.js#L1943)  


* hwp문서 변환 : 웹에서 제작한 컨텐츠와 *.hwp문서 파일 간의 양방향 파일 변환 기능  
[수식문법 변환 규칙 정의 및 구현 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/convertGrammer/nbToTexConvert_cvt.js)  



## 기능소개

문제만들기
![image](https://github.com/yojic-jung/NUMBERBOX-web/assets/45252387/0ad7bd8c-eb17-4d63-af4a-ae479d703a20)
<img width="615" alt="image" src="https://github.com/yojic-jung/NUMBERBOX-web/assets/45252387/1bb544cb-03eb-48ee-b4f4-fce790a658ce">


  
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
