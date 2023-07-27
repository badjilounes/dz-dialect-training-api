import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExamCopyQuestionResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { array: true })
  response!: string[];

  @Column()
  valid!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
