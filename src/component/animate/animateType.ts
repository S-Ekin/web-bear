export type animateState = {
  opacity?: number;
  width?: number;
  height?: number;
  transform?:[number, number] | number;
};
export type AnimateType = "fadeIn" |  "fadeOut" | "bounceRightIn" |"bounceDownIn" | "bounceDownOut";
export type domAnimateProp = {
  width?:number;
  opacity?: 0 | 1;
  height?:number;
  transform? :string;
}
