# N명의수학(프론트엔드 프로젝트)
이 프로젝트는 N명의수학 서비스의 프론트엔드 UI와 기능구현 프로젝트입니다.
  
## 개발환경
프레임워크 : 리액트  
웹서버 : nginx  
패키지 매니지먼트 : npm  
  
## 라이브러리
* react-geogebra
* react-helmet-async  
* react-router-dom  
* react-scripts  
* react-sortablejs  
* react-transition-group  
* sortablejs  
  
## 프로젝트 구조
```bash
├── public
└── src
    ├── css
    ├── font
    ├── img
    ├── js
    │   ├── common                     // 공통함수
    │   ├── contents
    │   │   └── register
    │   │       └── contents_reg.js		    // 수식에디터 기능 구현 및 버그 제어 함수 파일
    │   └── convertGrammer
    │       └── nbToTexConvert_cvt.js	    // 수식에디터와 tex수식문법 변환 구현 및 규칙 정의 함수 파일
    └── web				            // UI 컴포넌트 패키지
        ├── admin
        ├── common				    // 공통 UI 컴포넌트
        ├── contents
        │   ├── list
        │   ├── mathDocs			// 학습지 제작 UI 컴포넌트
        │   └── register			// 수식에디터 컴포넌트
        ├── fileConvert
        ├── mathResource
        └── page
```

## 주요기능
  
* 수식에디터 : 웹환경에서 수식문법 없이 수식을 입력할 수 있는 편집기로 수식과 텍스트가 분리되지 않고 팝업창 없이 수식을 입력할 수 있도록 구현한 에디터입니다.  
   [수식에디터 기능 구현 및 버그 제어 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/contents/register/contents_reg.js#L1943)  
   [UI 컴포넌트 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/web/contents/register/FormulaEditor.js)  


* hwp문서 변환 : 웹에서 제작한 컨텐츠와 *.hwp문서 파일 간의 양방향 파일 변환 기능  
[수식문법 변환 규칙 정의 및 구현 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/convertGrammer/nbToTexConvert_cvt.js)  

* 학습지 제작 :

* 문제공유 :

* 도형 제작 :

* 이미지 공유 :

* 고객센터 :
  
* 로그인 :

