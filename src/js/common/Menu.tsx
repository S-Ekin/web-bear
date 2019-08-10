import * as React from "react";
import {Link} from "react-router-dom" ;

interface MenuItem extends React.Props<{}> {
	path:string;
	text:string;
	id:string;
	indentNum:number;
	is_par:boolean;
	index:number;
}


type MenuConfig = {
  	 data:any[];
  	 config:{
  	  	childField?:string;
  	    idField?:string;
  	    textField?:string;
  	 };
}
const SlideIcon = ()=>(

		<span className="j-slide_menu">
			<i className="fa fa-chevron-down"></i>
		</span>
);

const iconConfig = ["fa-search","fa-exchange","fa-user-plus"];

const ParIcon = ({index}:{index:number})=>(
		<span className="par-icon">
			<i className={"fa "+ iconConfig[index]}></i>
		</span>
	)

const MenuItem = (props:MenuItem)=>{

	const {path,text,is_par,index} = props;
	return (
		<li className={(is_par?"li-par":"li-child")}>
			<div  className={"menu-item "+(is_par?"menu-par":"menu-child")} >
					{is_par ? <ParIcon index={index} /> : ""}
					<span className="j-nav"><Link to={path}>{text}</Link></span>
					{is_par ? <SlideIcon/> : ""}
			</div>	
			{props.children}
		</li>
	);
}

const MapMenuItem = ({data,config}:MenuConfig,lev:number):React.ReactNodeArray=>{
						
						let _lev = ++lev;
					
						return (

								
							 data.map((val,index:number)=>{

							 		const {textField="text",idField="id",childField="children"} = config ;
							 		const text = val[textField] as string;
							 		const id = val[idField] as string;
							 		const child = val[childField] as any[];

							 		const obj:MenuItem = {
							 				path:val.url,
							 				text,
							 				id,
							 				indentNum:_lev,
							 				is_par:!!child.length,
							 				index,
							 		};

							 		if(child.length){

							 			 const ChildComponent = MapMenuItem({data:child,config},_lev);
							 			
							 			 return <MenuItem key={id} {...obj}><ul> {ChildComponent} </ul></MenuItem>
							 	
							 		}else{

							 			 return <MenuItem key={id} {...obj}/>
							 		}



							 })

						);
}



const Menu  = (props:MenuConfig)=>{


	const {data,config}= props;

	return (
			<ul className="g-menu">
				{MapMenuItem({data,config},0)}
			</ul>
	);
}


export default Menu ;