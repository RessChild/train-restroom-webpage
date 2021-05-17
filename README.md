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
5. 2021/05/10
  - 체크박스 설정 + 로딩화면 설정
  - report-list 도 형태 잡아놓고 띄워놓기 까진 끝
6. 2021/05/14
  - 아이콘 배치 (필터용)
7. 2021/05/17
  - 페이지 이동버튼 구현
  - isClear 삭제 ( isRead 정보로 처리여부 통합 )
  - 체크 리스트와 연관된 액션버튼 구현 시작

# 해야할 것
- 페이지마다 15개씩 쪼개서 처리
   + 읽음표시랑, 처리표시랑 합치기 (isRead, isClear 중 하나 선택) OK
- 처리 완료 여부는 수동으로 판단
- frame 의 기본높이값이 100vw, 100vh 기준이다보니, 창이 작아지면 형태가 깨짐
  so, min-width / min-height 로 변경하는 절차가 필요할 듯

# 코딩 TMI
- react-router-dom 의 경우, exact 가 붙으면 하위 컴포넌트의 routing 에서 문제가 생길 수 있음
  ( exact 를 사용하는 경우, parmas 가 있는지 없는지 명확히 적어줘야 함 )
- css 의 fixed 는 최상위 window 를 기점으로 잡음.
  absolute 는 relative 설정된 컴포넌트 정보를 따라감 (기본은 window)