import * as React from "react";
import MenuNav from "@js/common/NavMenu";
import ErrorBoundary from "@js/common/ErrorBoundary";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@js/common/Button";
type slideMenu = {
	data: any[];
};



type SlideMenuProp = {
}
type SlideMenuState = {


}

class SlideMenu extends React.PureComponent<SlideMenuProp , SlideMenuState>{

	state: slideMenu = {
		data: [],
	}


	
	


	render() {

		const { data } = this.state;
		const expand = true;
		return (
			<Velocity.VelocityComponent duration={300} animation={{ width: expand ? 250 : 70 }}>
				<div className={"g-slideMenu " + (!expand ? "expand" : "")}>
					<div className="g-logo shadow">
						<span className="m-logo"></span>
					{	!expand ? (<span className="j-slideBar" onClick={undefined}>
							<SvgIcon styleType="menu-shrink" size="size2" />
						</span>):null}
					</div>
					<ErrorBoundary>
						{data.length ? <MenuNav data={data} expand={expand}  textField="name" iconField="sys_param" /> : null}
					</ErrorBoundary>
				</div>
			</Velocity.VelocityComponent>);
	}



}

export default SlideMenu;