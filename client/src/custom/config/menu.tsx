import * as Icon from "tdesign-icons-react";
import { IMenuList } from "../../commonType";
import { customRoute as routes } from "./route";

// 页面menu
export const customMenuList: IMenuList = [
    {
        label: "云开发",
        icon: <Icon.CloudIcon />,
        item: [routes.cloudDevelopment],
    },
    {
        label: "代注册小程序",
        icon: <Icon.CloudIcon />,
        item: [
            routes.duplicateOfficalAccountRegisterMP,
            routes.exchangeAdmin,
            routes.fasterRegisterMP,
        ],
    },
];
