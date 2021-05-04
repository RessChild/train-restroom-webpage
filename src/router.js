import BasicFrame from "./frames/BasicFrame/BasicFrame";

const frameRouter = [{
        path: '/',
        exact: false,
        component: BasicFrame,
    }
];

export { frameRouter }