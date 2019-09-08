declare namespace MenuSpace {
	export interface menuData {
		[key: string]: any;
		selected: boolean;
		children: menuData[];
	}
	
	export type fieldObj = IImmutalbeMap<{
		id:string;
		text:string;
		url:string;
		icon:string;
	}>;
  
}
