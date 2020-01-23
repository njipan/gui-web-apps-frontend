import Api from './Api';

export default class QuizApi extends Api{

    constructor(){
        super();
    }

    all(moduleName: string = '', languageId: string =''){
        return this.request.get(`quizzes?q_module=${moduleName}&q_language=${languageId}`);
    }

    delete(id: string){
        return this.request.delete(`quizzes/${id}`);
    }

    insert(data: any){
        return this.request.post(`quizzes`, data);
    }
}