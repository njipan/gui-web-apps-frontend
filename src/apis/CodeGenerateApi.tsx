import Api from './Api';

export default class CodeGeneratorApi extends Api {
    generate(language_id: number, frame: any, elements: any) {
        return this.request.post('code-generator', {
            language_id,
            frame,
            elements
        });
    }

    getFile(fileName: string) {
        return this.request.get(`code-generator/file/${fileName}`);
    }
}