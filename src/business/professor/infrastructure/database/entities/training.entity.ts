import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { TrainingCourse } from './training-course.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  isPresentation!: boolean;

  @OneToMany(() => TrainingCourse, (course) => course.training, { eager: true, cascade: true })
  courses!: TrainingCourse[];

  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
