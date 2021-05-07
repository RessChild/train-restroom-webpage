import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import "../DefaultView.css";
import "./AddListView.css";

// 추가요청 정리 리스트
const AddListView = () => {

    const tableColumn = [
        {
            key: "stinNm",
            name: "역 이름"
        },
        {
            key: "exitNo",
            name: "출구 번호"
        }, 
        { 
            key: "gateInotDvNm",
            name: "출구 안/밖"
        }
    ];

    const source = axios.CancelToken.source();
    const [ addList, setAddList ] = useState([]); // 추가요청 리스트

    const axiosRequest = async () => {
        try {
            const { data } = await axios.post('/back-office/add-list', {}, { cancelToken: source.token });
            console.log(data);
            setAddList(data);
        } catch (e) {
            console.log("addListView error:", e);
        }
    }

    // 초기에 리스트 로딩
    useEffect(() => {
        axiosRequest();
        return () => { // axios 요청 취소
            source.cancel();
        }
    }, []);

    // 고민해야할 부분
    // 1. 로딩중인 경우
    // 2. 요청 리스트가 없는 경우
    return <>
        { false && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="opt-bar">
                <Box>뭔가 검색관련</Box>
                <Box>툴이 들어갈 공간</Box>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead className="table-header">
                        <TableRow>
                            {/* <TableCell padding="checkbox"></TableCell> */}
                            { tableColumn.map( column => <TableCell className="table-header-cell" key={`head-${column.key}`} align="center">{ column.name }</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {
                            addList.map( add => <TableRow className="table-body-row" key={`row-${add._id}`}>
                                { tableColumn.map( column => <TableCell key={`row-${add._id}-${column.key}`}>{ add[column.key] }</TableCell>) }
                            </TableRow> )
                        }
                        {/* <TableRow className="list-table-body">
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>ㅇㅁㅇ!</TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>;
};

export default AddListView;