import { useRef, useState } from "react";
import styles from "./index.module.less";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  MessagePlugin,
  NotificationPlugin,
  Select,
  Tabs,
} from "tdesign-react";
import {
  fastRegisterMPRequest,
  fastRegisterMPStatusRequest,
} from "../../utils/apis";
import { request } from "../../utils/axios";
const { FormItem } = Form;
const { Option } = Select;
const { TabPanel } = Tabs;

export default function FasterRegisterMP() {
  const [tab, setTab] = useState(1);

  return (
    <div className={styles.cloudList}>
      <Tabs defaultValue={tab} onChange={(v) => setTab(v as number)}>
        <TabPanel
          label="快速注册小程序"
          value={1}
          style={{ padding: "20px 0" }}
        >
          <RegisterView />
        </TabPanel>
        <TabPanel label="查询注册进度" value={2} style={{ padding: "20px 0" }}>
          <CheckRegisterView />
        </TabPanel>
      </Tabs>
    </div>
  );
}

function CheckRegisterView() {
  const formRef = useRef<FormInstance>();

  const handleSubmit = async (submitValues: any) => {
    if (submitValues.validateResult !== true) {
      console.error("验证表单失败", submitValues);
    } else {
      const params = formRef.current && formRef.current.getAllFieldsValue();
      const res = await request({
        request: fastRegisterMPStatusRequest,
        data: params,
      });
      if (res.code === 0) {
        NotificationPlugin.success({
          title: "查询成功",
          content: JSON.stringify(res.data, null, 2),
          closeBtn: true,
        });
      } else {
        console.error("查询失败", res);
        MessagePlugin.error("查询失败", 2000);
      }
    }
  };
  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      labelAlign="left"
      showErrorMessage
      scrollToFirstError="smooth"
    >
      <FormItem
        label="企业名"
        name="name"
        rules={[{ required: true, message: "企业名必填", type: "error" }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="法人微信号"
        name="legal_persona_wechat"
        rules={[{ required: true, message: "法人微信号必填", type: "error" }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="法人姓名"
        name="legal_persona_name"
        rules={[{ required: true, message: "法人姓名必填", type: "error" }]}
      >
        <Input />
      </FormItem>

      <FormItem>
        <Button type="submit">查询</Button>
      </FormItem>
    </Form>
  );
}

function RegisterView() {
  const formRef = useRef<FormInstance>();

  const handleSubmit = async (submitValues: any) => {
    if (submitValues.validateResult !== true) {
      console.error("验证表单失败", submitValues);
    } else {
      const params = formRef.current && formRef.current.getAllFieldsValue();
      const res = await request({
        request: fastRegisterMPRequest,
        data: params,
      });
      if (res.code === 0) {
        NotificationPlugin.success({
          title: "创建成功",
          content: JSON.stringify(res.data, null, 2),
          closeBtn: true,
        });
      } else {
        console.error("查询失败", res);
        NotificationPlugin.error({
          title: "创建失败",
          content: JSON.stringify(res.data, null, 2),
          closeBtn: true,
        });
      }
    }
  };

  return (
    <>
      <p className="text">快速注册企业小程序</p>
      <div className="desc">
        <ol>
          <li>
            权限集准备：
            <p>
              第三方平台需具有以下权限集。 小程序开发与数据分析 - 18
              开放平台账号管理权限 - 25 小程序基本信息管理 30 获取小程序码 17
              小程序插件管理 40
            </p>
          </li>
          <li>
            收集信息
            <p>
              收集法人微信、法人姓名、企业名称、信用代码四个商户信息外加第三方客服电话，方便商家与第三方联系（建议填写第三方客服电话）；
            </p>
          </li>
          <li>
            信息核实
            <p>
              企业名称需与工商部门登记信息一致；法人姓名与绑定微信银行卡的姓名一致。信息收集时要确保四个信息的对应关系，否则接口无法成功调用。
            </p>
          </li>
          <li>
            调接口注册小程序
            <p>
              接口文档请查看快速注册小程序
              在接口调用成功后，通过法人&amp;企业主体校验，平台向法人微信下发模板消息。法人需在24
              小时内点击消息，进行身份证信息与人脸识别信息收集；
            </p>
          </li>
          <li>
            人脸识别认证
            <p>
              验证通过后，即可创建已认证的小程序。第三方平台服务器可以收到创建
              appid 信息（通过授权事件接收 URL 接收信息）；
            </p>
          </li>
          <li>
            代商家进行小程序开发
            <p>
              第三方获得小程序 appid
              后，可调用代码开发相关接口，完成后续的小程序代码开发.
            </p>
          </li>
        </ol>
      </div>
      <Divider />
      <p className="text">企业信息：</p>
      <Form ref={formRef} onSubmit={handleSubmit} labelAlign="left">
        <FormItem
          label="企业名"
          name="name"
          rules={[{ required: true, message: "企业名必填", type: "error" }]}
        >
          <Input />
        </FormItem>

        <FormItem
          label="企业代码"
          name="code"
          rules={[{ required: true, message: "企业代码必填", type: "error" }]}
        >
          <Input />
        </FormItem>

        <FormItem
          label="企业代码类型"
          name="code_type"
          rules={[
            { required: true, message: "企业代码类型必填", type: "error" },
          ]}
        >
          <Select defaultValue={1}>
            <Option value={1}>统一社会信用代码</Option>
            <Option value={2}>组织机构代码</Option>
            <Option value={3}>营业执照注册号</Option>
          </Select>
        </FormItem>

        <FormItem
          label="法人微信号"
          name="legal_persona_wechat"
          rules={[{ required: true, message: "法人微信号必填", type: "error" }]}
        >
          <Input />
        </FormItem>

        <FormItem
          label="法人姓名"
          name="legal_persona_name"
          rules={[{ required: true, message: "法人姓名必填", type: "error" }]}
        >
          <Input />
        </FormItem>

        <FormItem label="第三方联系电话" name="component_phone">
          <Input />
        </FormItem>

        <FormItem>
          <Button type="submit">提交信息</Button>
        </FormItem>
      </Form>
    </>
  );
}
