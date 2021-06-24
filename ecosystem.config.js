// pm2 의 프로그램 실행 설정 파일
module.exports = {
    apps: [
      {
        name: 'train-restroom-admin',
        script: './build/index.html', // 실행할 스크립트
        instances: 0,
        exec_mode: `cluster`, // 어플리케이션 실행 모드
        env: {
          NODE_PORT: "5000",
        }
      }
    ]
  };