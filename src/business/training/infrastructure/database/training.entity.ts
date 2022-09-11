import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { TrainingExam } from './training-exam.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  learningLanguage!: string;

  @Column()
  fromLanguage!: string;

  @OneToMany(() => TrainingExam, (step) => step.training, { eager: true, cascade: true })
  exams!: TrainingExam[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
