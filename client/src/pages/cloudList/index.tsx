import ListItem from "tdesign-react/es/list/ListItem";
import styles from "./index.module.less";
import { Alert, List } from "tdesign-react";
import ListItemMeta from "tdesign-react/es/list/ListItemMeta";
import { useEffect, useState } from "react";
import { request } from "../../utils/axios";
import { getCloudEnvListRequest } from "../../utils/apis";

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

export default function CloudList() {
    const [envList, setEnvList] = useState<EnvType[]>([]);

    useEffect(() => {
        getEnvList();
    }, []);

    const getEnvList = async () => {
        const resp: any = await request({
            request: getCloudEnvListRequest,
            noNeedCheckLogin: true,
        });
        if (resp.code === 0) {
            console.log("response:", resp);
            setEnvList(resp.data);
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
