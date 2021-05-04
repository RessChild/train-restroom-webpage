import { MdCreateNewFolder } from "react-icons/md";

const defaultBasicFramePath = '/add-list'

const basicFrameRouter = [
    {
        title: '추가 요청',
        icon: MdCreateNewFolder,
        path: '/add-list',
        exact: false,
        component: null,
    },
    {
        title: "수정 요청",
        icon: MdCreateNewFolder,
        path: '/report-list',
        exact: false,
        component: null,
    }
];

export { defaultBasicFramePath, basicFrameRouter };