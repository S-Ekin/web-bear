import * as React from "react";
import * as ReactDom from "react-dom";
import {Icon} from "@js/common/Button";
import {VelocityComponent} from "velocity-react";

type ModalProps = {
		ableMove?:boolean;
		shadeTransparent?:boolean; //遮罩层透明
		container:HTMLElement;
		tit?:string;
		className?:string;
		confirmName?:string;
		cancelName?:string;
		onCancel:()=>void;
		onSure?:(e?:any)=>void;
		field?:string;
		showSureBtn?:boolean;
		show:boolean;
		type?:"tip"|"question";
		otherBtnCom?:React.ReactNode;
		warnTxt?:string;
		disabled?:boolean;
		hideFoot?:boolean;
	
}

type ModalState = {
			pointX:number;
			pointY:number;
}


export default class Modal extends React.PureComponent<ModalProps,ModalState>{

	static defaultProps={
		ableMove:true,
		shadeTransparent:false,
		confirmName:"确定",
		cancelName:"关闭",
		showSureBtn:true
	}

	state={
			pointX:0,
			pointY:0,
	}

	ModalDom:React.RefObject<HTMLDivElement> = React.createRef();

	
	headMouseDown=(e:React.MouseEvent)=>{
			const modalDom = (this.ModalDom.current)!;
			const {pointY,pointX} = this.state;
			
			//主义要减去上一次移动留下的位置
			const diffPointX = e.clientX - pointX;
			const diffPointY = e.clientY - pointY;

			modalDom.onmousemove = (originE:MouseEvent)=>{
				this.setState({
							pointX: (originE.clientX - diffPointX),
							pointY: (originE.clientY - diffPointY),
				})
			}
	}
	
	headMouseUp=()=>{
			(this.ModalDom.current)!.onmousemove = null ;
	}

	sureHandle=(e:React.MouseEvent<HTMLButtonElement>)=>{
		const {onSure} = this.props;
		onSure!(e);
	}

	render(){



		const {children,container,tit,confirmName,cancelName,onCancel,warnTxt,show,className,showSureBtn,type,otherBtnCom,field,disabled,hideFoot} = this.props;
		let flag = container;

		const {pointX,pointY} = this.state;
		

		return ReactDom.createPortal((
				<VelocityComponent runOnMount={true} animation = {show?"transition.fadeIn":"transition.fadeOut"} duration={200}> 
					<div className={"g-modal " +className }
						ref={this.ModalDom} 
						onMouseUp={this.headMouseUp}
					>
						
						<div className="m-Mwrap">
							<div className="m-Mask" />
							<div className="m-Modal" style={{transform:`translate(${pointX}px , ${pointY}px)`}}>
								{tit?(<div className="m-Mtit"
											onMouseDown={this.headMouseDown} 
											
								>
									<span className="tit-name">{type?<Icon styleType={type=="tip"?"fa-exclamation-circle fa-lg":"fa-question-circle fa-lg"}>&nbsp;</Icon>:null}{tit}</span>
									<span className="m-Mclose" onClick={onCancel}>
											<i className="fa fa-times-circle-o fa-2x"></i>
									</span>
								</div>):null}
							
								<div className="m-Mbody">
									{children}
								</div>
								{!hideFoot?(<div className="m-Mfooter">
									{warnTxt ? <p className="m-warn"><Icon styleType="fa-exclamation-triangle"/>&nbsp;{warnTxt}</p>:null } 

										{showSureBtn?(
										<button name={field} disabled={disabled} className={"s-btn normal-btn " + (!disabled && "primary"||"")} onClick={this.sureHandle}>
											{confirmName}
										</button>):null}
										{
											otherBtnCom ? otherBtnCom:null
										}
											<button className="s-btn line-btn green" onClick={onCancel}>
											{cancelName}
										</button>
								</div>):null}
							</div>
						</div>
					
					</div>	
				</VelocityComponent>
			),flag);
	}
}