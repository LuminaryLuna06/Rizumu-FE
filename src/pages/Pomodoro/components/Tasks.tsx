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
import { useToast } from "@rizumu/utils/toast/toast";

function Tasks() {
  const toast = useToast();
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
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
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
          toast.success("Task created successfully!", "Success");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to create task",
            "Error"
          );
        },
      }
    );
  };

  const startEditing = (task: ModelTask) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    if (task.time_complete && task.time_complete.includes("T")) {
      const date = new Date(task.time_complete);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      setEditDate(`${year}-${month}-${day}`);

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      setEditTime(`${hours}:${minutes}`);
    } else {
      setEditDate("");
      setEditTime("");
    }
  };

  const handleUpdateSave = (taskId: string) => {
    if (!editTitle.trim()) return;
    setIsEditing(true);
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
          setIsEditing(false);
          toast.success("Task updated successfully!", "Success");
        },
        onError: (error: any) => {
          setIsEditing(false);
          toast.error(
            error?.response?.data?.message || "Failed to update task",
            "Error"
          );
        },
      }
    );
  };

  const openDeleteConfirm = (taskId: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to delete this task?",
      onConfirm: () => {
        setIsDeleting(true);
        deleteTask.mutate(taskId, {
          onSuccess: () => {
            toast.success("Task deleted successfully!", "Success");
            setIsDeleting(false);
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          },
          onError: (error: any) => {
            setIsDeleting(false);
            toast.error(
              error?.response?.data?.message || "Failed to delete task",
              "Error"
            );
          },
        });
      },
    });
  };

  const openClearConfirm = () => {
    setConfirmModal({
      isOpen: true,
      message: "Clear all completed tasks?",
      onConfirm: () => {
        deleteCompleted.mutate(undefined, {
          onSuccess: () => {
            toast.success("Completed tasks cleared!", "Success");
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to clear completed tasks",
              "Error"
            );
          },
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const getBackground = (task: ModelTask) => {
    if (task.is_complete) {
      return "bg-green-500/10 border-green-500/30";
    }

    if (new Date(task.time_complete) < new Date()) {
      return "bg-red-500/30 border-red-500/30";
    }
    return "bg-white/5 border-white/30 text-white";
  };

  const unAvailable =
    !!editingTaskId || isAddingTask || isEditing || isDeleting || isChanging;
  return (
    <div id="tasks-container" className="fixed top-20 left-4">
      {/* Task Toggle Button */}
      <ResponsiveButton
        onClick={() => setIsOpen(!isOpen)}
        className="!bg-primary-hover !hover:bg-primary-hover/80 backdrop-blur-xl h-[40px] !px-4 !py-2"
        leftSection={<IconListCheck size={18} />}
      >
        <span className="text-sm font-medium">Tasks</span>
        {tasks && tasks.filter((t) => !t.is_complete).length > 0 ? (
          <span className="bg-text-active text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {tasks.filter((t) => !t.is_complete).length}
          </span>
        ) : null}
      </ResponsiveButton>

      {/* Task Panel */}
      {isOpen && (
        <div
          className={`mt-1 w-[350px] bg-primary/10 backdrop-blur-xl rounded-md overflow-visible transform transition-all duration-800 ease-out ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          {/* Task Header */}
          <div className="px-3 py-2 border-b border-white/5 flex items-center">
            {!isAddingTask && !editingTaskId && (
              <div className="mr-auto flex gap-2">
                <ResponsiveButton
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  disabled={unAvailable}
                  className={`p-1.5 !bg-primary-hover !hover:bg-primary-hover/80 !text-text-active h-[30px] rounded-lg cursor-pointer font-medium`}
                  title="Add Task"
                >
                  Add
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={openClearConfirm}
                  disabled={unAvailable}
                  className={`p-1.5 !bg-primary-hover !hover:bg-primary-hover/80 !text-text-active h-[30px] rounded-lg cursor-pointer font-medium`}
                  title="Clear Completed"
                >
                  Clear Completed
                </ResponsiveButton>
              </div>
            )}
            <ResponsiveButton
              onClick={() => setIsOpen(false)}
              className="ml-auto !p-1.5 rounded-lg !text-text-active !bg-transparent !hover:bg-white/10"
            >
              <IconX size={18} />
            </ResponsiveButton>
          </div>

          <div className="p-3 h-[45vh] md:h-[30vh] overflow-y-auto custom-scrollbar scrollbar-hidden">
            {/* Adding panel */}
            {isAddingTask && (
              <div className="flex flex-col mb-3 p-3 bg-white/5 border border-white/30 rounded-sm gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className="mb-2"
                />

                <div className="flex gap-2">
                  <ResponsiveButton
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className="flex-1 !py-1.5 !px-2 !bg-white/5 !text-white/50 rounded-md !text-xs font-bold !hover:bg-white/10 transition-colors justify-center"
                  >
                    CANCEL
                  </ResponsiveButton>
                  <ResponsiveButton
                    onClick={handleCreate}
                    disabled={
                      createTask.isPending ||
                      !newTaskTitle.trim() ||
                      !newTaskTime
                    }
                    className={`flex-2 !py-2 rounded-md !text-xs font-bold transition-all justify-center ${
                      createTask.isPending ||
                      !newTaskTitle.trim() ||
                      !newTaskTime
                        ? "!bg-white/30 !text-white/40 cursor-not-allowed border border-white/5"
                        : "!bg-text-active !text-primary !hover:bg-text-active/80 active:scale-[0.98]"
                    }`}
                  >
                    {createTask.isPending ? "ADDING..." : "ADD TASK"}
                  </ResponsiveButton>
                </div>
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
                    className={`flex flex-col gap-2 p-2 rounded-sm w-full transition-all border ${getBackground(
                      task
                    )} group`}
                  >
                    {/* Editing Panel */}
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
                          <ResponsiveButton
                            onClick={() => setEditingTaskId(null)}
                            className="flex-1 !py-1.5 !bg-white/5 !text-white/50 rounded-sm !text-sm font-bold !hover:bg-white/10 transition-colors justify-center"
                          >
                            CANCEL
                          </ResponsiveButton>
                          <ResponsiveButton
                            onClick={() => handleUpdateSave(task._id)}
                            disabled={isEditing || !editTitle.trim()}
                            className={`flex-[2] !py-1.5 !bg-text-active !text-primary rounded-sm !text-sm font-bold !hover:bg-text-active/80 transition-colors justify-center ${
                              isEditing || !editTitle.trim()
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isEditing ? "SAVING..." : "SAVE"}
                          </ResponsiveButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          {/* CheckBox */}
                          <ResponsiveButton
                            disabled={unAvailable}
                            onClick={() => {
                              setIsChanging(true);
                              updateTask.mutate(
                                {
                                  taskId: task._id,
                                  data: { is_complete: !task.is_complete },
                                },
                                {
                                  onSuccess: () => {
                                    setIsChanging(false);
                                    toast.success(
                                      task.is_complete
                                        ? "Task marked as incomplete"
                                        : "Task completed!",
                                      "Success"
                                    );
                                  },
                                  onError: (error: any) => {
                                    setIsChanging(false);
                                    toast.error(
                                      error?.response?.data?.message ||
                                        "Failed to update task status",
                                      "Error"
                                    );
                                  },
                                }
                              );
                            }}
                            className={`!w-5 !h-5 !rounded-full !border-2 !flex items-center justify-center transition-colors cursor-pointer mt-[2px] !p-0 ${
                              task.is_complete
                                ? "!bg-green-500 !border-green-500"
                                : new Date(task.time_complete) < new Date()
                                ? "!bg-red-500 !border-red-500"
                                : "!bg-transparent !border-white/30 hover:!border-text-active"
                            } ${
                              unAvailable
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {task.is_complete ? (
                              <IconCheck size={14} stroke={4} />
                            ) : new Date(task.time_complete) < new Date() ? (
                              <IconX size={14} stroke={4} />
                            ) : null}
                          </ResponsiveButton>
                          {/* Task's in4*/}
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
                                    ).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour12: false,
                                    })
                                  : task.time_complete}
                              </span>
                            )}
                          </div>
                          {/* Task's btn */}
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all ml-auto">
                            <ResponsiveButton
                              onClick={() => startEditing(task)}
                              disabled={unAvailable}
                              className={`!p-1 !bg-transparent !text-text-active hover:!text-yellow-500 transition-colors ${
                                unAvailable
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Edit Task"
                            >
                              <IconPencil size={18} />
                            </ResponsiveButton>
                            <ResponsiveButton
                              onClick={() => openDeleteConfirm(task._id)}
                              disabled={unAvailable}
                              className={`!p-1 !bg-transparent !text-text-active hover:!text-red-400 transition-colors ${
                                unAvailable
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title="Delete Task"
                            >
                              <IconTrash size={20} />
                            </ResponsiveButton>
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
            <div className="p-2 rounded-full bg-red-500/20">
              <IconAlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-sm font-medium">{confirmModal.message}</p>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <ResponsiveButton
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, isOpen: false }))
              }
              className="!px-4 !py-2 !bg-white/5 !hover:bg-white/10 rounded-lg !text-sm font-medium transition-colors"
            >
              Cancel
            </ResponsiveButton>
            <ResponsiveButton
              onClick={confirmModal.onConfirm}
              disabled={isDeleting}
              className={`!px-4 !py-2 rounded-lg !text-sm font-bold transition-all ${
                isDeleting
                  ? "opacity-50 cursor-not-allowed"
                  : "!bg-red-500 !text-white !hover:bg-red-600"
              }`}
            >
              {isDeleting ? "Processing..." : "Confirm"}
            </ResponsiveButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Tasks;
