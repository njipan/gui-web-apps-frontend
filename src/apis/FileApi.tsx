import Api from './Api';

export default class FileApi extends Api {
    insert(project_id: number, name: string) {
        return this.request.post(`projects/${project_id}/files`, {
            name,
            content: JSON.stringify({
                elements: []
            })
        });
    }

    update(project_id: number, file_id: number, name: string, content: any) {
        let data = { name, content };
        if(name === '') {
            delete data.name;
        }
        if(content === null) {
            delete data.content;
        }
        else {
            data.content = JSON.stringify(data.content);
        }

        return this.request.put(`projects/${project_id}/files/${file_id}`, data);
    }

    delete(project_id: number, file_id: number) {
        return this.request.delete(`projects/${project_id}/files/${file_id}`);
    }
}