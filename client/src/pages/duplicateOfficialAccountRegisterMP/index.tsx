import ListItem from "tdesign-react/es/list/ListItem";
import styles from "./index.module.less";
import {
    Alert,
    Button,
    Divider,
    Input,
    List,
    MessagePlugin,
    Notification,
    NotificationPlugin,
} from "tdesign-react";
import ListItemMeta from "tdesign-react/es/list/ListItemMeta";
import { useEffect, useState } from "react";
import { request } from "../../utils/axios";
import {
    duplicateOfficialAccountRegisterMPRequest,
    getDuplicateOfficialAccountRegisterMPURLRequest,
} from "../../utils/apis";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

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

export default function DuplicateOfficalAccountRegisterMP() {
    const [searchParams] = useSearchParams();
    const ticket = searchParams.get("ticket");
    const [loading, setLoading] = useState(false);
    const [officialAccountAppId, setOfficialAccountAppId] = useState("");
    const getRegisterURL = async () => {
        setLoading(true);
        // 获取链接
        const resp: any = await request({
            request: getDuplicateOfficialAccountRegisterMPURLRequest,
            data: {
                appid: officialAccountAppId,
                redirect_uri: window.location.href,
            },
        });
        setLoading(false);
        if (resp.code === 0) {
            const url = resp.data;
            // 打开新的标签页到授权注册页面
            window.open(url, "_blank");
        } else {
            return MessagePlugin.error("获取授权地址失败", 2000);
        }
    };

    const register = async () => {
        setLoading(true);
        // 获取链接
        const resp: any = await request({
            request: duplicateOfficialAccountRegisterMPRequest,
            data: {
                ticket,
            },
        });
        setLoading(false);
        if (resp.code === 0) {
            return NotificationPlugin.success({
                title: "注册成功",
                content: JSON.stringify(resp.data, null, 2),
                closeBtn: true,
            });
        } else {
            return MessagePlugin.error("获取授权地址失败", 2000);
        }
    };

    return (
        <div className={styles.cloudList}>
            <p className="text">复用公众号资质注册流程</p>
            <div className="desc">
                <p>
                    1、服务商按照指引拼接链接，作为发起页，商家访问后跳转至微信公众平台指定授权注册页面。
                </p>
                <p>2、公众号管理员扫码确认复用公众号资质快速注册小程序。</p>
                <p>
                    3、管理员扫码验证通过后跳转至第三方平台页面，微信将注册结果返回给第三方平台。
                </p>
            </div>
            <Divider />
            <p className="text">当前公众号appId：</p>
            <p className="desc">{officialAccountAppId || "空"}</p>
            <Divider />
            <Input
                style={{ margin: "20px 0" }}
                placeholder="公众号appId"
                value={officialAccountAppId}
                onChange={(e) => setOfficialAccountAppId(e.toString())}
            />
            <div
                style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "space-evenly",
                }}
            >
                <Button
                    type="button"
                    loading={loading}
                    onClick={() => getRegisterURL()}
                >
                    前往授权
                </Button>

                {ticket && (
                    <Button
                        type="button"
                        loading={loading}
                        onClick={() => register()}
                    >
                        注册小程序
                    </Button>
                )}
            </div>
        </div>
    );
}
