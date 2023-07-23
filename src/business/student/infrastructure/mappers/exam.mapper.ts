import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { ExamAggregate } from '@business/student/domain/aggregates/exam.aggregate';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';

export function examToExamAggregate(exam: TrainingExam): ExamAggregate {
  return ExamAggregate.from({
    id: exam.id,
    name: exam.name,
    courseId: exam.course.id,
    questions: exam.questions.map((question) => ({
      id: question.id,
      examId: exam.id,
      question: question.question,
      type: question.type,
      answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
      propositions: question.propositions,
      order: question.order,
    })),
  });
}
