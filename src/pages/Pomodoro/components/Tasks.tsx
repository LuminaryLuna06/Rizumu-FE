import { useState } from "react";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useDeleteCompletedTasks,
} from "@rizumu/tanstack/api/hooks/useTask";
import {
  IconCheck,
  IconTrash,
  IconPlus,
  IconListCheck,
  IconX,
  IconPencil,
  IconAlertCircle,
} from "@tabler/icons-react";
import DateInput from "@rizumu/components/DateInput";
import TextInput from "@rizumu/components/TextInput";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import Modal from "@rizumu/components/Modal";
import type { ModelTask } from "@rizumu/models/task";

function Tasks() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const deleteCompleted = useDeleteCompletedTasks();

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    type: "delete" | "clear";
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
    type: "delete",
  });

  const handleCreate = () => {
    if (!newTaskTitle.trim()) return;
    createTask.mutate(
      {
        title: newTaskTitle,
        time_complete:
          newTaskDate && newTaskTime
            ? new Date(`${newTaskDate}T${newTaskTime}`).toISOString()
            : new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setNewTaskTitle("");
          setNewTaskDate("");
          setNewTaskTime("");
          setIsAddingTask(false);
        },
      }
    );
  };

  const startEditing = (task: ModelTask) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    if (task.time_complete && task.time_complete.includes("T")) {
      const parts = task.time_complete.split("T");
      setEditDate(parts[0]);
      setEditTime(parts[1].slice(0, 5));
    } else {
      setEditDate("");
      setEditTime("");
    }
  };

  const handleUpdateSave = (taskId: string) => {
    if (!editTitle.trim()) return;
    updateTask.mutate(
      {
        taskId,
        data: {
          title: editTitle,
          time_complete:
            editDate && editTime
              ? new Date(`${editDate}T${editTime}`).toISOString()
              : new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setEditingTaskId(null);
        },
      }
    );
  };

  const openDeleteConfirm = (taskId: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to delete this task?",
      type: "delete",
      onConfirm: () => {
        deleteTask.mutate(taskId);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const openClearConfirm = () => {
    setConfirmModal({
      isOpen: true,
      message: "Clear all completed tasks?",
      type: "clear",
      onConfirm: () => {
        deleteCompleted.mutate();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div id="tasks-container" className="fixed top-20 left-4">
      {/* Task Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-[40px] gap-2 bg-primary-hover hover:bg-primary-hover/80 backdrop-blur-xl rounded-lg px-4 py-2 transition-colors"
      >
        <IconListCheck size={18} />
        <span className="text-sm font-medium">Tasks</span>
        {tasks && tasks.filter((t) => !t.is_complete).length > 0 ? (
          <span className="bg-text-active text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {tasks.filter((t) => !t.is_complete).length}
          </span>
        ) : null}
      </button>

      {/* Task Panel */}
      {isOpen && (
        <div
          className={`mt-1 w-[350px] bg-primary/10 backdrop-blur-xl rounded-md overflow-hidden transform transition-all duration-800 ease-out ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              <ResponsiveButton
                onClick={() => setIsAddingTask(!isAddingTask)}
                disabled={createTask.isPending}
                className={`p-1.5 !bg-green-400/70 !text-text-active h-[30px] rounded-lg cursor-pointer font-medium`}
                title="Add Task"
              >
                New task
              </ResponsiveButton>
              <ResponsiveButton
                onClick={openClearConfirm}
                disabled={deleteCompleted.isPending}
                className={`p-1.5 !bg-red-500/70 !text-text-active h-[30px] rounded-lg cursor-pointer font-medium`}
                title="Clear Completed"
              >
                Clear completed task
              </ResponsiveButton>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="justify-self-end p-1.5 hover:bg-white/10 rounded-lg text-white/60 transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>

          <div className="p-3 max-h-[350px] overflow-y-auto custom-scrollbar scrollbar-hidden">
            {isAddingTask && (
              <div className="flex flex-col mb-3 p-3 bg-white/5 border border-white/10 rounded-sm gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <TextInput
                  label="Title"
                  placeholder="Task title..."
                  leftSection={<IconPencil size={16} />}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <DateInput
                  label="Due date & time"
                  value={newTaskDate}
                  onChange={setNewTaskDate}
                  min={new Date().toISOString().split("T")[0]}
                  size="sm"
                  withTime
                  timeValue={newTaskTime}
                  onTimeChange={setNewTaskTime}
                />

                <button
                  onClick={handleCreate}
                  disabled={createTask.isPending || !newTaskTitle.trim()}
                  className={`w-full py-2 rounded-md text-xs font-bold transition-all mt-1 ${
                    createTask.isPending || !newTaskTitle.trim() || !newTaskTime
                      ? "bg-white/30 text-white/40 cursor-not-allowed border border-white/5"
                      : "bg-text-active text-primary hover:bg-text-active/80 active:scale-[0.98]"
                  }`}
                >
                  {createTask.isPending ? "ADDING..." : "ADD TASK"}
                </button>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-text-active"></div>
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div className="flex flex-row flex-wrap gap-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex flex-col gap-2 p-2 rounded-sm w-full transition-all border ${
                      task.is_complete
                        ? "bg-green-500/10 border-green-500/20 text-text-active"
                        : "bg-white/5 border-white/10 text-white"
                    } group`}
                  >
                    {editingTaskId === task._id ? (
                      <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <TextInput
                          label="Edit Title"
                          value={editTitle}
                          leftSection={<IconPencil size={16} />}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <DateInput
                          label="Due date & time"
                          value={editDate}
                          onChange={setEditDate}
                          min={new Date().toISOString().split("T")[0]}
                          size="sm"
                          withTime
                          timeValue={editTime}
                          onTimeChange={setEditTime}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="flex-1 py-1.5 bg-white/5 text-white/50 rounded-sm text-sm font-bold hover:bg-white/10 transition-colors"
                          >
                            CANCEL
                          </button>
                          <button
                            onClick={() => handleUpdateSave(task._id)}
                            disabled={updateTask.isPending || !editTitle.trim()}
                            className="flex-[2] py-1.5 bg-text-active text-primary rounded-sm text-sm font-bold hover:bg-text-active/80 transition-colors"
                          >
                            {updateTask.isPending ? "SAVING..." : "SAVE"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() =>
                              updateTask.mutate({
                                taskId: task._id,
                                data: { is_complete: !task.is_complete },
                              })
                            }
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                              task.is_complete
                                ? "bg-green-500 border-green-500 text-primary"
                                : "border-white/30 hover:border-text-active"
                            }`}
                          >
                            {task.is_complete && (
                              <IconCheck size={14} stroke={4} />
                            )}
                          </button>

                          <div className="flex flex-col flex-1 min-w-0">
                            <span
                              className={`text-base select-none break-words ${
                                task.is_complete ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.time_complete && (
                              <span className="text-md text-text-inactive mt-0.5">
                                {task.time_complete.includes("T")
                                  ? new Date(
                                      task.time_complete
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : task.time_complete}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                            <button
                              onClick={() => startEditing(task)}
                              className="p-1 hover:text-yellow-500 transition-colors"
                              title="Edit Task"
                            >
                              <IconPencil size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(task._id)}
                              className="p-1 hover:text-red-400 transition-colors"
                              title="Delete Task"
                            >
                              <IconTrash size={20} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : isAddingTask ? (
              <></>
            ) : (
              <div className="flex flex-col text-center text-text-inactive italic text-md">
                <p> No tasks for today. </p>
                <p> Start fresh!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      <Modal
        opened={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title="Confirm Action"
        className="!max-w-[400px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-white/80">
            <div
              className={`p-2 rounded-full ${
                confirmModal.type === "delete"
                  ? "bg-red-500/20"
                  : "bg-yellow-500/20"
              }`}
            >
              <IconAlertCircle
                size={24}
                className={
                  confirmModal.type === "delete"
                    ? "text-red-500"
                    : "text-yellow-500"
                }
              />
            </div>
            <p className="text-sm font-medium">{confirmModal.message}</p>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, isOpen: false }))
              }
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmModal.onConfirm}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                confirmModal.type === "delete"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-yellow-500 text-black hover:bg-yellow-600"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Tasks;
