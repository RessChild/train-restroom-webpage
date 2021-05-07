# train-restroom-webpage
- 철도 화장실 정보 어플용 백오피스
- ReactJs hook

# 설치 모듈
- create-react-app 기반으로 생성
- react-router-dom
- material-ui, @material-ui/core
- react-icons
- react-spinners-css

# 진행사항
1. 2021/05/04
  - 구조 변경하면서, 프로젝트를 새로 구축함
  - 리스트 기본형태 작성
  - 모듈 설치 및 라우터 형태 구룩
2. 2021/05/05
  - route, router 명칭 확립
  - 메뉴 클릭 이벤트 작성 및 key 값 부여
  - 선택된 메뉴에 대한 버튼 형태를 수정할 계획
3. 2021/05/06
  - 메뉴 클릭이 안된 경우, 선택된 메뉴값을 기본으로 설정해주는 과정 구성
  - router view css 작성
4. 2021/05/08
  - material-ui 의 table 을 기반으로 목록 출력
  - 로딩시 사용할 이벤트 방지용 필터 컴포넌트 구성 ( LoadingFilter.js )
    로딩 애니메이션에 react-spinners-css 사용 ( https://github.com/JoshK2/react-spinners-css )