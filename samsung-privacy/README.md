# 삼성전자 글로벌 권리대응 사이트 UX개선 프로젝트
## 1. 담당자

## 2. 프로젝트 정보
- 반응형 제작<br>
- 글로벌 확산을 위한 RTL 언어 사용국가 고려 작업(dir="rtl" 적용하여 테스트)
````html
<html lang="언어코드" dir="rtl">
````
- 고대비 모드 작업 필요(고대비 모드 적용 클래스: high-contrast-mode)
````html
<body class="high-contrast-mode">
````

## 3. 작업환경 정보
### 1) 사용 프로그램
- node.js - https://nodejs.org/ko/
- git - https://git-scm.com/download/win
- vscode - https://code.visualstudio.com/

### 2) css/js build 방법
1. 작업폴더에서 checkout<br>
2. 해당 폴더에서 npm i로 npm package 설치<br>
3. npm run dev 명령어 입력하여 build(/output/css/, /output/js/)

- **[css원본 파일 경로]**<br>
  /src/less 폴더 - 컴파일 전 원본파일
  - /src/less/common/common.less<br>
    /src/less/components/common/\*.less<br>
    두 가지 경로에 있는 파일들은 common.css 파일로 변환
  - /src/less/components/\*.less<br>
    위의 경로에 있는 파일들은 style.css 파일로 변환
  - \*rtl.less 파일 - rtl style 정의
  - z-high-contrast.less - 고대비 적용을 위한 파일

### 3) 확인 URL
- Style Guide - https://innya1116.github.io/samsung-privacy/output/
- File List - https://innya1116.github.io/samsung-privacy/output/filelist.html

### 4) file 경로
- 최종산출물 /output/ 폴더 내
- 개발 전달 시 /output/ 폴더 안의 내용만 전체 압축하여 전달

| type | 경로 | file | 설명 |
| ---- | ---- | ---- | ---- |
| css | /css/ | normalize.css<br>common.css<br>style.css | 초기화 css<br>공통 스타일<br>페이지별 스타일 |
| font | /css/fonts/ | | 국가별 언어 font 파일 |
| js | /js/ | commonJs.min.js |
| image | /images/ |
| html | /html/ |
| guide | /guide/ |

