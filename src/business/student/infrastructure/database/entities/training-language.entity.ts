import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TrainingLanguage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  from!: string;

  @Column()
  learning!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
