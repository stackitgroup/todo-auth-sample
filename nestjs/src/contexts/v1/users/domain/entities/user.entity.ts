import { Todo } from '@/contexts/v1/todos/domain/entities/todo.entity'
import { BaseEntity } from '@/libs/ddd/base.entity'
import { Entity, Column, OneToMany } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ nullable: true })
  refreshToken: string

  @Column({ nullable: true })
  userAgent: string

  @OneToMany(() => Todo, (todo) => todo.user, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  todos: Todo[];

  constructor(id: string) {
    super()
    this.id = id
  }
}
