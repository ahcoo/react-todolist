import axios from "axios";
import React, { useEffect, useState } from "react";
import TodoEdit from "./components/TodoEdit";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";

function App() {
  const [todos, setTodos] = useState([]);
  //const [todo, setTodo] = useState("");
  const [insertToggle, setInsertToggle] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onInsert = async (text) => {
    const data = await axios.post(`http://localhost:4000/todos/`, { text });
    setTodos(data.data);
    // setTodos((todos) => todos.concat(todo));
  };

  const onInsertToggle = async (id) => {
    setInsertToggle((prev) => !prev);
  };

  const onRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      const data = await axios.get(`http://localhost:4000/todos`);
      setTodos(data.data);
      //setTodos((todos) => todos.filter((todo) => todo.id !== id));
    } catch (e) {
      setError();
    }
  };

  const onToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/todos/check/${id}`);
      setTodos((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo
        )
      );
    } catch (e) {
      setError();
    }
  };

  const onUpdate = async (id, text) => {
    // setTodos((todos) =>
    //   todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    // );
    try {
      const data = await axios({
        url: `http://localhost:4000/todos/${id}`,
        method: "PATCH",
        data: {
          text,
          perform_date: "2022-08-09 11:11:11",
        },
      });
      setTodos(data.data);
      //todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    } catch (e) {
      setError(e);
    }
    onInsertToggle();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await axios({
          url: "http://localhost:4000/todos",
          method: "GET",
        });
        //java스크립트에서 새 배열 만드는 법 = []
        //하지만 아래 data.data도 새 배열을 생성하는 구문.
        //위 const data = await axios({})의 axios가 새 배열을 자동적으로 생성해주기 때문에 새 배열이란 뜻이 됨.
        setTodos(data.data);
        setIsLoading(false);
        // throw new Error("조회중 에러발생!!");
        // await new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve()
        //   }, 3000)
        // })
      } catch (e) {
        setError(e);
      }
    };

    getData();
  }, []);

    
    setTodos((todos) => todos.concat(todo));
    nextId.current++;
  };


  if (error) {
    return <>에러: {error.message}</>;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <TodoTemplate>
      <div className="bg-red-500">안녕</div>
      <TodoInsert onInsert={onInsert} />
      <TodoList
        todos={todos}
        onRemove={onRemove}
        onToggle={onToggle}
        onInsertToggle={onInsertToggle}
        setSelectedTodo={setSelectedTodo}
      />
      {insertToggle && (
        <TodoEdit
          onInsertToggle={onInsertToggle}
          selectedTodo={selectedTodo}
          onUpdate={onUpdate}
        />
      )}
    </TodoTemplate>
  );
}

export default App;
