import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@/app/database/base.repository';
import { Todo } from '../../domain/entities/todo.entity';

@Injectable()
export class TodoRepository extends BaseRepository<Todo> {
  constructor(
    @InjectRepository(Todo)
    todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }
}
