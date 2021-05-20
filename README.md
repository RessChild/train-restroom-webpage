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
    다만, 현재는 페이지 기본값이 0부터 카운팅하는 방식이라, 문제가 생기면 수정 필요
  - isClear 삭제 ( isRead 정보로 처리여부 통합 )
  - 체크 리스트와 연관된 액션버튼 구현 ( 업데이트 기능까진 OK )
8. 2021/05/18
  - 페이지 크기에 따라서 y축은 스크롤로 바뀌도록 수정함.
    근데 일부 위쪽 정보가 좀 잘리는 듯? 그래서 일단은 보류 (원상복구)
    x축도 스크롤형태로 바꿔보려고 했는데, 왼쪽사이드, 오른쪽사이드의 width 옵션이 충돌남
  - basicFrame 의 router 의 모든 path 앞에 기본 path 붙여서 수정할 것
9. 2021/05/19
  - 각 frame.css 에서 .frame 이란 class 명이 겹치니까 문제가 생김
    css 별로 따로 참고 되는 줄 알았는데, 그게 아닌 것 같음.
    so, 공용속성은 public css로 빼내서 선언하고, 세부적인 값 조정은 다른 명칭을 사용하도록 수정
  - basicFrame 에서 path 명 수정 ( map 구조로 만들어서 반환 )
10. 2021/05/20
  - jwt 관련 작성 시작
    최상단 frame 에서 jwt를 보관하고, 하위 view 로 값을 내려보내고 싶은데, jwt 만료기간이 다 되서 새 값으로 갱신할 때 처리가 필요함
    sessionStorage 에서 저장하고 관리중이라, 해당 값이 바뀔때 useEffect로 자동갱신은 안됨
    so, 상위에서 값을 관리할려면 값을 바꾸는 함수가 따로 필요함
  - 일단은 각 view 에서 jwt 를 sessionStorage 에서 받아와서 사용하는형태로

# 해야할 것
- 페이지마다 15개씩 쪼개서 처리
   + 읽음표시랑, 처리표시랑 합치기 (isRead, isClear 중 하나 선택) OK
- 처리 완료 여부는 수동으로 판단 OK
- frame 의 기본높이값이 100vw, 100vh 기준이다보니, 창이 작아지면 형태가 깨짐
  so, min-width / min-height 로 변경하는 절차가 필요할 듯 OK
- 요청 삭제기능이 굳이 필요할까?

# 코딩 TMI
- react-router-dom 의 경우, exact 가 붙으면 하위 컴포넌트의 routing 에서 문제가 생길 수 있음
  ( exact 를 사용하는 경우, parmas 가 있는지 없는지 명확히 적어줘야 함 )
- css 의 fixed 는 최상위 window 를 기점으로 잡음.
  absolute 는 relative 설정된 컴포넌트 정보를 따라감 (기본은 window)