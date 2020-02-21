 declare namespace CalendarSpace {
	
	export interface CalendarStates {
		expand: boolean;
		selTimeArr: IImmutalbeList<commonInterface["showTimeObj"]>;
		calendarVal: string;
		rotate:commonInterface["rotate"];
		showViewArr: ("fadeIn" | "fadeOut")[];
	}

	export interface commonInterface {
			rotate: 1 | 2 |3 |4 , // 日历类型
			curTime:{
					year:number;
					searson:number;
					month:number;
					day:number;
					hour:number;
					minute:number;
			};	
			showTimeObj:IImmutalbeMap<commonInterface["curTime"]>;
			changeBasicState<K extends keyof CalendarStates >(key:K,callback:(states:CalendarStates )=>CalendarStates[K],
			obj?:{
				showTimeObj:commonInterface['curTime'],
				viewIndex:number;
			}
			):void | boolean;
	}

    export interface fixProps{
		style:1|2;
		time:boolean;
		noChangeRotate:boolean;
	}

}