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


function isEmpty (text: string) {
    return typeof text === 'string' && text.trim() !== '';
}

export const StringUtil = {
    isEmpty
};

function debounce(){
    var timer: any = null;
    var args: any = [];

    var ret = {
        setArgs : function(...argus: any) {
            args = arguments;
            return ret;
        },
        run : function (fn: any, ms: number) {
            if(timer !== null) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(null, args);
            }, ms);
        }
    }

    return ret;
};

export const Debounce = debounce();

