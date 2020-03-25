	export interface IMenuData {
		[key: string]: any;
		selected: boolean;
		children: IMenuData[];
	}
	
	export type fieldObj = IImmutalbeMap<{
		id:string;
		text:string;
		url:string;
		icon:string;
	}>;
