export default interface QuizManagerInterface {
  getQuiz(channel: any): any;
  stopQuiz(channel: any, showScore: boolean): boolean;
}
