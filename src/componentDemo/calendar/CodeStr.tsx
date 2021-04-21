export const str1 = `<Calendar
              key={refreshId}
              initTime={initTime}
              clickBack={this.clickBack}
              {...(configObj as any)}
            />
`;

export const str2 = `function clickBack(
    timeStr: string,
    obj:{
					field: string,
					rotate: ICommonInterface["rotate"],
					valFormatt: ICommonInterface["valFormatt"]
    },
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
  ){
    console.log(timeStr, obj,_selTimeList);
  }
  
  function clickBefore(
    timeStr: string,
    obj:{
					field: string,
					rotate: ICommonInterface["rotate"],
					valFormatt: ICommonInterface["valFormatt"]
    },
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
  ){
    if(obj.field === "forbid"){
      alert("禁止选择")
      return true;
    }
  }
  
  `;
  
  export const str3 = `function matchTimeStr(
    field: string,
    timeStr?: string
  ){
   if(timeStr.includes("2022")){
     return true;
   }
  }
`;