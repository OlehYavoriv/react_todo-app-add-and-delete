/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as apiService from './api/todos';
import { UserWarning } from './components/UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const todosFromServer = await apiService.getTodos();

      setTodoList(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => setErrorMessage(null), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const filteredTodos = (todos: Todo[], filter: Filter): Todo[] => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todos;
    }
  };

  const activeTodosCount = useMemo(
    () => todoList.filter(todo => !todo.completed).length,
    [todoList],
  );

  const filteredTodosList = useMemo(
    () => filteredTodos(todoList, currentFilter),
    [todoList, currentFilter],
  );

  const addTodo = ({ title, userId, completed }: Todo) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title cannot be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: Date.now(),
      title,
      userId,
      completed,
    };

    setTempTodo(newTempTodo);
    setErrorMessage(null);

    apiService
      .addTodo({ title: trimmedTitle, userId, completed })
      .then(newTodo => {
        setTodoList(currentTodos => [...currentTodos, newTodo]);
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to add todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    apiService
      .deleteTodo(todoId)
      .then(() => {
        setTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      });
  };

  if (!apiService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        {!loading && todoList.length > 0 && (
          <>
            <TodoList
              todos={filteredTodosList}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
            />
            <Footer
              activeCount={activeTodosCount}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        isVisible={!!errorMessage}
        onHide={() => setErrorMessage(null)}
      />
    </div>
  );
};
