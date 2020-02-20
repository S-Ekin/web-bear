import * as ReactDom from "react-dom";
import * as React from "react";

type props = {};
type states = {
	show: boolean;
};
class Loading extends React.PureComponent<props, states> {
	state: states = {
		show: true,
	};
	toggle = (show?:boolean) => {
		this.setState(pre => ({
			show: show === undefined ? !pre.show :show,
		}));
	}

	render() {
		const { show } = this.state;
		return (
			<div className={`g-loading ${!show ? "hide-loading" : ""}`} >
				<div className="m-loading">
					<b className="loading-text">loading...</b>
				</div>
			</div>
		);
	}
}
// tslint:disable-next-line: no-null-keyword
let loadingRef:null | Loading = null ;
const createLoad = function(callback?:()=>void) {
		const wrap = document.getElementById("wrap-loading");
		ReactDom.render(<Loading ref={ref => (loadingRef = ref)} />, wrap,function(){
			if(callback){
				callback();
			}
			
		});
};
    
const loadfn = {
	open: function() {
		if (!loadingRef) {
			createLoad(function(){
				loadingRef!.toggle(true);
			});
		}else{
				loadingRef!.toggle(true);
		} 
	},
	close: function() {
        if (loadingRef) {
		    loadingRef.toggle(false);
		} 
	},
};
export {createLoad};
export default loadfn ;
