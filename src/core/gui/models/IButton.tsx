import IPoint from "./IPoint";

export default interface IButton {
    text?: string,
    width?: number,
    height?: number,
    point: IPoint,
    backgroundColor?: string,
    onClick(): any
}