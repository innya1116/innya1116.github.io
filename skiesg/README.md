## 01. 프로젝트 정보
- SK이노베이션 ESG Data Platform

## 02. 환경정보
### 1) 퍼블리싱 파일 경로
- **/output/\* (최종 산출물)**
  - /output/index.html (퍼블리싱 작업관련 기본)
  - /output/style-guide.html (퍼블리싱 스타일 가이드)
  - /output/filelist.html (작업 파일 리스트)
  - /output/css/font/\* (웹폰트 파일)
  - /output/css/common.css (build css - 국문/영문 포함하여 작업됨)
  - /output/guide/\* (스타일가이드 관련 리소스 파일)
  - /output/html/\* (국문 html)
  - /output/html-en/\* (영문 html)
  - /output/images/\*
  - /output/js/commonJs.min.js (build js)
<br><br>

- **/src/scss/\* (common.css build 전 원본 scss 파일) - css 원본파일은 최종산출물에 포함하지 않음**
  - /src/scss/guide/guide.scss (가이드)
  - /src/scss/common/_base.scss (초기화)
  - /src/scss/common/_font.scss (웹폰트)
  - /src/scss/common/_variables.scss (변수)
  - /src/scss/common/common.scss (공통)
  - /src/scss/common/layout.scss (layout)
  - /src/scss/main.scss (메인 페이지)
  - /src/scss/growth.scss (growth 페이지)
  - /src/scss/esgdata.scss (esgdata 페이지)
  - /src/scss/error.scss (에러 페이지)

### 2) 스크립트 파일 경로
- /source/pc/index.js
- /source/pc/class/content/\*.js
- /source/pc/class/library/\*.js (공통 사용 기능)
- /source/pc/config/index.js (글로벌 변수 정의)
- /source/pc/lib/\*.js (플러그인 js)


## 03. 파일 설치
### 1) npm package 설치
- npm i

### 2) 개발 모드 js 파일 실행
- npm run dev
- /output/css/common.css 생성 (최종파일)<br>
  common.css는 npm run dev로 파일이 생성되며 해당 파일로 배포함.
- /output/js/commonJs.min.js 생성 (개발모드 파일)

### 3) js 파일 배포
- npm run buildJs
- /output/js/commonJs.min.js 압축 파일 만들어 지고, 해당 파일 배포

### 4) Global Variable
- mvJS
- ex) mvJS.popup.open(), mvJS.popup.close() ...
- 백엔드와 연동을 하거나 외부에서 함수를 호출을 하기 위한 용도

## 04. 사용 라이브러리
- swiper
<br><br>
