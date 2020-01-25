interface IFindIndexToPush {
    text: string;
    selectedAt : number;
    arrayLength : number;
}

export function findIndexToPush(data: IFindIndexToPush) {
    const { text, selectedAt, arrayLength } = data;
    let isLeft: boolean = text.length / 2 >= selectedAt;
    console.log((isLeft ? 'Left' : 'Right'));
    
    let substrText: string = isLeft ? text.substr(0, selectedAt) : text.substr(selectedAt - 1) ;
    console.log(substrText);

    let beforeIdx = substrText.split("...").length - 1;
    console.log(beforeIdx);

    return isLeft ? (beforeIdx) : (arrayLength - beforeIdx);
}