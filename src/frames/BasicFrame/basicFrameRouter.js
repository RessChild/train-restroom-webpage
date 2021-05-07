import { MdCreateNewFolder } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { GrUpdate } from "react-icons/gr";

import AddListView from "../../views/AddListView/AddListView";
import ReportListView from "../../views/ReportListView/ReportListView";
import UpdateView from "../../views/UpdateView/UpdateView";

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
    },
    {
        key: "updateData",
        title: 'DB 갱신',
        icon: GrUpdate,
        path: '/update-data',
        exact: true,
        component: UpdateView,        
    }
];

export { defaultBasicFramePath, basicFrameRoute };