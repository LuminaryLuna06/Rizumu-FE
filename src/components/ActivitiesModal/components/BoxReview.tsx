import { IconClock, IconNotes } from "@tabler/icons-react";
import { useState } from "react";
import ResponsiveButton from "../../ResponsiveButton";
import TextInput from "../../TextInput";

interface BoxReviewProps {
  data: any;
}

function BoxReview({ data }: BoxReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState("");
  const [tempNote, setTempNote] = useState("");

  const d = new Date(data.started_at);
  const handleEditClick = () => {
    setTempNote(note);
    setIsEditing(true);
  };

  const handleSave = () => {
    setNote(tempNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempNote(note);
    setIsEditing(false);
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
        {d.getHours() + ":" + d.getMinutes()}
      </div>
      <div className="absolute left-14 sm:left-24 ml-[1px] w-3 h-3 bg-white rounded-full border-2 border-black/30 z-10 transform -translate-x-1/2"></div>
      <div className="flex-1 ml-10 sm:ml-20 mb-4 sm:mb-0 p-4 bg-black/10 rounded-xl border border-white/20 min-h-[100px]">
        <div className={`flex items-center gap-2 ${isEditing && "mb-md"}`}>
          <IconClock size={20} />
          <p className="font-semibold">{getDuration(data.duration)}</p>
          <div className="flex justify-center items-center bg-green-500 text-primary text-sm px-2 rounded-full">
            Focus
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`flex items-center ${isEditing && "items-start"}`}>
            <IconNotes size={20} className={`${isEditing && "mt-2"}`} />
            {!isEditing && (
              <ResponsiveButton
                onClick={handleEditClick}
                className={`hover:text-text-active text-base cursor-pointer bg-transparent hover:bg-transparent sm:-ml-1 ${
                  !note && "text-text-inactive font-styte: italic"
                }`}
              >
                {note || "Click to edit note"}
              </ResponsiveButton>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col gap-2">
              <TextInput
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Enter your note..."
                size="sm"
                variant="default"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <ResponsiveButton onClick={handleCancel} className="h-[30px]">
                  Cancel
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleSave}
                  className="bg-secondary hover:bg-secondary !text-primary h-[30px]"
                >
                  Save
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
