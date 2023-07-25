import { DeepPartial } from 'typeorm';

import { CourseEntity } from '../../domain/entities/course.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamQuestionEntity } from '../../domain/entities/question.entity';
import { TrainingCourseExamQuestion } from '../database/entities/training-course-exam-question.entity';
import { TrainingCourseExam } from '../database/entities/training-course-exam.entity';
import { TrainingCourse } from '../database/entities/training-course.entity';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

export function trainingAggregateToTraining(aggregate: TrainingAggregate): DeepPartial<Training> {
  return {
    id: aggregate.id,
    name: aggregate.name,
    description: aggregate.description,
    isPresentation: aggregate.isPresentation,
    createdAt: aggregate.createdAt,
    updatedAt: aggregate.updatedAt,
    courses: aggregate.courses.map((course) => courseEntityToCourse(aggregate.id, course)),
    order: aggregate.order,
  };
}

export function courseEntityToCourse(trainingId: string, course: CourseEntity): DeepPartial<TrainingCourse> {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    training: { id: trainingId },
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    exams: course.exams.map((exam) => examEntityToExam(course.id, exam)),
    order: course.order,
  };
}

export function examEntityToExam(courseId: string, exam: ExamEntity): DeepPartial<TrainingCourseExam> {
  return {
    id: exam.id,
    name: exam.name,
    course: { id: courseId },
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    questions: exam.questions.map((question) => questionToQuestionEntity(exam.id, question)),
    order: exam.order,
  };
}

export function questionToQuestionEntity(
  examId: string,
  question: ExamQuestionEntity,
): DeepPartial<TrainingCourseExamQuestion> {
  return {
    id: question.id,
    exam: { id: examId },
    type: question.type,
    question: question.question,
    answer: question.answer.value,
    propositions: question.propositions,
    order: question.order,
  };
}
