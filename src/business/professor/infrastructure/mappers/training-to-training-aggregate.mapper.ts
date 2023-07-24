import { CourseEntity } from '../../domain/entities/course.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamQuestionEntity } from '../../domain/entities/question.entity';
import { AnswerValueType } from '../../domain/value-types/answer.value-type';
import { TrainingCourse } from '../database/entities/training-course.entity';
import { TrainingExamQuestion } from '../database/entities/training-exam-question.entity';
import { TrainingExam } from '../database/entities/training-exam.entity';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

export function trainingToTrainingAggregate(training: Training): TrainingAggregate {
  return TrainingAggregate.from({
    id: training.id,
    name: training.name,
    description: training.description,
    isPresentation: training.isPresentation,
    courses: training.courses.map((course) => courseToCourseEntity(training.id, course)),
    order: training.order,
    createdAt: training.createdAt,
    updatedAt: training.updatedAt,
  });
}

export function courseToCourseEntity(trainingId: string, course: TrainingCourse): CourseEntity {
  return CourseEntity.from({
    id: course.id,
    name: course.name,
    description: course.description,
    trainingId,
    exams: course.exams.map((exam) => examToExamEntity(course.id, exam)),
    order: course.order,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  });
}

export function examToExamEntity(courseId: string, exam: TrainingExam): ExamEntity {
  return ExamEntity.from({
    id: exam.id,
    name: exam.name,
    courseId,
    questions: exam.questions.map((question) => questionToQuestionEntity(exam.id, question)),
    order: exam.order,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
  });
}

export function questionToQuestionEntity(examId: string, question: TrainingExamQuestion): ExamQuestionEntity {
  return ExamQuestionEntity.from({
    id: question.id,
    examId,
    question: question.question,
    type: question.type,
    answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
    propositions: question.propositions,
    order: question.order,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  });
}
