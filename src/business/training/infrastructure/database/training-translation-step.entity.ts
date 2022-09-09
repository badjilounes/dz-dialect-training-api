import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrainingTranslation } from './training-translation.entity';

@Entity()
export class TrainingTranslationStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  order: number;

  @Column({ nullable: true, default: null })
  response: string | null;

  @Column({ nullable: true, default: null })
  valid: boolean | null;

  @Column()
  @ManyToOne(() => TrainingTranslation)
  training: TrainingTranslation;
}
