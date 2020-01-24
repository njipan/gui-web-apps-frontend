import Api from './Api';

export default class QuizApi extends Api{

    constructor(){
        super();
    }

    all(moduleName: string = '', languageId: string =''){
        return this.request.get(`quizzes?q_module=${moduleName}&q_language=${languageId}`);
    }

    getQuestions(quizId: number){
        return this.request.get(`quizzes/${quizId}/questions`);
    }

    delete(id: string){
        return this.request.delete(`quizzes/${id}`);
    }

    getResult(id: number, data: any){
        return this.request.post(`quizzes/${id}/result`, data);
    }

    insert(data: any){
        return this.request.post(`quizzes`, data);
    }
}