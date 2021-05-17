// import { GoMailRead, GoMail, GoCheck } from "react-icons/go"
import { MdNewReleases } from "react-icons/md";

const readFilter = {
    true: <></>,
    false: <MdNewReleases size="0.9rem" color="orange" />
}

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
        key: "exitNo",
        name: "출구 번호"
    }, 
    { 
        key: "gateInotDvNm",
        name: "출구 안/밖"
    }
];
