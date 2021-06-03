const gateOpt = [
    { name: "내", value: "내" },
    { name: "외", value: "외" },
];
const groundOpt = [
    { name: "지상", value: "지상" },
    { name: "지하", value: "지하" },
];
const genderOpt = [
    { name: "남자", value: "남자" },
    { name: "여자", value: "여자" },
    { name: "공용", value: "공용" },
];

const tableColumn = [
    {
        key: "dtlLoc",
        name: "가까운 출구",
    },
    {
        key: "exitNo",
        name: "출구 번호"
    },
    {
        key: "stinFlor",
        name: "층 수",
        // 숫자 값
    },
    {
        key: "gateInotDvNm",
        name: "게이트 안/밖",
        option: gateOpt,
        // 가질 수 있는 값은 내,외
    },
    {
        key: "grndDvNm",
        name: "지상/지하",
        option: groundOpt,
        // 지상, 지하
    },
    {
        key: "mlFmlDvNm",
        name: "공용 여부",
        option: genderOpt,
        // 공용, 남자, 여자
    },
];

// 화면 출력을 위해, 일정 단위로 정보를 쪼개서 제공
const SPLIT_NUM = 3;
const splitColumn = () => {
    let new_table = [];
    for(let k=0; k < tableColumn.length; k += SPLIT_NUM)
        new_table.push( tableColumn.slice(k, k + SPLIT_NUM) );
    return new_table;
}
export const splitedTableColumn = splitColumn();

// 새 값을 넣기위한 초기 세팅형태
export const DEFAULT_ID = 'NEW_RESTROOM';
const createNewRestroom = () => {
    return tableColumn.reduce((acc, { key }) => ({ ...acc, [key]: "" }) , { _id: DEFAULT_ID, isChanged: true });
};
export const initTableColumn = createNewRestroom();

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