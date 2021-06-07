# train-restroom-webpage
- 철도 화장실 정보 어플용 백오피스
- ReactJs hook
- /src/request.js 내의 변수값을 변경할 것

# 실행 명령
- npm run-script pm2 
- [ pm2 serve build/ 포트_번호 ]

# 설치 모듈
- create-react-app 기반으로 생성
- react-router-dom
- material-ui, @material-ui/core
- react-icons
- react-spinners-css
- serve
- http-proxy-middleware
- pm2
- dotenv

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
  - 일단은 각 view 에서 jwt 를 sessionStorage 에서 받아와서 사용하는 형태로 구현
11. 2021/05/24
  - edit 기능 관련 구축 ( UpdateDataView )
12. 2021/05/25
  - 관리 회사정보도 같이 필터링 해야할 듯
  - operation 정보로 데이터 불러오도록 수정
13. 2021/05/27
  - 전반적인 css 까진 손봄 ( tableColumn 을 보기 좋도록 일정 갯수로 끊어서 사용 )
  - 서버쪽으로 넘어가는 데이터를 url 이 아니라 body 로 넣어 받도록 수정
  - 실제 서버쪽 수정기능 작성 ( 진행 중 )
14. 2021/05/28
  - 화장실 정보 수정하는 기능 진행 중
    새 화장실 정보를 추가하는 폼까진 구성했으나, 빈 _id 값 세팅문제 + 키값 충돌 해결해야 함
15. 2021/05/31
  - upsert로 없는 값은 새롭게 추가까진 됨
    다만, station 정보가 기본 정보엔 없어서, 함께 넣어줘야 함
    ==> 문제가 발생해서 수정 필요함 OK
  - 값 업데이트 + 없는 정보 추가하기 완료
  - 정보가 바뀐 경우, 아이콘으로 표기하도록 기능 개선
    해당 기능이 추가되면서, axios로 넘어갈 수 있는 불필요한 정보도 안넘어가도록 수정
  - pm2로 돌려보려고 하는 중인데, 잘 안됨 
    ( https://kyeahen.github.io/react.js/React.js-pm2%EB%A1%9C-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%AC%B4%EC%A4%91%EB%8B%A8-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0/ )
16. 2021/06/02
  - 데이터 수정 아이콘 관련해서 조금 수정이 필요함
    ( 서버쪽 수정이 완료된 경우에도 해당 아이콘을 바꿔주도록 개선이 필요 )
  - 추가된 정보의 삭제 기능 추가
  - '요구사항 삭제' 버튼은 불필요하다 판단되어 임시로 주석처리
17. 2021/06/03
  - react 웹서버 배포 
    ( https://codechacha.com/ko/deploy-react-with-nginx/ )
  - nginx 대신에 serve 랑 build 사용해서 해결 할 수 있을 것 같음
    ( https://bziwnsizd.tistory.com/m/43?category=729521 )
  - 근데 서버 관련해서 적용이 잘 안되는 것 같음.
    ( https://hello-bryan.tistory.com/122 )
  - https://chaewonkong.github.io/posts/express-with-react.html
18. 2021/06/04
  - 네트워크 관련 ( https://pm2.keymetrics.io/docs/usage/expose/#serving-spa-redirect-all-to-indexhtml )
    --spa 는 다른 웹페이지 정보를 불러오는 것으로 보임. 반환값이 html 형태
  - 지금 npm build 로 나온 결과물은 routing 도 딱히 안되는 것 같음. 다른 방식을 찾아야 할듯.
  - 파일 자체를 찾아가는 방식은 어떠냔 제안이 왔는데, 안될 것 같음.
    react 기반으로 돌아가다보니, 내부적으로 처리하는 부분도 많고, 메인이 되는 페이지는 강제접근하면 빈 화면으로 보임
19. 2021/06/07
  - 서버에서 cors 옵션을 추가하고, 바로 url을 작성하는 형태로 진행하면 가능함
  - 그래서 dotenv 를 섞어서 axios.baseURL 을 수정하는 작업을 진행중인데, 
    .env 파일을 읽는 시간이 좀 걸리는지, 자꾸 undefined 가 발생함
  - 꺙으로 적는 수 밖에 없는건가?
    ==> 그냥 서버 내에서 값을 변경시키는 방향으로 진행하자.
    
# 해야할 것
- 페이지마다 15개씩 쪼개서 처리
   + 읽음표시랑, 처리표시랑 합치기 (isRead, isClear 중 하나 선택) OK
- 처리 완료 여부는 수동으로 판단 OK
- frame 의 기본높이값이 100vw, 100vh 기준이다보니, 창이 작아지면 형태가 깨짐
  so, min-width / min-height 로 변경하는 절차가 필요할 듯 OK
- 요청 삭제기능이 굳이 필요할까?
- 권한 만료 확인하는 구간이 계속 반복됨
  so, 나중에 따로 함수로 빼서 작성해야할 듯

# 코딩 TMI
- react-router-dom 의 경우, exact 가 붙으면 하위 컴포넌트의 routing 에서 문제가 생길 수 있음
  ( exact 를 사용하는 경우, parmas 가 있는지 없는지 명확히 적어줘야 함 )
- css 의 fixed 는 최상위 window 를 기점으로 잡음.
  absolute 는 relative 설정된 컴포넌트 정보를 따라감 (기본은 window)
- axios 에서 catch 로 잡힌 정보는 e.response 에 담겨있음
  so, 서버에서 status(401)이랑 같이 넣은 에러 정보는 e.response.data 에서 탐색 가능
- package.json 에서 다수의 proxy를 설정할 때는, 각 경로에 대해 { target: "proxy 주소" } 형태의 객체를 대입해야 함
