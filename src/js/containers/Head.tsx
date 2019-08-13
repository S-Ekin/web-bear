import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom"
import Modal from "@js/common/Modal";
import { InpBox } from "@js/common/InputBtn";
import {SvgIcon,Icon} from "@js/common/Button";
import {Notification} from "@js/common/toast/index";


type HeadProp = {
}

type HeadState = {
	initPasswordModal: boolean;
	showPasswordModal: boolean;
	password: string;
	newPassword:string;
	confirmPassword:string;
	warnTxt:string;
}

class Head extends React.PureComponent<RouteComponentProps & HeadProp  , HeadState>{

	state: HeadState = {
		initPasswordModal: false,
		showPasswordModal: false,
		password: "",
		newPassword: "",
		confirmPassword:"",
		warnTxt:""
	}

	componentDidMount(){

	}
	componentWillMount(){

	}


	notifitionRef:React.RefObject<Notification>=React.createRef();
	submitPassword(){

		
	
	
		


	}

	submit=()=>{

		const {newPassword,password,confirmPassword} = this.state;
		if(!newPassword || !password){

			this.setState({
				warnTxt:"填写完整！"
			})

			return

		}

		if(newPassword!=confirmPassword){

			this.setState({
				warnTxt:"两次密码确认不一致！"	
			})

			return ;

		}




		this.submitPassword();
	}

	togglePassword = () => {

		this.setState(pre => ({
			initPasswordModal: true,
			showPasswordModal: !pre.showPasswordModal,
			warnTxt:"",
			confirmPassword:"",
			newPassword:"",
			password:""
		}))
	}

	changePassword = (file: string, pwd: string) => {

		this.setState({
			[file as "password"]: pwd,
		})

	}

	

	render() {

		const { initPasswordModal, showPasswordModal, password,newPassword,confirmPassword,warnTxt} = this.state;


		const rootModalDom = document.getElementById("modal_root") as HTMLDivElement;

		const expand = true ;

		return (<div className="g-head shadow">
			<Notification ref={this.notifitionRef} />
			{initPasswordModal ? (<Modal
				show={showPasswordModal}
				container={rootModalDom!}
				tit={"修改密码"}
				onCancel={this.togglePassword}
				onSure={this.submit}
				className="pwd-M"

			>
				<p className="item-inp"><span className="m-inp-tit">用户名</span>SEkin</p>
				<InpBox
					type="password"
					styleType="normal"
					field="password"
					title="旧密码"
					value={password}
					changeHandle={this.changePassword}
				/>
				<InpBox
					type="password"
					styleType="normal"
					field="newPassword"
					title="新密码"
					value={newPassword}
					changeHandle={this.changePassword}
				/>
				<InpBox
					type="password"
					styleType="normal"
					field="confirmPassword"
					title="确认密码"
					value={confirmPassword}
					changeHandle={this.changePassword}
				/>
			
				{warnTxt ? <p className="m-warn"><Icon styleType="fa-exclamation-triangle"/>{warnTxt}</p>:null } 
			</Modal>) : null}
			<div >
				{expand ? (<span className="j-slideBar" onClick={undefined}>
					<SvgIcon styleType="menu-expand"  size="size2" />
				</span>) : null}
				<span className="m-theme">
					医院绩效考核平台
				</span>
				
			</div>
			<div className="g-sys_set">
				
				<div className="g-role-sys">
					<div style={{ padding: "20px 10px"}}>
						<SvgIcon styleType="user-change" size="size1"/><span>&nbsp;管理员</span>
					</div>
					<ul className="m-sysOpt" style={{left:16}}>
						
					</ul>
				</div>
				
				<div className="g-user-opt" >
					<div style={{ padding: "20px 10px" }}>
						<SvgIcon styleType="user" size="size1"/>
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
};




export default withRouter(Head);