import { IRoute } from "../../commonType";
import CloudList from "../../pages/cloudList";

// 页面路由
export const customRoute: IRoute = {
    cloudDevelopment: {
        label: "云开发环境列表",
        path: "/cloudDevelopment",
        showPath: "/cloudDevelopment",
        element: <CloudList />,
    },
};
