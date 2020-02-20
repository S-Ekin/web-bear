/**
 * @name 崩溃页面
 * @description description
 * @time 2019-11-22
 */
import * as React from "react";
import {Button} from "../button/index";

type Props={
	msg?:string;
	reloadFn:()=>void;
};
type States={

};

class CrashPage extends React.PureComponent<Props,States> {

	state:States={

	};
	render(){
		const {msg,reloadFn} = this.props;

		return (
			<div className="g-crash-page">
				<div className="crash-main">
					<div className="crash-logo"/>
					<div className="crash-descript">
						<h3>页面已经崩溃！</h3>
						<div className="crash-txt">
							<p>{msg}</p>
							<p>导致的原因可能是数据错误，导致页面损坏！请联系相关人员！</p>
						</div>
						<div>
							<Button handle={reloadFn}>重新加载</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default CrashPage;
