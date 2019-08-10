 declare namespace CalendarSpace {
    export interface StringValidator {
        name:string;
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
			showTimeObj:TypedMap<commonInterface["curTime"]>
	}


export	interface CalendarApi {
		curTime:commonInterface["curTime"];
		changeSelTimeItme(viewIndex:number,showTimeObj:CalendarApi["curTime"]):void;
		changeTime(e:React.ChangeEvent<HTMLInputElement>):void;

	}

export interface CalendarViewApi{
	

}

}