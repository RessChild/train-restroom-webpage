import { MdNewReleases } from "react-icons/md";

const readFilter = {
    true: <></>,
    false: <MdNewReleases size="0.9rem" color="orange" />
}

const typeFilter = {
    0: "출구 정보가 다름",
    1: "개찰구 안/밖의 정보가 다름",
    2: "화장실이 존재하지 않음",
    3: "기타",
};

export const tableColumn = [
    {
        key: "isRead",
        name: "",
        filter: readFilter,
        padding: "checkbox"
    },
    {
        key: "createdAt",
        name: "작성일자"
    },
    {
        key: "stinNm",
        name: "역 이름"
    },
    {
        key: "type",
        name: "분류",
        filter: typeFilter
    },
    {
        key: "detail",
        name: "상세 내용"
    }
];