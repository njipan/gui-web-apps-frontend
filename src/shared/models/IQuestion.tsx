import { QuestionType } from './../enums';
interface IQuestion{
    text : string;
    type? : QuestionType;
    programming_module_id : string | number;
}

export default IQuestion;