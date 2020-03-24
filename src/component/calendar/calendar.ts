export interface ICommonInterface {
			rotate: 1 | 2 |3 |4 ; // 日历类型
			curTime:{
					year:number;
					searson:number;
					month:number;
					day:number;
					hour:number;
					minute:number;
			};
			fixProps :{
				style:1|2;
				time:boolean;
				noChangeRotate:boolean;
			} ;	
			showTimeObj:IImmutalbeMap<ICommonInterface["curTime"]>;
			changeBasicState<K extends keyof ICalendarStates >(key:K,callback:(states:ICalendarStates )=>ICalendarStates[K],
			obj?:{
				showTimeObj:ICommonInterface['curTime'],
				viewIndex:number;
			}
			):void | boolean;
			
}

export interface ICalendarStates {
		expand: boolean;
		selTimeArr: IImmutalbeList<ICommonInterface["showTimeObj"]>;
		calendarVal: string;
		rotate:ICommonInterface["rotate"];
		showViewArr: ("fadeIn" | "fadeOut")[];
}