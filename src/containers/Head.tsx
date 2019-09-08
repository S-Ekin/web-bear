import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom"


type HeadProp = {
};

type HeadState = {
	initPasswordModal: boolean;
	showPasswordModal: boolean;
	password: string;
	newPassword:string;
	confirmPassword:string;
	warnTxt:string;
};

class Head extends React.PureComponent<RouteComponentProps & HeadProp  , HeadState>{

	state: HeadState = {
		initPasswordModal: false,
		showPasswordModal: false,
		password: "",
		newPassword: "",
		confirmPassword:"",
		warnTxt:""
	};
	submit=()=>{

		const {newPassword,password,confirmPassword} = this.state;
		if(!newPassword || !password){

			this.setState({
				warnTxt:"填写完整！"
			});

			return ;

		}
		if(newPassword!==confirmPassword){

			this.setState({
				warnTxt:"两次密码确认不一致！"	
			});

			return ;

		}
	}

	togglePassword = () => {

		this.setState(pre => ({
			initPasswordModal: true,
			showPasswordModal: !pre.showPasswordModal,
			warnTxt:"",
			confirmPassword:"",
			newPassword:"",
			password:""
		}));
	}

	render() {

		const expand = true ;
		const expandIcon = expand ? (
			<span className="j-slideBar" onClick={undefined} />
				) : undefined;
		return (
		<div className="g-head shadow">
			<div >
				{expandIcon}
				<span className="m-theme">
					web组件
				</span>
			</div>
			<div className="g-sys_set">
				
				<div className="g-role-sys">
					<div style={{ padding: "20px 10px"}}>
						<span >&nbsp;角色</span>
					</div>
					<ul className="m-sysOpt" style={{left:16}}>
						<li onClick={undefined}>
							<span>管理员</span>
						</li>
						<li onClick={this.togglePassword}>
							<span>普通角色</span>
						</li>
					</ul>
				</div>
				
				<div className="g-user-opt" >
					<div style={{ padding: "20px 10px" }}>
						<span >&nbsp;SEkin</span>
					</div>
					<ul className="m-sysOpt" style={{width:106}}>
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
			</div>
		</div>
		);
	}
}
export default withRouter(Head);