import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Box, Button, TextField } from "@material-ui/core";

import { HiOutlineIdentification } from "react-icons/hi";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";
import request from "../../request";

import "../DefaultFrame.css";
import "./IdentifyFrame.css";

const IdentifyFrame = ({ history }) => {
    
    // const request = setBaseURL();

    // 화면 구성용 변수
    const [ isLoading, setIsLoading ] = useState(false);
    const [ pw, setPw ] = useState('');

    // 입력 (input)
    const onChangePw = ({ currentTarget: { value }}) => setPw(value);

    // 제출버튼
    const onClickSubmit = async () => {
        setIsLoading(true);
        try {
            // 암호 확인
            const result = await request.post('/back-office', { pw });
            const { data: { login, jwt }} = result;
            // console.log(result, login, jwt);
            if( login && jwt ) {
                // console.log(jwt);
                sessionStorage.setItem('jwt', jwt); // jwt 정보 저장
                history.push('/back-office');
            }
            else {
                alert('비밀번호가 틀렸습니다. 다시 시도해주세요');
                setPw('');
                setIsLoading(false);
            }
        } catch (e) {
            setIsLoading(false);
            alert('로그인 시도 중, 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            console.log("login page error", e);
            // throw new Error('login page error');
        }
    }

    // 로그인 여부 확인
    useEffect(() => {
        // 이미 로그인한 경우, 건너뜀
        // sessionStorage.removeItem('jwt');
        const jwt = sessionStorage.getItem('jwt');
        if( jwt ) history.replace('/back-office');
    }, [history]);

    return <Box className="frame identify-frame">
        { isLoading && <LoadingFilter /> }
        <Box className="page-intro">- 지하철 화장실 Back Office -</Box>
        <Box className="page-action">
            <TextField className="password-field" variant="outlined" type="password" size="small" InputProps={{ value: pw }} onChange={onChangePw} />
            <Button variant="contained" color="primary" disabled={!pw} onClick={onClickSubmit} startIcon={<HiOutlineIdentification size="1.75rem"/>}>
                확인
            </Button>
        </Box>
    </Box>
};

export default IdentifyFrame;