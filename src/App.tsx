import "@css/main.scss";
import App from "./index";
import * as React from "react";
import * as ReactDom from "react-dom" ;
import "velocity-animate";
import 'velocity-animate/velocity.ui';



const domApp = document.getElementById("app");

ReactDom.render((
			<App />
	),domApp);


if(module.hot){
		// 热替换react
		module.hot.accept("./index",()=>{
					import("./index").then((module:any)=>{
						const AppCom = module.default;
							ReactDom.render((
										<AppCom />
								),domApp);
					});
		});
}