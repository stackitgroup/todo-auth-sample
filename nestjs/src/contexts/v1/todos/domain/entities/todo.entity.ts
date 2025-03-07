import { User } from '@/contexts/v1/user/domain/entities/user.entity';
import { BaseEntity } from '@/libs/ddd/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'todos' })
export class Todo extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => User, (table) => table.todos, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}