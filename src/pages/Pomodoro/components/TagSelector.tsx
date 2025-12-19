import axiosClient from "@rizumu/api/config/axiosClient";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { TAG_COLORS } from "@rizumu/constants/tagColors";
import type { ModelTag } from "@rizumu/models/tag";
import {
  IconChevronDown,
  IconPlus,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface TagSelectorProps {
  selectedTag: ModelTag | null;
  onTagSelect: (tag: ModelTag) => void;
}

function TagSelector({ selectedTag, onTagSelect }: TagSelectorProps) {
  const [tags, setTags] = useState<ModelTag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<string>(TAG_COLORS[0].value);
  const [tagLoading, setTagLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchTags = async () => {
    try {
      const response = await axiosClient.get("/tags");
      console.log(response.data);
      setTags(response.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest(".tag-dropdown-container")) {
        setShowDropdown(false);
        setShowCreateTag(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleTagSelect = (tag: ModelTag) => {
    onTagSelect(tag);
    setShowDropdown(false);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setTagLoading(true);
    try {
      await axiosClient.post("/tags", {
        name: newTagName.trim(),
        color: newTagColor,
      });
      await fetchTags();
      setNewTagName("");
      setNewTagColor(TAG_COLORS[0].value);
      setShowCreateTag(false);
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setTagLoading(false);
    }
  };

  const handleCancelCreateTag = () => {
    setNewTagName("");
    setNewTagColor(TAG_COLORS[0].value);
    setShowCreateTag(false);
  };

  return (
    <>
      <div className="tag-dropdown-container">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center bg-primary-hover rounded-lg px-lg py-md cursor-pointer text-secondary/90 hover:bg-primary-hover/80 transition-all min-w-[250px] justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedTag && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedTag.color }}
              />
            )}
            <span>{selectedTag ? selectedTag.name : "Select a tag"}</span>
          </div>
          <IconChevronDown
            size={20}
            className={`transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showDropdown &&
        createPortal(
          <div
            className="fixed bg-primary/85 rounded-lg shadow-xl overflow-hidden border border-secondary/10 tag-dropdown-container"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {showCreateTag ? (
              /* Create Tag Form */
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">New Tag</h3>
                  <button
                    onClick={handleCancelCreateTag}
                    className="text-secondary/60 hover:text-secondary transition-colors"
                  >
                    <IconX size={18} />
                  </button>
                </div>
                <TextInput
                  placeholder="Tag name"
                  onChange={(e) => setNewTagName(e.target.value)}
                  autoFocus
                />

                <div className="space-y-2">
                  {/* <label className="text-sm text-secondary/60">Color</label> */}
                  <div className="grid grid-cols-6 gap-2 p-1">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewTagColor(color.value)}
                        className={`w-5 h-5 rounded-full transition-all ${
                          newTagColor === color.value
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <ResponsiveButton
                    onClick={handleCancelCreateTag}
                    className="flex-1 justify-center"
                  >
                    Cancel
                  </ResponsiveButton>
                  <ResponsiveButton
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || tagLoading}
                    className="flex-1 font-semibold bg-secondary hover:bg-secondary/90 !text-primary/90"
                    leftSection={
                      tagLoading ? (
                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <IconCheck size={18} />
                      )
                    }
                  >
                    {tagLoading ? "" : "Create"}
                  </ResponsiveButton>
                </div>
              </div>
            ) : (
              /* Tag List */
              <>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar font-light">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagSelect(tag)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-secondary/5 transition-colors text-left"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-secondary/90">{tag.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-secondary/70">
                      No tags yet
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowCreateTag(true)}
                  className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-black hover:bg-white/10 transition-colors text-gray-300 hover:text-white border-t border-white/10"
                >
                  <IconPlus size={18} />
                  <span>Add Tag</span>
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

export default TagSelector;
