import { ResponseTransform } from "./..";

export default class QuestionFormMessageResponseTransform extends ResponseTransform {

    run(data: any, messages: any): any {
        const temp: any = data;
    
        const errorQuestions: any = messages.questions;
        for(let questionIdx in errorQuestions){
            temp[questionIdx]['message'] = errorQuestions[questionIdx].text;
            const errorAnswers: any = errorQuestions[questionIdx].answers;
            
            if(!Array.isArray(errorAnswers)) {
                temp[questionIdx].message = 'Must be at least 1 answer';
                break;
            };
            for(let answerIdx in errorAnswers){
                temp[questionIdx]['answers'][answerIdx]['message'] = errorAnswers[answerIdx]['text'];
            }
        }
    
        return temp;
    };
}