import { Button, MessagePlugin, Tabs } from "tdesign-react";
import { Icon } from "tdesign-icons-react";
import { useEffect, useMemo, useState } from "react";
import { request } from "../../../utils/axios";
import {
  getPlatformBusinessDomainConfirmFileRequest,
  miniProgramBusinessDomainRequest,
  miniProgramServerDomainRequest,
  platformBusinessDomainRequest,
  platformServerDomainRequest,
} from "../../../utils/apis";
import { useSearchParams } from "react-router-dom";

const { TabPanel } = Tabs;

export default function ServiceDomainManage() {
  const [searchParams] = useSearchParams();
  const appId = useMemo(() => {
    return searchParams.get("appId");
  }, [searchParams]);

  const [tab, setTab] = useState(1);

  useEffect(() => {
    switch (tab) {
      case 1:
        getCurrentMiniProgramServerDomain();
        getPlatformServerDomain();
        break;
      case 2:
        getCurrentMiniProgramBusinessDomain();
        getPlatformBusinessDomain();
        break;
    }
  }, [tab]);

  const [currentMiniProgramServerDomain, setCurrentMiniProgramServerDomain] =
    useState<any>();

  const [currentPlatformServerDomain, setCurrentPlatformServerDomain] =
    useState<any>();
  const [editingPlatformServerDomain, setEditingPlatformServerDomain] =
    useState<any>();

  useEffect(() => {
    setEditingPlatformServerDomain(
      JSON.stringify(JSON.parse(currentPlatformServerDomain), null, 2)
    );
  }, [currentPlatformServerDomain]);

  const [invalidPlatformServerDomain, setInvalidPlatformServerDomain] =
    useState(false);
  useEffect(() => {
    try {
      const d = JSON.parse(editingPlatformServerDomain);
      setInvalidPlatformServerDomain(false);
    } catch (e) {
      setInvalidPlatformServerDomain(true);
    }
  }, [editingPlatformServerDomain]);

  const [
    currentMiniProgramBusinessDomain,
    setCurrentMiniProgramBusinessDomain,
  ] = useState<any>();

  const [currentPlatformBusinessDomain, setCurrentPlatformBusinessDomain] =
    useState<any>();
  const [editingPlatformBusinessDomain, setEditingPlatformBusinessDomain] =
    useState<any>();

  useEffect(() => {
    setEditingPlatformBusinessDomain(
      JSON.stringify(JSON.parse(currentPlatformBusinessDomain), null, 2)
    );
  }, [currentPlatformBusinessDomain]);

  const [invalidPlatformBusinessDomain, setInvalidPlatformBusinessDomain] =
    useState(false);
  useEffect(() => {
    try {
      const d = JSON.parse(editingPlatformBusinessDomain);
      setInvalidPlatformBusinessDomain(false);
    } catch (e) {
      setInvalidPlatformBusinessDomain(true);
    }
  }, [editingPlatformBusinessDomain]);

  const getCurrentMiniProgramServerDomain = async () => {
    const resp: any = await request({
      request: {
        url: `${miniProgramServerDomainRequest.url}?appid=${appId}`,
        method: miniProgramServerDomainRequest.method,
      },
      data: {
        action: "get",
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("小程序服务器域名获取成功");
      setCurrentMiniProgramServerDomain(resp.data);
    }
  };
  const getCurrentMiniProgramBusinessDomain = async () => {
    const resp: any = await request({
      request: {
        url: `${miniProgramBusinessDomainRequest.url}?appid=${appId}`,
        method: miniProgramBusinessDomainRequest.method,
      },
      data: {
        action: "get",
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("小程序业务域名获取成功");
      setCurrentMiniProgramBusinessDomain(resp.data);
    }
  };

  const getPlatformServerDomain = async () => {
    const resp: any = await request({
      request: platformServerDomainRequest,
      data: {
        action: "get",
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("三方平台服务器域名获取成功");
      setCurrentPlatformServerDomain(resp.data);
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };
  const getPlatformBusinessDomain = async () => {
    const resp: any = await request({
      request: platformBusinessDomainRequest,
      data: {
        action: "get",
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("三方平台业务域名获取成功");
      setCurrentPlatformBusinessDomain(resp.data);
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };

  const updatePlatformServerDomain = async () => {
    const resp: any = await request({
      request: platformServerDomainRequest,
      data: {
        action: "set",
        is_modify_published_together: true,
        wxa_server_domain: JSON.parse(editingPlatformServerDomain)
          .published_wxa_server_domain,
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("三方平台服务器域名更新成功");
      setCurrentPlatformServerDomain(resp.data);
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };

  const updatePlatformBusinessDomain = async () => {
    const resp: any = await request({
      request: platformBusinessDomainRequest,
      data: {
        action: "set",
        is_modify_published_together: true,
        wxa_jump_h5_domain: JSON.parse(editingPlatformBusinessDomain)
          .published_wxa_jump_h5_domain,
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("三方平台服务器域名更新成功");
      setCurrentPlatformBusinessDomain(resp.data);
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };

  const syncPlatformServerDomainToMiniProgram = async () => {
    if (!currentPlatformServerDomain) {
      MessagePlugin.error("请先获取平台服务器域名");
      return;
    }
    const domains =
      currentPlatformServerDomain.testing_wxa_server_domain.split(";");
    const resp: any = await request({
      request: {
        url: `${miniProgramServerDomainRequest.url}?appid=${appId}`,
        method: miniProgramServerDomainRequest.method,
      },
      data: {
        action: "set",
        downloaddomain: domains,
        requestdomain: domains,
        tcpdomain: [],
        udpdomain: [],
        uploaddomain: domains,
        wsrequestdomain: [],
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("同步成功");
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };
  const syncPlatformBusinessDomainToMiniProgram = async () => {
    if (!currentPlatformBusinessDomain) {
      MessagePlugin.error("请先获取平台服务器域名");
      return;
    }
    const domains =
      currentPlatformBusinessDomain.published_wxa_jump_h5_domain.split(";");
    const resp: any = await request({
      request: {
        url: `${miniProgramBusinessDomainRequest.url}?appid=${appId}`,
        method: miniProgramBusinessDomainRequest.method,
      },
      data: {
        action: "set",
        webviewdomain: domains,
      },
    });
    if (resp.code === 0) {
      MessagePlugin.success("同步成功");
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };

  const downloadFlatformBusinessDomainConfirmFile = async () => {
    // 下载文件
    const resp: any = await request({
      request: getPlatformBusinessDomainConfirmFileRequest,
      data: {},
    });
    if (resp.code === 0) {
      MessagePlugin.success("下载成功");
      const url = window.URL.createObjectURL(
        new Blob([resp.data], { type: "application/json" })
      );
      const link = document.createElement("a");
      link.style.display = "none";
    } else {
      MessagePlugin.error(resp.errmsg);
    }
  };

  return (
    <Tabs defaultValue={tab} onChange={(v) => setTab(v as number)}>
      <TabPanel label="服务器域名管理" value={1}>
        <div>
          <div>
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
              }}
            >
              <p className="desc">当前三方平台服务器域名</p>
              <Button
                type="button"
                shape="circle"
                style={{ marginLeft: "10px" }}
                onClick={getPlatformServerDomain}
              >
                <Icon name="refresh" />
              </Button>
              <Button
                type="button"
                shape="round"
                disabled={
                  editingPlatformServerDomain ===
                  JSON.stringify(
                    JSON.parse(currentPlatformServerDomain),
                    null,
                    2
                  )
                }
                style={{ marginLeft: "10px" }}
                onClick={updatePlatformServerDomain}
              >
                更新
              </Button>
            </div>
            <textarea
              style={{ minHeight: "300px", width: "100%" }}
              placeholder="请先获取"
              onChange={(event) => {
                console.log(event.target.value);
                const value = event.target.value;
                setEditingPlatformServerDomain(value);
              }}
              value={editingPlatformServerDomain}
            />
            {invalidPlatformServerDomain && (
              <p style={{ color: "red", fontSize: "8px" }}>
                输入JSON不规范，请检查
              </p>
            )}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
              }}
            >
              <p className="desc">当前小程序服务器域名</p>
              <Button
                type="button"
                shape="circle"
                style={{ marginLeft: "10px" }}
                onClick={getCurrentMiniProgramServerDomain}
              >
                <Icon name="refresh" />
              </Button>
            </div>
            <textarea
              style={{ minHeight: "300px", width: "100%" }}
              disabled
              placeholder="请先获取"
              onChange={() => {}}
              value={JSON.stringify(
                JSON.parse(currentMiniProgramServerDomain),
                null,
                2
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              disabled={
                JSON.stringify(currentPlatformServerDomain) ===
                editingPlatformServerDomain
              }
              onClick={syncPlatformServerDomainToMiniProgram}
            >
              同步三方平台服务器域名至小程序
            </Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel label="业务域名管理" key="2" value={2}>
        <div>
          <div>
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
              }}
            >
              <p className="desc">当前三方平台业务域名</p>
              <Button
                type="button"
                shape="circle"
                style={{ marginLeft: "10px" }}
                onClick={getPlatformBusinessDomain}
              >
                <Icon name="refresh" />
              </Button>
              <Button
                type="button"
                shape="round"
                disabled={
                  editingPlatformBusinessDomain ===
                  JSON.stringify(
                    JSON.parse(currentPlatformBusinessDomain),
                    null,
                    2
                  )
                }
                style={{ marginLeft: "10px" }}
                onClick={updatePlatformBusinessDomain}
              >
                更新
              </Button>
              <Button
                type="button"
                shape="round"
                style={{ marginLeft: "10px" }}
                onClick={downloadFlatformBusinessDomainConfirmFile}
              >
                下载域名验证文件
              </Button>
            </div>
            <textarea
              style={{ minHeight: "300px", width: "100%" }}
              placeholder="请先获取"
              onChange={(event) => {
                console.log(event.target.value);
                const value = event.target.value;
                setEditingPlatformBusinessDomain(value);
              }}
              value={editingPlatformBusinessDomain}
            />
            {invalidPlatformBusinessDomain && (
              <p style={{ color: "red", fontSize: "8px" }}>
                输入JSON不规范，请检查
              </p>
            )}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
              }}
            >
              <p className="desc">当前小程序业务域名</p>
              <Button
                type="button"
                shape="circle"
                style={{ marginLeft: "10px" }}
                onClick={getCurrentMiniProgramBusinessDomain}
              >
                <Icon name="refresh" />
              </Button>
            </div>
            <textarea
              style={{ minHeight: "300px", width: "100%" }}
              disabled
              placeholder="请先获取"
              onChange={() => {}}
              value={JSON.stringify(
                JSON.parse(currentMiniProgramBusinessDomain),
                null,
                2
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              disabled={
                JSON.stringify(currentPlatformBusinessDomain) ===
                editingPlatformBusinessDomain
              }
              onClick={syncPlatformBusinessDomainToMiniProgram}
            >
              同步三方平台业务域名至小程序
            </Button>
          </div>
        </div>
      </TabPanel>
    </Tabs>
  );
}
