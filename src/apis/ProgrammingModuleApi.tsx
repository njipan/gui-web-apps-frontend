import Api from './Api';

export default class ProgrammingModuleApi extends Api{

    constructor(){
        super();
    }

    get(moduleId : number|string){
        return this.request.get(`programming-module/${moduleId}`);
    }

    getQuestions(moduleId : number | string){
        return this.request.get(`programming-module/${moduleId}/questions`);
    }

    getModulesForQuiz(){
        return this.request.get(`quizzes/get-modules`);
    }
}