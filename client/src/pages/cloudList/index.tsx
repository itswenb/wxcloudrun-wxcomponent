import ListItem from "tdesign-react/es/list/ListItem";
import styles from "./index.module.less";
import { Alert, List } from "tdesign-react";
import ListItemMeta from "tdesign-react/es/list/ListItemMeta";
import { useEffect, useState } from "react";
import { request } from "../../utils/axios";
import {
    getAuthorizedAccountRequest,
    getCloudEnvListRequest,
} from "../../utils/apis";

// {
//         "env": "test2-4a89da",
//         "alias": "test2",
//         "create_time": "2020-04-04 14:10:28",
//         "update_time": "2020-04-04 14:10:36",
//         "status": "NORMAL",
//         "package_id": "basic",
//         "package_name": "基础版 1",
//         "dbinstance_id": "tnt-fpbvu9gpc",
//         "bucket_id": "6d79-myttest3-9gyi5pwab13c4d59-1304480914"
//     }
interface EnvType {
    env: string;
    alias: string;
    create_time: string;
    update_time: string;
    status: string;
    package_id: string;
    package_name: string;
    dbinstance_id: string;
    bucket_id: string;
}
const pageSize = 10;
export default function CloudList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [accountList, setAccountList] = useState([]);
    const [accountTotal, setAccountTotal] = useState(0);

    const [envList, setEnvList] = useState<EnvType[]>([]);

    useEffect(() => {
        getAccountList();
    }, []);

    const getEnvList = async () => {
        const resp: any = await request({
            request: getCloudEnvListRequest,
            data: {
                appid: [accountList.map((item: any) => item.appid)],
                source_type: 0,
            },
        });
        if (resp.code === 0) {
            console.log("response:", resp);
            setEnvList(resp.data);
        }
    };

    const getAccountList = async () => {
        const resp: any = await request({
            request: getAuthorizedAccountRequest,
            data: {
                offset: (currentPage - 1) * pageSize,
                limit: pageSize,
            },
        });
        console.log("getAccountList resp: ", resp);

        if (resp.code === 0) {
            setAccountList(resp.data.records);
            setAccountTotal(resp.data.total);
        }
    };

    return (
        <div className={styles.cloudList}>
            <p>云开发环境列表</p>
            <List layout="horizontal" size="large" split>
                {envList.map((item) => {
                    return (
                        <ListItem key={item.env}>
                            <ListItemMeta
                                description={item.env}
                                image="https://tdesign.gtimg.com/list-icon.png"
                                title={`${item.env} ${item.package_name}(${item.alias})`}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
