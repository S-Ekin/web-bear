import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {SvgIcon} from "@component/my-icon/index";
import {event} from "@component/util/Event";

type HeadProp = {
};

type HeadState = {
  initPasswordModal: boolean;
  showPasswordModal: boolean;
  password: string;
  newPassword:string;
  confirmPassword:string;
  warnTxt:string;
  showExpandIcon:boolean;
};

class Head extends React.PureComponent<RouteComponentProps & HeadProp, HeadState> {

  state: HeadState = {
    initPasswordModal: false,
    showPasswordModal: false,
    password: "",
    newPassword: "",
    confirmPassword: "",
    showExpandIcon: true,
    warnTxt: ""
  };
  submit=() => {

    const {newPassword, password, confirmPassword} = this.state;
    if (!newPassword || !password) {

      this.setState({
        warnTxt: "填写完整！"
      });

      return;

    }
    if (newPassword !== confirmPassword) {

      this.setState({
        warnTxt: "两次密码确认不一致！"
      });

      return;

    }
  }

  togglePassword = () => {

    this.setState((pre) => ({
      initPasswordModal: true,
      showPasswordModal: !pre.showPasswordModal,
      warnTxt: "",
      confirmPassword: "",
      newPassword: "",
      password: ""
    }));
  }
  toggleExpandIcon () {
    this.setState((pre) => ({
      showExpandIcon: !pre.showExpandIcon
    }));
  }
  slideIconHandle=() => {
    event.emit('menuExpand');
    this.toggleExpandIcon();
  }
  componentDidMount () {
    event.on('expandIcon', () => {
      this.toggleExpandIcon();
    });
  }
  componentWillUnmount () {
    event.remove('expandIcon');
  }
  slideIcon () {
    const {showExpandIcon} = this.state;
    const expandIcon = showExpandIcon ? (
      <span className="j-slideBar" onClick={this.slideIconHandle} >
        <SvgIcon className="menu-expand" size="big" />
      </span>
    ) : undefined;
    return expandIcon;
  }
  render () {

    return (
      <div className="g-head shadow">
        <div >
          {this.slideIcon()}
          <span className="m-theme">
					web组件
          </span>
        </div>
        <div className="g-sys_set">

          <div className="g-role-sys">
            <div style={{ padding: "20px 10px", }}>
              <SvgIcon className="role"/>
              <span className="opt-space">角色</span>
              <span className="slide-icon">
                <SvgIcon className="small-down"/>
              </span>
            </div>
            <ul className="m-sysOpt" style={{left: 16, }}>
              <li onClick={undefined}>
                <span>管理员</span>
              </li>
              <li onClick={this.togglePassword}>
                <span>普通角色</span>
              </li>
            </ul>
          </div>

          <div className="g-user-opt" >
            <div style={{ padding: "20px 10px", }}>
              <SvgIcon className="user"/>
              <span className="opt-space">SEkin</span>
              <span className="slide-icon">
                <SvgIcon className="small-down"/>
              </span>
            </div>
            <ul className="m-sysOpt" style={{width: 106, }}>
              <li onClick={undefined}>
                <span className="fa fa-power-off ">&nbsp;&nbsp;</span>
                <span>退出系统</span>
              </li>
              <li onClick={this.togglePassword}>
                <span className="fa fa-key ">&nbsp;&nbsp;</span>
                <span>修改密码</span>
              </li>
            </ul>
          </div>
          <div className="user-img">
            <a href="https://github.com/S-Ekin" target="_blank" rel="noreferrer"></a>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Head);
