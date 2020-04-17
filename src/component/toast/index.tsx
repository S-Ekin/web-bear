/**
 * @name 提示弹框
 * @description description
 * @time 2019-08-21
 */
import * as React from "react";
import * as Immutable from "immutable";
import * as ReactDom from "react-dom";
import { VelocityComponent } from "velocity-react";
import { SvgIcon} from "../my-icon/index";
type props = {};
type messageItem = {
	id: string;
	text: string;
	type: "error" | "success" | "warn";
	timerId?:number;
};
type states = {
	messages: IImmutalbeList<messageItem>;
};
interface INotice {
    add(obj: messageItem):void;
    clickFn(e: React.MouseEvent<HTMLDivElement>):void;
    clear():void;
}
class Notice extends React.PureComponent<props, states> implements INotice {
	state: states = {
		messages: Immutable.List([]),
	};

	add = (obj: messageItem) => {
		this.setState(pre => {
			return {
				messages: pre.messages.push(obj),
			};
		});
	}

	clickFn = (e: React.MouseEvent<HTMLDivElement>) => {
		const dom = e.currentTarget!;
        const id = dom.dataset.id!;
        this.remove(id);
        
	}
	remove=(id:string)=>{
	
		this.setState(pre=>{

            return {
                messages:pre.messages.filter(val=>{

                    return val.id !== id ;
                })
            };
        });

	}
	clear = () => {
		const {messages} = this.state;
		if(!messages.size){
			return ;
		}
		this.setState(pre => {
			// 清除定时器
			pre.messages.forEach( val => {
				const {timerId} = val;
				if(timerId){
					window.clearTimeout(timerId);
				}
			});
			return {
				messages: pre.messages.clear(),
			};
		});
	}
	render() {
		const { messages } = this.state;

		const list = messages.map(val => {
			const { id, text, type } = val;
			return (
				<VelocityComponent
					key={id}
					animation="transition.bounceRightIn"
					runOnMount={true}>
					<div>
						<span className="g-alertInfo">
							<span>
								<span className={`notice-item ${type}`}>
									<SvgIcon className={type} size="middle"/>
								</span>
								<span className="txt">{text}</span>
							</span>

							<span
								className="m-alert-close"
								data-id={id}
								onClick={this.clickFn}>
                                    <SvgIcon className="close" />
							</span>
						</span>
					</div>
				</VelocityComponent>
			);

		});

		return  (
				<div className="g-notification">
					{list}
				</div>
			);
	}
}

// tslint:disable-next-line: no-null-keyword
let noticeRef: null | Notice = null;
const createTimekey = function() {
	return new Date().getTime();
};
const fn = (ref:Notice) => {
	noticeRef = ref;
};

const createNotice = function(callback?:()=>void) {
	const wrap = document.getElementById("wrap-notice");

	ReactDom.render(<Notice ref={fn} />, wrap,function(){
		if(callback){
			callback();
		}
	});
};
const addFn = function(messages:messageItem,keep?:boolean){
	let timerId:number | undefined;
	if(!keep){
			timerId = window.setTimeout(function(){
				noticeRef!.remove(messages.id);
			},2000);
			messages.timerId = timerId;
	}
	noticeRef!.add(messages);

};

const notice = {
	//添加提示
	add: function(
		text: string,
		type: messageItem["type"] = "success",
		keep?:boolean//是否保持，true不关闭
	) {
		const id = `${createTimekey()}`;
		const obj:messageItem ={
			id,
			type,
			text,
		};
		
		if (!noticeRef) {
			createNotice (function(){
				addFn(obj,keep);
			});
		}else{
			addFn(obj,keep);
		}
	},
	clear: function() {
		if (noticeRef) {
			noticeRef.clear();
		}
	},
};
export {createNotice };
export default notice;
