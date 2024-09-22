"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Trash from "../../assets/trash.png";
import styles from "./tasks.module.scss";
import { nanoid } from "nanoid";
import { ModalType, Task } from "@/types/Task";

const Tasks = () => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [tasksCompleted, setTasksCompleted] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedTodayTasks = JSON.parse(
      localStorage.getItem("todayTasks") || "[]"
    );
    const savedCompletedTasks = JSON.parse(
      localStorage.getItem("tasksCompleted") || "[]"
    );
    setTodayTasks(savedTodayTasks);
    setTasksCompleted(savedCompletedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
  }, [todayTasks]);

  useEffect(() => {
    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
  }, [tasksCompleted]);

  const handleModalToggle = (type: ModalType) => {
    setModalType(type);
  };

  const handleAddNewTask = () => {
    if (!newTaskTitle) {
      toast.error("Por favor, preencha o título da tarefa.");
      return;
    }

    const taskAlreadyExists =
      todayTasks.some((task) => task.title === newTaskTitle) ||
      tasksCompleted.some((task) => task.title === newTaskTitle);

    if (taskAlreadyExists) {
      toast.error("Já existe uma tarefa com este título.");
      return;
    }

    setTodayTasks([...todayTasks, { id: nanoid(), title: newTaskTitle }]);
    setNewTaskTitle("");
    handleModalToggle(null);
  };

  const handleCompleteTaskToggle = (taskId: string) => {
    const taskIndex = todayTasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      const updatedTask = todayTasks[taskIndex];
      setTodayTasks(todayTasks.filter((task) => task.id !== taskId));
      setTasksCompleted([...tasksCompleted, updatedTask]);
    } else {
      const taskIndex = tasksCompleted.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        const updatedTask = tasksCompleted[taskIndex];
        setTasksCompleted(tasksCompleted.filter((task) => task.id !== taskId));
        setTodayTasks([...todayTasks, updatedTask]);
      }
    }
  };

  const handleConfirmDeleteTask = () => {
    if (taskToDelete) {
      setTodayTasks((tasks) =>
        tasks.filter((task) => task.title !== taskToDelete)
      );
      setTasksCompleted((tasks) =>
        tasks.filter((task) => task.title !== taskToDelete)
      );
      handleModalToggle(null);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        modalType ? styles.disableInteractions : ""
      }`}
    >
      <ToastContainer />
      {modalType === "newTask" && (
        <>
          <div
            className={styles.overlay}
            onClick={() => handleModalToggle(null)}
          />
          <div className={styles.container_new_task}>
            <div className={styles.modal_content}>
              <h2 className={styles.headline_new_task}>Nova tarefa</h2>
              <p className={styles.title_new_task}>Título</p>
              <input
                className={styles.input_new_task}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Digite"
              />
              <div className={styles.buttons_new_task}>
                <button
                  onClick={() => handleModalToggle(null)}
                  className={styles.btn_cancel_new_task}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNewTask}
                  className={styles.btn_save_new_task}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {modalType === "deleteTask" && (
        <>
          <div
            className={styles.overlay}
            onClick={() => handleModalToggle(null)}
          />
          <div className={styles.container_delete_task}>
            <div className={styles.modal_content}>
              <h2 className={styles.headline_delete_task}>Deletar tarefa</h2>
              <p className={styles.title_delete_task}>
                Tem certeza que você deseja deletar essa tarefa?
              </p>
              <div className={styles.buttons_delete_task}>
                <button
                  onClick={() => handleModalToggle(null)}
                  className={styles.btn_cancel_delete_task}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeleteTask}
                  className={styles.btn_delete_task}
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.container_tasks}>
        <h3 className={styles.headline_tasks}>Suas tarefas de hoje</h3>
        <ul className={styles.container_task}>
          {todayTasks.map((task) => (
            <li key={task.id} className={styles.task}>
              <input
                type="checkbox"
                onChange={() => handleCompleteTaskToggle(task.id)}
              />
              <span className={styles.text_task}>{task.title}</span>
              <Image
                src={Trash}
                alt="Trash"
                width={25}
                height={25}
                onClick={() => {
                  setTaskToDelete(task.title);
                  handleModalToggle("deleteTask");
                }}
              />
            </li>
          ))}
        </ul>
        {tasksCompleted.length > 0 && (
          <div className={styles.container_task_finished}>
            <h3 className={styles.finished_tasks}>Tarefas finalizadas</h3>
            <ul className={styles.container_task}>
              {tasksCompleted.map((task) => (
                <li key={task.id} className={styles.task_finished}>
                  <input
                    type="checkbox"
                    checked
                    onChange={() => handleCompleteTaskToggle(task.id)}
                  />
                  <span className={styles.text_task_finished}>
                    {task.title}
                  </span>
                  <Image
                    src={Trash}
                    alt="Trash"
                    width={25}
                    height={25}
                    onClick={() => {
                      setTaskToDelete(task.title);
                      handleModalToggle("deleteTask");
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.container_button}>
        <button
          onClick={() => handleModalToggle("newTask")}
          className={styles.btn_new_task}
        >
          Adicionar nova tarefa
        </button>
      </div>
    </div>
  );
};

export default Tasks;