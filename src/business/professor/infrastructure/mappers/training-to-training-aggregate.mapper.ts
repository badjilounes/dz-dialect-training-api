import { CourseEntity } from '../../domain/entities/course.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamQuestionEntity } from '../../domain/entities/question.entity';
import { AnswerValueType } from '../../domain/value-types/answer.value-type';
import { TrainingCourseExamQuestion } from '../database/entities/training-course-exam-question.entity';
import { TrainingCourseExam } from '../database/entities/training-course-exam.entity';
import { TrainingCourse } from '../database/entities/training-course.entity';

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
    color: course.color,
    trainingId,
    exams: course.exams.map((exam) => examToExamEntity(course.id, exam)),
    order: course.order,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  });
}

export function examToExamEntity(courseId: string, exam: TrainingCourseExam): ExamEntity {
  return ExamEntity.from({
    id: exam.id,
    name: exam.name,
    description: exam.description,
    courseId,
    questions: exam.questions.map((question) => questionToQuestionEntity(exam.id, question)),
    order: exam.order,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
  });
}

export function questionToQuestionEntity(examId: string, question: TrainingCourseExamQuestion): ExamQuestionEntity {
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
