declare namespace ComboboxSpace {

	export type field = "idField" | "textField" | "icon"; 

	export interface comboboxAPI{

			 itemNode :  {active:boolean;};
			 slectedItem:{
			 	id:string;
			 	text:string;
			 }

			 clickFn(e:React.MouseEvent<HTMLLIElement>):void;





	}



}