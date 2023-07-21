# N명의수학(프론트엔드 프로젝트)

이 프로젝트는 N명의수학 서비스의 UI와 수식에디터, 학습지 제작 기능 등을 구현한 프로젝트입니다.

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

### 주요기능
  
* 수식에디터 : 웹환경에서 수식문법 없이 수식을 입력할 수 있는 편집기로 수식과 텍스트가 분리되지 않고 팝업창 없이 수식을 입력할 수 있도록 구현한 에디터입니다.
   [수식에디터 기능 구현 및 버그 제어 함수 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/contents/register/contents_reg.js#L1943)  
   [UI 컴포넌트 - 소스보기](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/web/contents/register/FormulaEditor.js)  


* hwp문서 변환 : 웹에서 제작한 컨텐츠와 *.hwp문서 파일 간의 양방향 파일 변환 기능  
[수식문법 변환 규칙 정의 및 구현 함수](https://github.com/yojic-jung/NUMBERBOX-web/blob/master/src/js/convertGrammer/nbToTexConvert_cvt.js)  



### 개발환경


### 라이브러리


### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
