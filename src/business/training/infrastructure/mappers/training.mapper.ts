import { TrainingAggregate } from 'business/training/domain/aggregates/training.aggregate';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';

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
        answer: question.answer,
        propositions: question.propositions,
      })),
    })),
  });
}
