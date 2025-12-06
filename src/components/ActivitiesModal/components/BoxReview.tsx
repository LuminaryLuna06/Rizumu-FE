import { IconClock, IconNotes } from "@tabler/icons-react";
import { useState } from "react";
import ResponsiveButton from "../../ResponsiveButton";
import TextInput from "../../TextInput";

interface BoxReviewProps {
  time: any;
  duration: any;
}

function BoxReview({ time, duration }: BoxReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState("");
  const [tempNote, setTempNote] = useState("");

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

  return (
    <div className="flex items-center relative pl-6 pb-4 w-full">
      <div className="text-text-inactive text-right">{time}</div>
      <div className="absolute left-14 sm:left-24 ml-[1px] w-3 h-3 bg-white rounded-full border-2 border-black/30 z-10 transform -translate-x-1/2"></div>
      <div className="flex-1 ml-20 p-4 bg-black/10 rounded-xl border border-white/20 min-h-[100px]">
        <div className={`flex items-center gap-2 ${isEditing && "mb-md"}`}>
          <IconClock size={16} />
          <p className="font-semibold">{duration}</p>
          <div className="flex justify-center items-center bg-green-500 text-primary text-sm px-2 rounded-full">
            Focus
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`flex items-center ${isEditing && "items-start"}`}>
            <IconNotes size={16} className={`${isEditing && "mt-2"}`} />
            {!isEditing && (
              <ResponsiveButton
                onClick={handleEditClick}
                className={`hover:text-text-active text-sm cursor-pointer bg-transparent hover:bg-transparent -ml-2 ${
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
                <ResponsiveButton onClick={handleSave} className="h-[30px]">
                  Cancel
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleCancel}
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
