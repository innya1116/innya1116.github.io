# 01. 프로젝트 정보

- SK이노베이션 ESG Data Platform

# 02. 환경정보
### 1) 스크립트 파일 경로
- /source/pc/index.js
- /source/pc/class/content/\*.js
- /source/pc/class/library/\*.js (공통 사용 기능)
- /source/pc/config/index.js (글로벌 변수 정의)
- /source/pc/lib/\*.js (플러그인 js)

# 03. 파일 설치
### 1) npm package 설치
- npm i

### 2) 개발 모드 js 파일 실행
- npm run dev

### 3) 파일 배포
- npm run buildJs
- /output/js/commonJs.min.js 압축 파일 만들어 지고, 해당 파일 배포

### 4) Global Variable
- mvJS
- ex) mvJS.popup.open(), mvJS.popup.close() ...
- 백엔드와 연동을 하거나 외부에서 함수를 호출을 하기 위한 용도

# 04. 사용 라이브러리
- swiper
<br><br>