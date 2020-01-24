import Api from './Api';

export default class FileApi extends Api {
    insert(project_id: number, name: string) {
        return this.request.post(`${project_id}/files`, {
            name
        });
    }
}