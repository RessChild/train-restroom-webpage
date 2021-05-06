import { MdCreateNewFolder } from "react-icons/md";
import { GoReport } from "react-icons/go";

import AddListView from "../../views/AddListView/AddListView";
import ReportListView from "../../views/ReportListView/ReportListView";

const defaultBasicFramePath = '/add-list'

const basicFrameRoute = [
    {
        key: "addRequest",
        title: '추가 요청',
        icon: MdCreateNewFolder,
        path: '/add-list',
        exact: true,
        component: AddListView,
    },
    {
        key: "reportRequest",
        title: "수정 요청",
        icon: GoReport,
        path: '/report-list',
        exact: true,
        component: ReportListView,
    }
];

export { defaultBasicFramePath, basicFrameRoute };