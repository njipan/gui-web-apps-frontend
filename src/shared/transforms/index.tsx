import QuestionFormMessageResponseTransform from "./QuestionFormResponseMessage";

export abstract class ResponseTransform {
    abstract run(...args: any): any;
}

export default function transform( type: any, ...args: any){
    const responseTransform = new type();

    return responseTransform.run.apply(null, args);
}