const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

// CORS ( 외부 도메인 리소스에 접근을 허용 ) 세팅
module.exports = function(app) {
    // app.use(
    //     // 발동시킬 도메인 경로 ( ex. /server )
    //     process.env.API_PATH, 
    //     createProxyMiddleware({
    //         // 수정시킬 경로 ( ex. http://localhost:3001 )
    //         target: process.env.API_PROXY,
    //         changeOrigin: true,
    //       })
    // );
};