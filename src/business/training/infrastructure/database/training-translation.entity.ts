import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TrainingTranslationStep } from './training-translation-step.entity';

@Index(['userId'])
@Entity()
export class TrainingTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  language: string;

  @Column({ type: 'enum', enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' })
  state: 'IN_PROGRESS' | 'COMPLETED';

  @OneToMany(() => TrainingTranslationStep, (step) => step.training, { eager: true })
  steps: TrainingTranslationStep[];
}
