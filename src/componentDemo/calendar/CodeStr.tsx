export const str1 = `<Calendar
              key={refreshId}
              initTime={initTime}
              clickBack={this.clickBack}
              {...(configObj as any)}
            />
`;

export const str2 = `function clickBack(
    timeStr: string,
    field: string,
    rotate: CalendarSpace.commonInterface["rotate"],
    _selTimeList: CalendarSpace.CalendarStates["selTimeArr"]
  ){
    console.log(timeStr, field, rotate,_selTimeList);
  }`;