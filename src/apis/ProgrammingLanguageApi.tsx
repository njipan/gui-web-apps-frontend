import Api from './Api';

export default class ProgrammingLanguageApi extends Api{

    constructor(){
        super();
    }

    all(){
        return this.request.get('programming-language');
    }

    getModules(language_id: number){
        return this.request.get(`programming-language/${language_id}/modules`);
    }
}