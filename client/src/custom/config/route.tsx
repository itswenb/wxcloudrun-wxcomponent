import { IRoute } from "../../commonType";
import CloudList from "../../pages/cloudList";
import DuplicateOfficalAccountRegisterMP from "../../pages/duplicateOfficialAccountRegisterMP";
import ExchangeAdmin from "../../pages/exchangeMPAdmin";
import FasterRegisterMP from "../../pages/fasterRegisterMP";

// 页面路由
export const customRoute: IRoute = {
    cloudDevelopment: {
        label: "云开发环境列表",
        path: "/cloudDevelopment",
        showPath: "/cloudDevelopment",
        element: <CloudList />,
    },
    duplicateOfficalAccountRegisterMP: {
        label: "复用公众号资质注册",
        path: "/duplicateOfficalAccount",
        showPath: "/duplicateOfficalAccount",
        element: <DuplicateOfficalAccountRegisterMP />,
    },
    exchangeAdmin: {
        label: "小程序管理员绑定/换绑",
        path: "/exchangeAdmin",
        showPath: "/exchangeAdmin",
        element: <ExchangeAdmin />,
    },
    fasterRegisterMP: {
        label: "快速注册",
        path: "/fasterRegister",
        showPath: "/fasterRegister",
        element: <FasterRegisterMP />,
    },
};
