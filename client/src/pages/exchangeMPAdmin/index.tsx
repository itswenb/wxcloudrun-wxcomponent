import styles from "./index.module.less";
import {
    Button,
    Divider,
    Input,
    MessagePlugin,
    NotificationPlugin,
} from "tdesign-react";
import { useState } from "react";
import { request } from "../../utils/axios";
import {
    duplicateOfficialAccountRegisterMPRequest,
    exchangeMPAdminURLRequest,
    getDuplicateOfficialAccountRegisterMPURLRequest,
    getExchangeMPAdminURLRequest,
} from "../../utils/apis";
import { useSearchParams } from "react-router-dom";

export default function ExchangeAdmin() {
    const [searchParams] = useSearchParams();
    const taskid = searchParams.get("taskid");
    const [loading, setLoading] = useState(false);
    const [officialAccountAppId, setOfficialAccountAppId] = useState("");

    const getExchangeURL = async () => {
        setLoading(true);
        // 获取链接
        const resp: any = await request({
            request: getExchangeMPAdminURLRequest,
            data: {
                appid: officialAccountAppId,
                // 需要 url encode
                redirect_uri: window.location.href,
            },
        });
        setLoading(false);
        if (resp.code === 0) {
            const url = resp.data;
            // 打开新的标签页到授权注册页面
            window.open(url, "_blank");
        } else {
            return MessagePlugin.error("获取换绑地址失败", 2000);
        }
    };

    const exchange = async () => {
        setLoading(true);
        // 获取链接
        const resp: any = await request({
            request: exchangeMPAdminURLRequest,
            data: {
                taskid,
                appid: officialAccountAppId,
            },
        });
        setLoading(false);
        if (resp.code === 0) {
            return NotificationPlugin.success({
                title: "换绑成功",
                content: JSON.stringify(resp.data, null, 2),
                closeBtn: true,
            });
        } else {
            return MessagePlugin.error("换绑失败", 2000);
        }
    };

    return (
        <div className={styles.cloudList}>
            <p className="text"> 换绑小程序管理员流程</p>
            <div className="desc">
                <p>
                    1、从第三方平台页面发起，并跳转至微信公众平台指定换绑页面。
                </p>
                <p>2、小程序原管理员扫码，并填写原管理员身份证信息确认。</p>
                <p>
                    3、填写新管理员信息(姓名、身份证、手机号)，使用新管理员的微信确认。
                </p>
                <p>
                    4、点击提交后跳转至第三方平台页面，第三方平台回调对应
                    api完成换绑流程。
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
                    disabled={!officialAccountAppId}
                    loading={loading}
                    onClick={() => getExchangeURL()}
                >
                    前往换绑
                </Button>

                {taskid && (
                    <Button
                        type="button"
                        disabled={!officialAccountAppId}
                        loading={loading}
                        onClick={() => exchange()}
                    >
                        提交变更
                    </Button>
                )}
            </div>
        </div>
    );
}
