/**
 * @name 模态框
 * @description 把底部按钮放在父组件传过来
 * @time 2019-08-21
 */

import * as React from "react";
import * as ReactDom from "react-dom";
import {VelocityComponent} from "velocity-react";
import {Icon} from "../icon/index";


type ModalProps = {
		noshade?:boolean; //遮罩层透明
		wrap?:HTMLElement;
		tit:string;
		className?:string;
		field:string;//标识字段
		onCancel:(field:string)=>void;
        show:boolean;
        footer?:React.ReactChild;
};

type ModalState = {
	pointX:number;
	pointY:number;
};

interface IModal{
	wrap:HTMLElement;
	modalDom:React.RefObject<HTMLDivElement>;
	init:boolean;
    headMouseDown(e:React.MouseEvent):void;
}
export default class Modal extends React.PureComponent<ModalProps,ModalState> implements IModal{

	wrap = document.getElementById("wrap-modal")!;
	modalDom:React.RefObject<HTMLDivElement> = React.createRef();
	// 第一次初始化组件时，要是显示就初始化dom,否则不初始化
	init = this.props.show;
	state={
		pointX:0,
		pointY:0,
	};
	
	headMouseDown=(e:React.MouseEvent)=>{
			const modalDom = (this.modalDom.current)!;
			const {pointY,pointX} = this.state;
			
			//主义要减去上一次移动留下的位置
			const diffPointX = e.clientX - pointX;
			const diffPointY = e.clientY - pointY;

			modalDom.onmousemove = (originE:MouseEvent)=>{
				this.setState({
							pointX: (originE.clientX - diffPointX),
							pointY: (originE.clientY - diffPointY),
				});
			};
	}
	clickFn=()=>{
		const {onCancel,field} = this.props;
		onCancel(field);
	}
	headMouseUp=()=>{
        // tslint:disable-next-line: no-null-keyword
        (this.modalDom.current)!.onmousemove = null;
	}
	componentWillReceiveProps(props:ModalProps){
		if(props.show!==this.props.show){
			this.init = true ;
		}
	}
	render(){


		const {children,wrap,tit,show,className,footer} = this.props;

		const {pointX,pointY} = this.state;
		const init = this.init;
        
        const styleObj = {transform: `translate(${pointX}px, ${pointY}px)`,};
		const container = wrap ? wrap : this.wrap ;
		return init ? ReactDom.createPortal((
                <VelocityComponent 
                runOnMount={true} 
                animation={show?"transition.bounceDownIn":"transition.bounceDownOut"} > 
                    <div 
                        className={`g-modal ${className}`}
						ref={this.modalDom} 
						onMouseUp={this.headMouseUp}
					>
						
						<div className="m-Mwrap">
							<div className="m-Mask" />
							<div className="m-Modal" style={styleObj}>
								<div className="m-Mtit"
											onMouseDown={this.headMouseDown} 
											
								>
									<span className="tit-name">{tit}</span>
									<span className="m-Mclose" onClick={this.clickFn}>
                                        <Icon className="fa fa-times fa-2x"/>
									</span>
								</div>
							
								<div className="m-Mbody">
									{children}
								</div>
								<div className="m-Mfooter">
									{footer}	
								</div>
							</div>
						</div>
					
					</div>	
				</VelocityComponent>
			),container) :<span/>;
	}
}