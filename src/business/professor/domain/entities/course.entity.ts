import { IsDate, IsNumber, IsString } from 'class-validator';

import { BaseEntity } from '../../../../shared/ddd/domain/base-entity';

import { ExamEntity, ExamEntityProps, UpdateExamEntityProps } from './exam.entity';

export type UpdateCourseEntityProps = {
  name: string;
  description: string;
  order: number;
};

export type CourseEntityProps = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  order: number;
  exams: ExamEntityProps[];
  createdAt: Date;
  updatedAt: Date;
};

export class CourseEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _trainingId: string;
  public get trainingId(): string {
    return this._trainingId;
  }

  @IsString()
  private _name: string;
  public get name(): string {
    return this._name;
  }

  @IsString()
  private _description: string;
  public get description(): string {
    return this._description;
  }

  @IsNumber()
  private _order: number;
  public get order(): number {
    return this._order;
  }

  private readonly _exams: ExamEntity[];
  public get exams(): ExamEntity[] {
    return this._exams;
  }

  @IsDate()
  private readonly _createdAt: Date;
  public get createdAt(): Date {
    return this._createdAt;
  }

  @IsDate()
  private _updatedAt: Date;
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  private constructor(readonly props: CourseEntityProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._description = props.description;
    this._order = props.order;
    this._exams = props.exams.map(ExamEntity.from);
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CourseEntityProps): CourseEntity {
    return CourseEntity.from(props);
  }

  static from(course: CourseEntityProps): CourseEntity {
    return new CourseEntity(course);
  }

  update(props: UpdateCourseEntityProps): CourseEntity {
    this._name = props.name;
    this._description = props.description;
    this._order = props.order;
    this._updatedAt = new Date();
    return this;
  }

  addExam(exam: ExamEntity): CourseEntity {
    this._exams.push(exam);
    return this;
  }

  updateExam(examId: string, props: UpdateExamEntityProps): CourseEntity {
    const examToUpdate = this._exams.find((e) => e.id === examId);
    if (!examToUpdate) {
      throw new Error('Exam not found');
    }
    examToUpdate.update(props);
    return this;
  }

  deleteExam(examId: string): CourseEntity {
    this._exams.splice(
      this._exams.findIndex((e) => e.id === examId),
      1,
    );
    return this;
  }

  reorderExams(newOrders: { id: string; order: number }[]): CourseEntity {
    this._exams.forEach((examToReorder) => {
      const examWithNewOrder = newOrders.find((current) => current.id === examToReorder.id);
      this.updateExam(examToReorder.id, {
        name: examToReorder.name,
        questions: examToReorder.questions,
        order: examWithNewOrder?.order ?? examToReorder.order,
      });
    });

    return this;
  }
}
