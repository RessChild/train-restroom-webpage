import BasicFrame from "./frames/BasicFrame/BasicFrame";

const defaultFrameRoutePath = '/'

const frameRoute = [
    {
        key: "basicFrame",
        path: '/',
        exact: false,
        component: BasicFrame,
    }
];

export { defaultFrameRoutePath, frameRoute };