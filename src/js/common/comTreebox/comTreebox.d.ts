declare namespace ComTreeboxSpace {

	export type field = "idField"| "childField"| "textFiled"| "icon"  |"parAbleClick";
	
	export type commonMethodName = "getCheckBox" | "clickItem" | "expandToggle";

	export interface comTreeboxAPI{

			getFieldVal(field:field):string;
			prePath?:(number | string)[];
			getCommonMethod<k extends commonMethodName>(methodName:commonMethodName):comTreeboxAPI[k]
			getCheckBox(checkStatus:string,path:string,is_par:boolean):React.ReactChild;
			clickItem(e:React.MouseEvent<HTMLElement>):void;
			expandToggle(e:React.MouseEvent<HTMLElement>):void;

	}

	



}