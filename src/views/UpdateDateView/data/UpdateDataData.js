const readFilter = {
    true: <></>,
    false: <></>,
}

const typeFilter = {
    0: "출구 정보가 다름",
    1: "개찰구 안/밖의 정보가 다름",
    2: "화장실이 존재하지 않음",
    3: "기타",
};

export const tableColumn = [
    {
        key: "dtlLoc",
        name: "가까운 출구",
    },
    {
        key: "exitNo",
        name: "출구 번호"
    },
    {
        key: "gateInotDvNm",
        name: "게이트 안/밖"
        // 가질 수 있는 값은 내,외
    },
    {
        key: "grndDvNm",
        name: "지상/지하"
        // 지상, 지하
    },
    {
        key: "mlFmlDvNm",
        name: "공용 여부"
        // 공용, 남자, 여자
    },
    {
        key: "stinFlor",
        name: "층 수",
        // 숫자 값
    },
];

/*
diapExchNum: null
dtlLoc: "1,2번출구"
exitNo: "1"
gateInotDvNm: "외"
grndDvNm: "지하"
mlFmlDvNm: "공용"
station: "606d607f1712073c30763d57"
stinFlor: 1
toltNum: null
__v: 0
_id: "607e7271a477192a94b9191f"
*/