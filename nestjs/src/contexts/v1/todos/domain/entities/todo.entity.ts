import { User } from '@/contexts/v1/users/domain/entities/user.entity'
import { BaseEntity } from '@/libs/ddd/base.entity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'

@Entity('todos')
export class Todo extends BaseEntity {
  @Column({ unique: true })
  title: string

  @Column()
  description: string

  @Column()
  dueDate: Date

  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
