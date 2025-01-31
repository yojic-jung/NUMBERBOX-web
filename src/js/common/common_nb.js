import imageCompression from 'browser-image-compression';
import { ACCESS_TOKEN_KEY, ROLE_KEY, ROLE_ADMIN, ROLE_MANAGER, ROLE_TOP_TESTER } from 'constant/com_const.js';

export const nb_isLogin = () => {
  let isLogin = window.localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
  return isLogin;
};

//매니저 권한 임시 구현
export const nb_isManger = () => {
  let isLogin = window.localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
  let isManger = false;
  if (isLogin) {
    isManger =
      window.localStorage.getItem(ROLE_KEY) === ROLE_MANAGER || window.localStorage.getItem(ROLE_KEY) === ROLE_TOP_TESTER || window.localStorage.getItem(ROLE_KEY) === ROLE_ADMIN;
  }
  return isManger;
};

export const nb_isAdmin = () => {
  let isLogin = window.localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
  let isAdmin = false;
  if (isLogin) {
    isAdmin = window.localStorage.getItem(ROLE_KEY) === ROLE_ADMIN;
  }
  return isAdmin;
};

export const nb_isTopTester = () => {
  let isLogin = window.localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
  let isTopTester = false;
  if (isLogin) {
    isTopTester = window.localStorage.getItem(ROLE_KEY) === ROLE_TOP_TESTER;
  }
  return isTopTester;
};
/*
 * 정의 : web에서 was의 data를 fetch하는 공통 함수
 * 설명 : transitEffect는 spinner 효과 사용여부 판단
 */
export const nb_dataFetch = async (url, transitEffect) => {
  if (transitEffect) {
    document.getElementById('page-transit').classList.remove('hide');
    document.getElementById('page-transit-img').classList.remove('hide');
  }

  let returnVal = null;
  url = process.env.REACT_APP_DB_HOST + url;
  await fetch(url, {
    method: 'get', // 방식은 get
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  })
    .then(async (response) => {
      if (response.headers.get(ACCESS_TOKEN_KEY) !== null) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.headers.get(ACCESS_TOKEN_KEY));
        //매니저 권한 임시 구현
        window.localStorage.setItem(ROLE_KEY, response.headers.get(ROLE_KEY));
      }
      return response.text();
    })
    .then(async (data) => {
      if (transitEffect) {
        document.getElementById('page-transit').classList.add('hide');
        document.getElementById('page-transit-img').classList.add('hide');
      }
      if (data !== '') {
        returnVal = JSON.parse(data);
        if (returnVal.existMsg) {
          if (document.getElementById('resDetailedTimeDesc') !== null) {
            document.getElementById('resDetailedTimeDesc').classList.add('hide');
          }
          nb_fadeInOutC(returnVal.serverMsg, 3000);
        }
      }
    });
  return returnVal;
};

export const nb_formDataFetch = async (url, formData, transitEffect) => {
  if (transitEffect) {
    document.getElementById('page-transit').classList.remove('hide');
    document.getElementById('page-transit-img').classList.remove('hide');
  }

  let returnVal = null;
  url = process.env.REACT_APP_DB_HOST + url;
  await fetch(url, {
    // fetch를 통해 Ajax통신을 한다.
    method: 'post', // 방식은 post
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
    body: formData, // body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
  })
    .then(async (response) => {
      if (response.headers.get(ACCESS_TOKEN_KEY) !== null) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.headers.get(ACCESS_TOKEN_KEY));
        //매니저 권한 임시 구현
        window.localStorage.setItem(ROLE_KEY, response.headers.get(ROLE_KEY));
      }
      return response.text();
    })
    .then(async (data) => {
      if (transitEffect) {
        document.getElementById('page-transit').classList.add('hide');
        document.getElementById('page-transit-img').classList.add('hide');
      }

      if (data !== '') {
        returnVal = JSON.parse(data);
        if (returnVal.existMsg) {
          if (document.getElementById('resDetailedTimeDesc') !== null) {
            document.getElementById('resDetailedTimeDesc').classList.add('hide');
          }
          nb_fadeInOutC(returnVal.serverMsg, 3000);
        }
      }
    });
  return returnVal;
};

export const nb_formDataFileFetch = async (url, formData, fileName) => {
  url = process.env.REACT_APP_DB_HOST + url;
  await fetch(url, {
    // fetch를 통해 Ajax통신을 한다.
    method: 'post', // 방식은 post
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
    body: formData, // body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
  })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout((_) => {
        window.URL.revokeObjectURL(url);
      }, 60000);
      a.remove();
    })
    .catch((err) => {
      console.error('err: ', err);
    });
};

export const nb_dataFileFetch = async (url, fileName) => {
  url = process.env.REACT_APP_DB_HOST + url;
  await fetch(url, {
    method: 'get', // 방식은 get
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout((_) => {
        window.URL.revokeObjectURL(url);
      }, 60000);
      a.remove();
    })
    .catch((err) => {
      console.error('err: ', err);
    });
};

/**
 * http 요청
 */
export const nb_request = async (url, httpOption, transitEffect) => {
  let jsonData = null; // 결과값

  // 로딩바 생성
  if (transitEffect) {
    document.getElementById('page-transit').classList.remove('hide');
    document.getElementById('page-transit-img').classList.remove('hide');
  }

  // 요청
  const serverUrl = process.env.REACT_APP_DB_HOST + url;
  await fetch(serverUrl, httpOption)
    .then(async (response) => {
      // 헤더에 Authorization 추가(서버에서 내려준 경우에만)
      if (response.headers.get(ACCESS_TOKEN_KEY) !== null) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.headers.get(ACCESS_TOKEN_KEY));
        // 권한 추가
        window.localStorage.setItem(ROLE_KEY, response.headers.get(ROLE_KEY));
      }
      return response.text();
    })
    .then(async (data) => {
      // 로딩바 제거
      if (transitEffect) {
        document.getElementById('page-transit').classList.add('hide');
        document.getElementById('page-transit-img').classList.add('hide');
      }
      // json형태로 파싱
      jsonData = JSON.parse(data);

      // 성공 응답 아닌 경우
      if (jsonData.status >= 500) {
        alert('서버가 정상적이지 않습니다.\n잠시 후 다시 시도해주세요.');
      }
    });
  return jsonData;
};

/**
 * get 요청
 */
export const nb_getRequest = async (url, transitEffect) => {
  // 요청 전문 생성
  const httpOption = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };

  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

/**
 * put 요청
 */
export const nb_putForm = async (url, formData, transitEffect) => {
  const httpOption = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };
  httpOption.body = formData;
  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

/**
 * post 요청
 */
export const nb_postForm = async (url, formData, transitEffect) => {
  const httpOption = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };
  httpOption.body = formData;
  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

export const nb_postFormToJson = async (url, formData, transitEffect) => {
  // form to json
  const jsonData = {};
  formData.forEach((value, key) => {
    if (jsonData[key]) {
      // 기존 값이 배열이 아닐 경우 배열로 변환
      if (!Array.isArray(jsonData[key])) {
        jsonData[key] = [jsonData[key]];
      }
      jsonData[key].push(value);
    } else {
      jsonData[key] = value;
    }
  });

  // 요청
  return await nb_postRequest(url, jsonData, transitEffect);
};

export const nb_postRequest = async (url, jsonData, transitEffect) => {
  // 요청 전문 생성
  const httpOption = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };
  httpOption.body = JSON.stringify(jsonData);

  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

/**
 * post, json 요청
 */

export const nb_putFormRequest = async (url, formData, transitEffect) => {
  // form to json
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  // 요청
  return await nb_putRequest(url, jsonData, transitEffect);
};

export const nb_putRequest = async (url, jsonData, transitEffect) => {
  // 요청 전문 생성
  const httpOption = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };
  httpOption.body = JSON.stringify(jsonData);

  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

export const nb_deleteRequest = async (url, jsonData, transitEffect) => {
  // 요청 전문 생성
  const httpOption = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  };
  if (jsonData != null) {
    httpOption.body = JSON.stringify(jsonData);
  }

  // 요청
  return await nb_request(url, httpOption, transitEffect);
};

/*
 * 로그인 요청
 */
export const nb_formJsonFetch = async (url, formData, transitEffect) => {
  if (transitEffect) {
    document.getElementById('page-transit').classList.remove('hide');
    document.getElementById('page-transit-img').classList.remove('hide');
  }

  const jsonData = {};

  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  let returnVal = null;
  url = process.env.REACT_APP_DB_HOST + url;
  await fetch(url, {
    // fetch를 통해 Ajax통신을 한다.
    method: 'post', // 방식은 post
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData), // body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
  })
    .then(async (response) => {
      if (response.headers.get(ACCESS_TOKEN_KEY) !== null) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.headers.get(ACCESS_TOKEN_KEY));
        //매니저 권한 임시 구현
        window.localStorage.setItem(ROLE_KEY, response.headers.get(ROLE_KEY));
      }
      return response.text();
    })
    .then(async (data) => {
      if (transitEffect) {
        document.getElementById('page-transit').classList.add('hide');
        document.getElementById('page-transit-img').classList.add('hide');
      }
      returnVal = JSON.parse(data);
    });
  return returnVal;
};

export const nb_formToJson = async (formData) => {
  const jsonData = {};
  formData.forEach((value, key) => {
    if (jsonData[key]) {
      // 기존 값이 배열이 아닐 경우 배열로 변환
      if (!Array.isArray(jsonData[key])) {
        jsonData[key] = [jsonData[key]];
      }
      jsonData[key].push(value);
    } else {
      jsonData[key] = value;
    }
  });
  return jsonData;
};

export const nb_downloadFile = async (url, fileName) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // 파일 데이터를 Blob으로 변환
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob); // Blob 객체로 다운로드 링크 생성
      const a = document.createElement('a'); // 가상 `<a>` 태그 생성
      a.style.display = 'none';
      a.href = url;
      a.download = fileName; // 저장될 파일 이름 설정
      document.body.appendChild(a);
      a.click(); // 다운로드 시작
      a.remove(); // `<a>` 태그 제거
      window.URL.revokeObjectURL(url); // Object URL 해제
    })
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
};

export const fadeIn = async (targetId) => {
  let dom = document.getElementById(targetId);
  let op = 0.1; // initial opacity
  let timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    dom.style.display = 'inline-block';
    dom.style.opacity = op;
    op += 0.1;
  }, 30);
};

export const fadeOut = async (targetId) => {
  let dom = document.getElementById(targetId);
  let op = 1; // initial opacity
  let timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      dom.style.display = 'none';
    }
    dom.style.opacity = op;
    op -= 0.1;
  }, 30);
};

/*
 * custom alert (최상위에 위치)
 */
export const nb_fadeInOut = async (message, duringTime) => {
  document.getElementById('notifyBox').innerText = message;
  fadeIn('notifyBox');
  setTimeout(function () {
    fadeOut('notifyBox');
  }, duringTime);
};

/*
 * custom alert (정중앙 위치)
 */
export const nb_fadeInOutA = async (message, duringTime) => {
  document.getElementById('notifyBoxA').innerText = message;
  fadeIn('notifyBoxA');
  setTimeout(function () {
    fadeOut('notifyBoxA');
  }, duringTime);
};

/*
 * custom alert (정중앙 위치, 흔들림)
 */
export const nb_fadeInOutB = async (message, duringTime) => {
  document.getElementById('notifyBoxB').innerText = message;
  fadeIn('notifyBoxB');
  setTimeout(function () {
    fadeOut('notifyBoxB');
  }, duringTime);
};

/*
 * custom alert (정중앙 위치, 흔들림, 확인 버튼)
 */
export const nb_fadeInOutC = async (message, duringTime) => {
  document.getElementById('notifyBoxC-desc').innerText = message;
  fadeIn('notifyBoxC');
};

/*
 * custom prompt (정중앙 위치)
 */
export const nb_promptBox = async (message, placeholderMsg) => {
  document.getElementById('promptBoxScreen').classList.remove('hide');
  document.getElementById('promptMsg').innerText = message;
  document.getElementById('promptInput').focus();
  document.getElementById('promptInput').placeholder = placeholderMsg;
};

/*
 * custom prompt (정중앙 위치)
 */
export const nb_confirmBox = async (message) => {
  document.getElementById('confirmBoxScreen').classList.remove('hide');
  document.getElementById('confirmMsg').innerText = message;
};

export const nb_confirmBoxB = async (message) => {
  document.getElementById('confirmBoxScreenB').classList.remove('hide');
  document.getElementById('confirmMsgB').innerText = message;
};
/*
 * 정의 : 클래스 추가 함수
 */
export const nb_addClass = async (targetId, className) => {
  document.getElementById(targetId).classList.add(className);
};

/*
 * 정의 : 바이트 크기 리턴
 */
export const nb_getByteLengthOfString = function (s, b, i, c) {
  for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
  return b;
};

/*
 * 정의 : 이미지 로드 & 쇼
 * 설명 : input file에 등록된 파일 이미지를 쇼하는 함수
 */

export const nb_loadFile = async (event, outputId, contentsNo) => {
  //outputId는 출력 dom
  let reader = new FileReader();
  let output = document.getElementById(outputId);
  reader.onload = async function () {
    output.src = reader.result;
  };
  if (event.target.files[0] == undefined) return false; //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결

  if (contentsNo !== undefined) {
    let targetId = event.target.id;
    let formData = new FormData();
    formData.append('contentsNo', contentsNo);
    formData.append(targetId, event.target.files[0]);
    let url = process.env.REACT_APP_DB_HOST + '/mathInfo/changeConOrSolImg';
    let returnObj = await nb_formDataFetch(url, formData, true);
    document.getElementById('imgUpdt').value = 'Y';
    reader.readAsDataURL(event.target.files[0]);
    output.classList.remove('hide');
    if (returnObj.updateCond !== 1) {
      alert('정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.');
      return false;
    } else {
      return 'Y';
    }
  } else {
    reader.readAsDataURL(event.target.files[0]);
    output.classList.remove('hide');
    return '';
  }
};

/*
 * 정의 : 이미지 삭제
 * 설명 : input file에 등록된 파일 이미지를 삭제하는 함수
 */
export const nb_imgFileDel = async (outputId, fileTagId) => {
  //outputId는 출력 dom
  document.getElementById(fileTagId).value = '';

  let output = document.getElementById(outputId);
  output.src = '';
  output.classList.add('hide');
};

/*
 * 정의 : S3이미지를 base64로 인코딩
 */
export const nb_S3ImgToBase64 = async (url) => {
  let base64Str = '';
  await fetch(url, {
    method: 'GET', // 방식은 get
    credentials: 'include',
    headers: {},
    cache: 'no-cache', //cache 없어야 정상 다운됨
  })
    .then((response) => response.blob())
    .then((blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }).then((dataUrl) => {
        base64Str = dataUrl;
      })
    );
  return base64Str;
};
/*
 * 정의 : base64 이미지를 파일로 변환
 */
export const nb_base64ImgtoFile = async (imgSrc, filename) => {
  //outputId는 출력 dom
  let base64Type = [
    { mimeType: 'data:image/png;base64,', ext: '.png' },
    { mimeType: 'data:image/jpeg;base64,', ext: '.jpeg' },
    { mimeType: 'data:image/bmp;base64,', ext: '.bmp' },
    { mimeType: 'data:image/webp;base64,', ext: '.webp' },
    { mimeType: 'data:image/gif;base64,', ext: '.gif' },
  ];

  let isBase64Str = false;
  let exetension = '';
  for (let i = 0; i < base64Type.length; i++) {
    if (imgSrc.indexOf(base64Type[i].mimeType) > -1) {
      isBase64Str = true;
      exetension = base64Type[i].ext;
      break;
    }
  }
  //base64가 아닌 경우 null 리턴
  if (!isBase64Str) {
    return null;
  }

  let arr = imgSrc.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename + exetension, { type: mime });
};

/*
 * 정의 : base64Img S3서버에 저장
 */
export const nb_base64ImgRegisterToS3 = async (event) => {
  //ctrl+v로 base64 이미지 들어온 경우 s3에 등록
  if (event.keyCode === 86 && event.ctrlKey) {
    let imgFile;
    let allImgDom = event.target.querySelectorAll('img');
    for (let i = 0; i < allImgDom.length; i++) {
      let fileName = await nb_generateRandomString(15);
      imgFile = await nb_base64ImgtoFile(allImgDom[i].src, fileName);
      //base64 이미지가 아닌 경우 skip
      if (imgFile === null) continue;
      let formData = new FormData();
      formData.append('actionId', 10);
      formData.append('imgPath', 'editorImgUpld');
      formData.append('multipartFile', imgFile);
      let returnObj = await nb_formDataFetch('/common/imgUpload', formData, false);
      allImgDom[i].src = returnObj.s3ImgUrl;
    }
  }
};

/*
 * 정의 : base64Img S3서버에 저장
 */
export const nb_base64ImgRegisterToS3ByTargetId = async (targetId) => {
  //ctrl+v로 base64 이미지 들어온 경우 s3에 등록
  let imgFile;
  let allImgDom = document.getElementById(targetId).querySelectorAll('img');
  for (let i = 0; i < allImgDom.length; i++) {
    let fileName = await nb_generateRandomString(15);
    imgFile = await nb_base64ImgtoFile(allImgDom[i].src, fileName);
    //base64 이미지가 아닌 경우 skip
    if (imgFile === null) continue;
    let formData = new FormData();
    formData.append('actionId', 10);
    formData.append('imgPath', 'editorImgUpld');
    formData.append('multipartFile', imgFile);
    let returnObj = await nb_formDataFetch('/common/imgUpload', formData, false);
    allImgDom[i].src = returnObj.s3ImgUrl;
  }
};

/*
 * 정의 : 랜덤 문자열 추출
 */
export const nb_generateRandomString = async (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

/*
 * 정의 : 이미지 파일 확장자 체크 함수
 */
export const nb_extensionCheck = async (event, outputTarget, updtMode) => {
  let targetId = event.target.id;
  let obj = document.getElementById(targetId);
  let file = document.getElementById(targetId).files[0];
  if (file == undefined) {
    //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
    //수정모드일때는 수정모드에 있는 함수로 DB에 등록된 이미지 제거
    if (updtMode !== undefined) {
      return false;
    } else {
      await nb_imgFileDel(outputTarget, targetId);
      return false;
    }
  }
  // file[0].size 는 파일 용량 정보입니다.
  if (file.size > 1024 * 1024 * 2) {
    // 용량 초과시 경고후 해당 파일의 용량도 보여줌
    alert('첨부파일 사이즈는 2MB 이내로 등록 가능합니다. ');
    await nb_imgFileDel(outputTarget, targetId);
    return false;
  }

  let pathpoint = obj.value.lastIndexOf('.');
  let filepoint = obj.value.substring(pathpoint + 1, event.length);
  let filetype = filepoint.toLowerCase();
  // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
  if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp') {
  } else {
    alert('이미지 파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
    await nb_imgFileDel(outputTarget, targetId);
    return false;
  }
};

/*
 * 정의 : 이미지 파일 확장자 체크 함수
 * 설명 : 아웃풋 이미지 변경없이 확장자만 체크
 */
export const nb_extensionCheck2 = async (event, exetension) => {
  let targetId = event.target.id;
  let obj = document.getElementById(targetId);
  let file = document.getElementById(targetId).files[0];
  if (file == undefined) {
    //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
    return false;
  }
  if (exetension === 'hwp') {
    // file[0].size 는 파일 용량 정보입니다.
    if (file.size > 1024 * 1024 * 10) {
      // 용량 초과시 경고후 해당 파일의 용량도 보여줌
      alert('첨부파일 사이즈는 10MB 이내로 등록 가능합니다. ');
      document.getElementById(targetId).value = '';
      return false;
    }
  } else {
    // file[0].size 는 파일 용량 정보입니다.
    if (file.size > 1024 * 1024 * 2) {
      // 용량 초과시 경고후 해당 파일의 용량도 보여줌
      alert('첨부파일 사이즈는 2MB 이내로 등록 가능합니다. ');
      document.getElementById(targetId).value = '';
      return false;
    }
  }

  let fileNames = event.target.files[0].name.split('.');
  let filetype = fileNames[fileNames.length - 1].toLowerCase();
  if (exetension === 'hwp') {
    // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
    if (filetype === 'hwp' || filetype === 'hml' || filetype === 'hwpx' || filetype === 'hwt' || filetype === 'hwtx') {
    } else {
      alert('한글 파일만 등록해주세요.(hwp/hml/hwpx/hwt/hwtx)');
      document.getElementById(targetId).value = '';
      return false;
    }
  } else {
    // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
    if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp') {
    } else {
      alert('이미지 파일만 등록해주세요.(img/gif/png/jpeg/bmp)');
      document.getElementById(targetId).value = '';
      return false;
    }
  }

  if (fileNames[0].length > 40) {
    alert('파일이름은 40글자 미만으로 설정해주시기 바랍니다.');
    document.getElementById(targetId).value = '';
    return false;
  }
};

export const nb_module_handleImageUpload = async (event) => {
  let imageFile = event.target.files[0];

  //1MB 보다 큰 이미지에 대해서만 압축 진행
  if (imageFile.size / 1024 / 1024 < 0.05) return imageFile;
  let options = {
    maxSizeMB: 0.04,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    document.getElementById('page-transit').classList.remove('hide');
    document.getElementById('page-transit-img').classList.remove('hide');
    document.getElementById('page-transit-desc').classList.remove('hide');
    document.getElementById('page-transit-desc').innerText = '이미지를 압축하여 불러오고 있습니다...';
    let compressedFile = await imageCompression(imageFile, options);
    document.getElementById('page-transit').classList.add('hide');
    document.getElementById('page-transit-img').classList.add('hide');
    document.getElementById('page-transit-desc').classList.add('hide');
    return compressedFile;
  } catch (error) {}
};

/*
 * 체크박스 선택된 값 가져오는 함수
 */
export const nb_getCheckedVal = async function (event) {
  let obj_length = document.getElementsByName(event.target.name).length;
  let checkedValue = '';
  for (var i = 0; i < obj_length; i++) {
    if (document.getElementsByName(event.target.name)[i].checked == true) {
      if (checkedValue.length == 0) {
        checkedValue = document.getElementsByName(event.target.name)[i].value;
      } else {
        checkedValue += ',' + document.getElementsByName(event.target.name)[i].value;
      }
    }
  }
  return checkedValue;
};

/*
 * 닫기 버튼 함수
 */
export const nb_closeBtn = async function (targetId) {
  document.getElementById(targetId).classList.add('hide');
  let blindBox = document.getElementsByClassName('blindBox');
  for (let i = 0; i < blindBox.length; i++) {
    document.getElementsByClassName('blindBox')[i].classList.add('hide');
  }
};

/*
 * nbCustomSel 박스 option 클릭 함수
 */
export const nb_fCustomOptClk = function (event, parentId, customTitle, originSel) {
  let targetDom = document.getElementById(event.currentTarget.id);
  let parentDom = document.getElementById(parentId);
  let selVal = document.getElementById(customTitle);
  selVal.innerHTML = targetDom.innerHTML;
  let orginSelOpt = document.getElementById(originSel);
  if (targetDom.dataset.unitName != '0') {
    parentDom.classList.add('nbCustomSelected');
  } else {
    parentDom.classList.remove('nbCustomSelected');
  }
  parentDom.classList.remove('active');
  if (parentId == 'cusSelThrUnitDiv') {
    let optionList = orginSelOpt.children;
    let selectedIdx = 0;
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].dataset.unitId == targetDom.dataset.unitId) selectedIdx = i;
    }
    orginSelOpt.children[selectedIdx].selected = true;
    orginSelOpt.children[selectedIdx].dataset.unitId = targetDom.dataset.unitId;
  } else if (parentId == 'cusSelQuesTypeDiv') {
    let optionList = orginSelOpt.children;
    let selectedIdx = 0;
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].dataset.parentUnitId == targetDom.dataset.unitId && optionList[i].dataset.typeId == targetDom.dataset.typeId) {
        selectedIdx = i;
      }
    }
    orginSelOpt.children[selectedIdx].selected = true;
    orginSelOpt.children[selectedIdx].dataset.unitId = targetDom.dataset.unitId;
  } else if (parentId == 'cusQuesSelDiv') {
    orginSelOpt.value = targetDom.dataset.value;
    orginSelOpt.dataset.value = targetDom.dataset.value;
  } else {
    orginSelOpt.value = targetDom.dataset.unitName;
    orginSelOpt.dataset.unitId = targetDom.dataset.unitId;
  }

  event.stopPropagation(); //이벤트 버블링 제거(제거 안하면 nb_fCustomSelDivClk 실행되어 customSel 박스가 안닫힘)
};

/*
 * nbCustomSel 박스 div 클릭 함수
 */
export const nb_fCustomSelDivClk = async function (event) {
  let curTargetDom = document.getElementById(event.currentTarget.id);
  let customSelList = document.getElementsByClassName('nbCustomSel');
  for (let i = 0; i < customSelList.length; i++) {
    if (customSelList[i].id != event.currentTarget.id) customSelList[i].classList.remove('active');
  }
  if (curTargetDom.classList.contains('active')) {
    curTargetDom.classList.remove('active');
  } else {
    curTargetDom.classList.add('active');
  }
  //nb_fCustomSelClose(박스 닫기 함수) 실행 안되게끔 이벤트 버블링 제거
  //nb_fCustomSelClose 실행되면 latex 수식 클릭시 customSel 박스 안열림(targetDom이 null로 잡히기 때문)
  event.stopPropagation();
};

/*
 * nbCustomSel 박스가 아닌 다른 요소를 클릭한 경우 sel 박스 닫기 이벤트
 * 이벤트 등록된 요소 밑에 dom 많을 수록 많이 실행됨
 */
export const nb_fCustomSelClose = async function (event) {
  let customSelList = document.getElementsByClassName('nbCustomSel');
  let targetDom = document.getElementById(event.target.id);
  //클릭한 요소가 id가 없거나 클래스이름에 nbCustomSel 또는 nbCustomSelVal 포함되지 않는경우
  if (targetDom == null || (!targetDom.classList.contains('nbCustomSel') && !targetDom.classList.contains('nbCustomSelVal'))) {
    for (let i = 0; i < customSelList.length; i++) {
      if (customSelList[i].classList.contains('nbCustomSel')) {
        //nbCustomSel클래스의 active 제거
        customSelList[i].classList.remove('active');
      }
    }
  }
};

/*
 * nb_completeBlueBox 입력완료 블루박스
 */
export const nb_completeBlueBox = async function (event, charLength) {
  let targetDom = document.getElementById(event.target.id);
  if (targetDom.value.length < charLength) {
    document.getElementById(event.target.id).classList.remove('customBlueBoxComplete');
  } else {
    document.getElementById(event.target.id).classList.add('customBlueBoxComplete');
  }
};

export const nb_completeBlueBoxMulti = async function (event, charLength) {
  if (event.target.value.length < charLength) {
    event.target.classList.remove('customBlueBoxComplete');
  } else {
    event.target.classList.add('customBlueBoxComplete');
  }
};

/*
 * 상단 메뉴 고정 fixed 함수
 */
export const nb_topMenuFixed = async function (targetId, targetDomWidth, parentDomId, parentFixedDomClassName, isLeft) {
  let targetDom = document.getElementById(targetId);
  if (targetDomWidth === 0) return;

  //부모 요소 없이 상단 브라우저 높이로 고정하는 경우
  if (parentDomId == null) {
    if (targetDom.offsetTop < window.pageYOffset) {
      targetDom.classList.add('fixedTopMenu');
      if (targetDom.nextElementSibling.className !== 'fakeDiv') {
        let div = document.createElement('div');
        div.className = 'fakeDiv';
        targetDom.after(div);
      }

      if (targetDomWidth < 620) targetDomWidth = 620;
      targetDom.style.width = targetDomWidth + 'px';
      if (parentFixedDomClassName !== undefined) {
        if (isLeft) {
          targetDom.style.marginLeft = 'unset';
          targetDom.style.left = document.getElementsByClassName(parentFixedDomClassName)[0].getBoundingClientRect().left + 'px';
        } else {
          targetDom.style.left = 'unset';
          targetDom.style.marginLeft = 'auto';
        }
      } else {
        targetDom.style.left = document.getElementsByClassName('right')[0].getBoundingClientRect().left + 'px';
      }
    }

    if (document.getElementsByClassName('fakeDiv')[0] !== undefined) {
      if (document.getElementsByClassName('fakeDiv')[0].getBoundingClientRect().bottom > 250) {
        targetDom.classList.remove('fixedTopMenu');
        if (document.getElementsByClassName('fakeDiv')[0] !== undefined) document.getElementsByClassName('fakeDiv')[0].remove();
      }
    }
  } else {
    //모달팝업인 경우
    let parentDomScrollTop = document.getElementById(parentDomId).scrollTop;
    if (parentDomScrollTop > 12) {
      targetDom.classList.add('fixedTopMenu');
      targetDom.style.width = targetDomWidth + 'px';
    } else {
      targetDom.classList.remove('fixedTopMenu');
    }
    targetDom.style.left = document.getElementsByClassName('right')[0].getBoundingClientRect().left + 'px';
  }
};

export const nb_topMenuFixed2 = async function (targetId) {
  let targetDom = document.getElementById(targetId);
  if (targetDom.offsetTop < window.pageYOffset) {
    targetDom.classList.add('fixedTopMenu');
    targetDom.style.left = 50 + '%';
    if (targetDom.nextElementSibling.className !== 'fakeDiv2') {
      let div = document.createElement('div');
      div.className = 'fakeDiv2';
      targetDom.after(div);
    }
  }

  if (document.getElementsByClassName('fakeDiv2')[0] !== undefined) {
    if (document.getElementsByClassName('fakeDiv2')[0].getBoundingClientRect().bottom > 110) {
      targetDom.classList.remove('fixedTopMenu');
      if (document.getElementsByClassName('fakeDiv2')[0] !== undefined) document.getElementsByClassName('fakeDiv2')[0].remove();
    }
  }
};

/*
 * 모달 팝업 열었을시 부모창 스크롤 방지
 */
export const nb_modalScrollStrt = () => {
  let scrollY = window.scrollY;
  document.getElementById('root').style.overflow = 'hidden';
  return scrollY;
};

/*
 * 모달 팝업 닫았을시 부모창 스크롤 기존 위치로
 */
export const nb_modalScrollEnd = (scrollY) => {
  document.getElementById('root').style.overflow = 'unset';
  window.scrollTo(0, scrollY);
};

/*
 * 하위 요소 너비 우선 특정클래스 탐색방식 (BFS)
 */
export const nb_querySelctorBFS = async (element, className) => {
  let childEle = null;
  let childrenByBFS = element.children;
  Loop1: while (childrenByBFS.length !== 0) {
    let arr = [];
    Loop2: for (let i = 0; i < childrenByBFS.length; i++) {
      if (childrenByBFS[i].classList.contains(className)) {
        childEle = childrenByBFS[i];
        break Loop1;
      }
      arr.push.apply(arr, childrenByBFS[i].children);
    }
    childrenByBFS = arr;
  }
  return childEle;
};

export const nb_contentsSrcVal = async function (event, isUpdtMode) {
  let srcRef;
  if (event === null) srcRef = document.getElementById('orgSrcRef').value;
  else srcRef = event.target.dataset.value;

  if (srcRef === '수학의 힘(베타)' || srcRef === '쎈수학' || srcRef === 'RPM' || srcRef === '해결의법칙') {
    //참고서인 경우 문제번호, 출판연도, 문제 유형
    document.getElementById('orgSrcNo').classList.remove('hide');
    document.getElementById('copyrightYear').classList.remove('hide');
    document.getElementById('orgSrcPage').value = '';
    document.getElementById('orgSrcPage').classList.remove('customBlueBoxComplete');
    document.getElementById('orgSrcPage').classList.add('hide');
  } else if (srcRef === '교과서') {
    // 교과서인 경우 문제번호, 페이지수, 출판연도, 문제 유형
    document.getElementById('orgSrcNo').classList.remove('hide');
    document.getElementById('orgSrcPage').classList.remove('hide');
    document.getElementById('copyrightYear').classList.remove('hide');
  } else if (srcRef === '창작') {
    // 창작인 경우 문제 구분 유형만 노출, 나머지는 초기화
    document.getElementById('orgSrcNo').value = null;
    document.getElementById('orgSrcNo').classList.remove('customBlueBoxComplete');
    document.getElementById('orgSrcNo').classList.add('hide');
    document.getElementById('orgSrcPage').value = '';
    document.getElementById('orgSrcPage').classList.remove('customBlueBoxComplete');
    document.getElementById('orgSrcPage').classList.add('hide');
    document.getElementById('copyrightYear').value = '';
    document.getElementById('copyrightYear').classList.remove('customBlueBoxComplete');
    document.getElementById('copyrightYear').classList.add('hide');
  }
};

export const nb_multiChoiceGridSet = async (className) => {
  let multiShowDiv = document.getElementsByClassName(className);
  let maxWidth;
  for (let i = 0; i < multiShowDiv.length; i++) {
    multiShowDiv[i].classList.remove('oneDivGrid');
    multiShowDiv[i].classList.remove('twoDivGrid');
    multiShowDiv[i].classList.remove('threeDivGrid');
    maxWidth = multiShowDiv[i].querySelector('.firDiv').offsetWidth;
    if (maxWidth < multiShowDiv[i].querySelector('.secDiv').offsetWidth) maxWidth = multiShowDiv[i].querySelector('.secDiv').offsetWidth;
    if (maxWidth < multiShowDiv[i].querySelector('.thrDiv').offsetWidth) maxWidth = multiShowDiv[i].querySelector('.thrDiv').offsetWidth;
    if (maxWidth < multiShowDiv[i].querySelector('.fourDiv').offsetWidth) maxWidth = multiShowDiv[i].querySelector('.fourDiv').offsetWidth;
    if (maxWidth < multiShowDiv[i].querySelector('.fifDiv').offsetWidth) maxWidth = multiShowDiv[i].querySelector('.fifDiv').offsetWidth;

    if (maxWidth < 190 && maxWidth > 120) multiShowDiv[i].classList.add('twoDivGrid');
    else if (maxWidth <= 120) multiShowDiv[i].classList.add('threeDivGrid');
    else multiShowDiv[i].classList.add('oneDivGrid');
  }
};

export const nb_licenseUiCheck = async (licenseObj) => {
  if (licenseObj !== null && licenseObj !== undefined) {
    if (licenseObj.shareStts === 1) {
      //공개문제
      document.getElementById('platformShareSttsUi').classList.remove('inactiveCircle');
      document.getElementById('platformShareSttsUi').classList.add('activeCircle');
      if (licenseObj.onlineLicStts === 1) {
        document.getElementById('onlineLicSttsUi').classList.remove('inactiveCircle');
        document.getElementById('onlineLicSttsUi').classList.add('activeCircle');
      } else {
        document.getElementById('onlineLicSttsUi').classList.remove('activeCircle');
        document.getElementById('onlineLicSttsUi').classList.add('inactiveCircle');
      }

      if (licenseObj.perLicStts === 1) {
        document.getElementById('perLicSttsUi').classList.remove('inactiveCircle');
        document.getElementById('perLicSttsUi').classList.add('activeCircle');
      } else {
        document.getElementById('perLicSttsUi').classList.remove('activeCircle');
        document.getElementById('perLicSttsUi').classList.add('inactiveCircle');
      }

      if (licenseObj.entLicStts === 1) {
        document.getElementById('entLicSttsUi').classList.remove('inactiveCircle');
        document.getElementById('entLicSttsUi').classList.add('activeCircle');
      } else {
        document.getElementById('entLicSttsUi').classList.remove('activeCircle');
        document.getElementById('entLicSttsUi').classList.add('inactiveCircle');
      }
    } else {
      // 비공개 문제
      document.getElementById('platformShareSttsUi').classList.remove('activeCircle');
      document.getElementById('platformShareSttsUi').classList.add('inactiveCircle');
      document.getElementById('onlineLicSttsUi').classList.remove('activeCircle');
      document.getElementById('onlineLicSttsUi').classList.add('inactiveCircle');
      document.getElementById('perLicSttsUi').classList.remove('activeCircle');
      document.getElementById('perLicSttsUi').classList.add('inactiveCircle');
      document.getElementById('entLicSttsUi').classList.remove('activeCircle');
      document.getElementById('entLicSttsUi').classList.add('inactiveCircle');
    }
  } else {
    //N명의수학 문제의 경우
    document.getElementById('platformShareSttsUi').classList.remove('inactiveCircle');
    document.getElementById('platformShareSttsUi').classList.add('activeCircle');

    document.getElementById('onlineLicSttsUi').classList.remove('inactiveCircle');
    document.getElementById('onlineLicSttsUi').classList.add('activeCircle');

    document.getElementById('perLicSttsUi').classList.remove('activeCircle');
    document.getElementById('perLicSttsUi').classList.add('inactiveCircle');

    document.getElementById('entLicSttsUi').classList.remove('activeCircle');
    document.getElementById('entLicSttsUi').classList.add('inactiveCircle');
  }
};

export const nb_getParameterByName = function (name) {
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const nb_detectScrollPosition = async function () {
  if (window.innerHeight * 2 < document.body.scrollHeight) {
    if (window.innerHeight < window.scrollY) {
      document.getElementById('scrollMoveBtn').classList.remove('hide');
    } else {
      document.getElementById('scrollMoveBtn').classList.add('hide');
    }
  }
};

export const nb_moveToScroll = async function (isToTop) {
  if (isToTop) {
    let interval = setInterval(function () {
      if (window.scrollY === 0) {
        clearInterval(interval);
      }
      window.scrollTo(window.scrollX, window.scrollY - window.scrollY / 20);
    }, 1);
  } else {
    document.getElementById('bottom-div').classList.add('hide');
    let interval = setInterval(function () {
      if (Math.abs(window.scrollY - (document.documentElement.scrollHeight - document.body.offsetHeight)) < 10) {
        document.getElementById('bottom-div').classList.remove('hide');
        clearInterval(interval);
        //window.scrollTo(window.scrollX, window.scrollY-300);
      } else {
        window.scrollTo(window.scrollX, window.scrollY + window.scrollY / 20);
      }
    }, 1);
  }
};

export const nb_moveToScrollAllRange = async function (isToTop) {
  if (isToTop) {
    let interval = setInterval(function () {
      if (window.scrollY === 0) {
        clearInterval(interval);
      }
      window.scrollTo(window.scrollX, window.scrollY - window.scrollY / 20);
    }, 1);
  } else {
    if (document.getElementById('bottom-div') !== null) document.getElementById('bottom-div').classList.add('hide');
    let interval = setInterval(function () {
      if (Math.abs(window.scrollY - (document.documentElement.scrollHeight - document.body.offsetHeight)) < 10) {
        if (document.getElementById('bottom-div') !== null) document.getElementById('bottom-div').classList.remove('hide');
        clearInterval(interval);
        //window.scrollTo(window.scrollX, window.scrollY-300);
      } else {
        if (window.scrollY === 0) window.scrollTo(window.scrollX, 100);
        window.scrollTo(window.scrollX, window.scrollY + window.scrollY / 20);
      }
    }, 1);
  }
};

export const nb_dateFormat = async (separator) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  if (month.toString().length === 1) month = '0' + month.toString();
  let date = today.getDate();
  if (date.toString().length === 1) date = '0' + date.toString();
  let hour = today.getHours();
  if (hour.toString().length === 1) hour = '0' + hour.toString();
  let minute = today.getMinutes();
  if (minute.toString().length === 1) minute = '0' + minute.toString();
  let milliSec = today.getMilliseconds();
  if (milliSec.toString().length === 1) milliSec = '0' + milliSec.toString();
  return year + separator + month + separator + date + separator + hour + separator + minute + separator + milliSec;
};

export const nb_getClientOS = async () => {
  let userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('windows') > -1) {
    return 'Windows';
  } else if (userAgent.indexOf('mac') > -1) {
    return 'Mac';
  } else {
    return 'Etc';
  }
};

export const nb_getClientBrowser = async () => {
  let userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('opr') > -1) {
    return 'Opr';
  } else if (userAgent.indexOf('edg') > -1) {
    return 'Edg';
  } else if (userAgent.indexOf('whale') > -1) {
    return 'Whale';
  } else if (userAgent.indexOf('firefox') > -1) {
    return 'Firefox';
  } else if (!(userAgent.indexOf('chrome') > -1) && userAgent.indexOf('safari') > -1) {
    return 'Safari';
  } else if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('safari') > -1) {
    return 'Chrome';
  } else {
    return 'Etc';
  }
};
