import BasicFrame from "./frames/BasicFrame/BasicFrame";
import IdentifyFrame from "./frames/IdentifyFrame/IdentifyFrame";

const defaultFrameRoutePath = `/identify`

const frameRoute = [
    {
        key: "identifyFrame",
        path: "/identify",
        exact: true,
        component: IdentifyFrame,
    },
    {
        key: "basicFrame",
        path: "/back-office",
        exact: false,
        component: BasicFrame,
    }
];

export { defaultFrameRoutePath, frameRoute };