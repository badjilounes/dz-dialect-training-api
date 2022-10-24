import { TrainingAggregate } from '@business/student/domain/aggregates/training.aggregate';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';

export function trainingToTrainingAggregate(training: Training): TrainingAggregate {
  return TrainingAggregate.from({
    id: training.id,
    category: training.category,
    fromLanguage: training.fromLanguage,
    learningLanguage: training.learningLanguage,
    exams: training.exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      trainingId: training.id,
      questions: exam.questions.map((question) => ({
        id: question.id,
        examId: exam.id,
        question: question.question,
        type: question.type,
        answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
        propositions: question.propositions,
      })),
    })),
  });
}
