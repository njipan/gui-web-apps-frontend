import Api from './Api';

export default class QuestionApi extends Api{

    constructor(){
        super();
    }

    create(quizId: number, data: any) {
        return this.request.post(`quizzes/${quizId}/questions`, data);
    }

    update(quizId: number, questionId: number, data: any) {
        return this.request.put(`quizzes/${quizId}/questions/${questionId}`, data);
    }

    delete(quizId: number, questionId: number) {
        return this.request.delete(`quizzes/${quizId}/questions/${questionId}`);
    }

    add(quizId: number, data: any) {
        return this.request.post(`quizzes/${quizId}/questions`);
    }

    updateEssayAnswers(quizId: number, questionId: number, data: any) {
        return this.request.post(`quizzes/${quizId}/questions/${questionId}/essay-answers`, data);
    }

    deleteMultipleChoiceAnswer(quizId: number, questionId: number, answerId: number) {
        return this.request.delete(`quizzes/${quizId}/questions/${questionId}/answers/${answerId}`);
    }

    addMultipleChoiceAnswer(quizId: number, questionId: number, data: any) {
        return this.request.post(`quizzes/${quizId}/questions/${questionId}/multiple-choice-answers`, data);
    }

    selectMultipleChoiceAnswer(quizId: number, questionId: number, answerId: number) {
        return this.request.post(`quizzes/${quizId}/questions/${questionId}/multiple-choice-select`);
    }
}