import React from 'react';
// import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  tempTodo,
}) => {
  const handleToggle = () => {};

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={deleteTodo}
        />
      ))}

      {/* {tempTodo && (
        <div data-cy="TempTodo">
          <TodoItem todo={tempTodo} isTemporary={true} />
          <div data-cy="TodoLoader" className={cn('modal overlay is-active')}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )} */}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onToggle={() => {}}
          onDelete={() => {}}
          isTemporary={true}
        />
      )}
    </section>
  );
};
