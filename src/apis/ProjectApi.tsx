import Api from './Api';

export default class ProjectApi extends Api {
    getMyProject() {
        return this.request.get('projects');
    }

    insert(name: string) {
        return this.request.post('projects', {
            name
        }); 
    }

    delete(id: number) {
        return this.request.delete(`projects/${id}`);
    }
}