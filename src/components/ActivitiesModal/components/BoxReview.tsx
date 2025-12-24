import {
  IconClock,
  IconNotes,
  IconTag,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ResponsiveButton from "../../ResponsiveButton";
import TextInput from "../../TextInput";
import {
  useUpdateSessionNote,
  useUpdateSessionTag,
} from "@rizumu/tanstack/api/hooks";
import { useToast } from "@rizumu/utils/toast/toast";

interface BoxReviewProps {
  data: any;
  tags: any[];
}

function BoxReview({ data, tags }: BoxReviewProps) {
  const toast = useToast();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [note, setNote] = useState(data.notes || "");
  const [tempNote, setTempNote] = useState(data.notes || "");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [currentTagId, setCurrentTagId] = useState(data.tag_id);

  const tagButtonRef = useRef<HTMLDivElement>(null);
  const updateNote = useUpdateSessionNote();
  const updateTag = useUpdateSessionTag();

  const selectedTag = tags.find((t) => t._id === currentTagId);

  const d = new Date(data.started_at);

  useEffect(() => {
    if (isEditingTag && tagButtonRef.current) {
      const rect = tagButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: 200,
      });
    }
  }, [isEditingTag]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isEditingTag &&
        !target.closest(".tag-dropdown-portal") &&
        !tagButtonRef.current?.contains(target)
      ) {
        setIsEditingTag(false);
      }
    };
    if (isEditingTag) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingTag]);

  useEffect(() => {
    setNote(data.notes || "");
    setTempNote(data.notes || "");
    setCurrentTagId(data.tag_id);
  }, [data.notes, data.tag_id]);

  const handleEditNoteClick = () => {
    setTempNote(note);
    setIsEditingNote(true);
  };

  const handleSaveNote = async () => {
    if (tempNote === note) {
      setIsEditingNote(false);
      return;
    }
    updateNote.mutate(
      { sessionId: data._id, notes: tempNote },
      {
        onSuccess: () => {
          toast.success("Update session note", "Success");
          setNote(tempNote);
          setIsEditingNote(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update",
            "Error"
          );
        },
      }
    );
  };

  const handleTagChange = async (newTagId: string | "") => {
    if (newTagId === data.tag_id) {
      setIsEditingTag(false);
      return;
    }
    // console.log(newTagId, data._id);
    updateTag.mutate(
      { sessionId: data._id, tagId: newTagId || "" },
      {
        onSuccess: () => {
          toast.success("Update session tag", "Success");
          setCurrentTagId(newTagId);
          setIsEditingTag(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update",
            "Error"
          );
        },
      }
    );
  };

  const getDuration = (duration: number) => {
    if (duration < 60) {
      return "0m " + duration.toString().padStart(2, "0") + "s";
    }
    if (duration < 3600) {
      return (
        Math.floor(duration / 60) +
        "m " +
        (duration - Math.floor(duration / 60) * 60)
          .toString()
          .padStart(2, "0") +
        "s"
      );
    }
    return (
      Math.floor(duration / 3600) +
      "h " +
      Math.floor((duration - Math.floor(duration / 3600) * 3600) / 60)
        .toString()
        .padStart(2, "0") +
      "m"
    );
  };

  return (
    <div className="flex items-center relative p-0 sm:pl-6 sm:pb-4 w-full text-base">
      <div className="text-text-inactive text-right w-[40px]">
        {d.getHours() + ":" + d.getMinutes().toString().padStart(2, "0")}
      </div>
      <div className="absolute left-14 sm:left-24 ml-[1px] w-3 h-3 bg-white rounded-full border-2 border-black/30 z-10 transform -translate-x-1/2"></div>
      <div className="flex-1 ml-10 sm:ml-20 mb-4 sm:mb-0 p-3 pb-2 bg-black/10 rounded-xl border border-white/20 min-h-[100px]">
        <div className="flex items-center gap-2 mb-2">
          <IconClock size={20} />
          <p className="font-semibold">{getDuration(data.duration)}</p>
          <div className="flex justify-center items-center bg-green-500 text-primary text-sm px-2 rounded-full">
            Focus
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconTag size={20} className="text-text-inactive" />
          <div
            ref={tagButtonRef}
            onClick={() => {
              if (!updateTag.isPending && !updateNote.isPending) {
                setIsEditingTag(!isEditingTag);
              }
            }}
            className="flex items-center gap-2 px-2 py-0.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
          >
            {selectedTag ? (
              <>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedTag.color }}
                />
                <span className="text-sm font-medium text-text-active">
                  {selectedTag.name}
                </span>
              </>
            ) : (
              <span className="text-sm italic text-text-inactive">
                Select tag
              </span>
            )}
            <IconChevronDown
              size={14}
              className="text-text-inactive group-hover:text-text-active"
            />
          </div>

          {isEditingTag &&
            createPortal(
              <div
                className="fixed z-[9999] bg-zinc-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden tag-dropdown-portal min-w-[180px]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar scrollbar-hidden">
                  {/* Option to clear tag */}
                  <button
                    onClick={() => handleTagChange("")}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/10 text-sm text-text-inactive transition-colors border-b border-white/5"
                  >
                    <div className="w-2.5 h-2.5 rounded-full border border-dashed border-white/30" />
                    <span>No tag</span>
                  </button>

                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => handleTagChange(tag._id)}
                      className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-white/10 text-sm transition-colors text-left ${
                        data.tag_id === tag._id
                          ? "bg-white/10 text-text-active"
                          : "text-text-inactive"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="truncate">{tag.name}</span>
                    </button>
                  ))}
                </div>
              </div>,
              document.body
            )}
        </div>

        <div className="flex gap-2">
          <div
            className={`flex items-center h-[35px] ${
              isEditingNote && "items-start"
            }`}
          >
            <IconNotes size={20} className={`${isEditingNote && "mt-4"}`} />
            {!isEditingNote && (
              <ResponsiveButton
                onClick={handleEditNoteClick}
                className={`hover:text-text-active text-base cursor-pointer bg-transparent hover:bg-transparent sm:-ml-1 ${
                  !note && "text-text-inactive italic"
                }`}
              >
                {note || "Click to add note..."}
              </ResponsiveButton>
            )}
          </div>
          {isEditingNote && (
            <div className="flex flex-col gap-2 flex-1 mt-2">
              <TextInput
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Enter your note..."
                size="sm"
                variant="default"
                autoFocus
                disabled={updateTag.isPending || updateNote.isPending}
              />
              <div className="flex justify-end gap-2">
                <ResponsiveButton
                  onClick={() => setIsEditingNote(false)}
                  className="h-[30px]"
                >
                  Cancel
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleSaveNote}
                  disabled={updateTag.isPending || updateNote.isPending}
                  className="bg-secondary hover:bg-secondary !text-primary h-[30px]"
                >
                  {updateTag.isPending || updateNote.isPending
                    ? "Saving..."
                    : "Save"}
                </ResponsiveButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoxReview;
