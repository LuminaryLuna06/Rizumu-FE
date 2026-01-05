import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/FormComponent/TextInput";
import { TAG_COLORS } from "@rizumu/constants/tagColors";
import type { ModelTag } from "@rizumu/models/tag";
import {
  IconChevronDown,
  IconPlus,
  IconX,
  IconCheck,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  useCreateTag,
  useDeleteTag,
  useTags,
  useUpdateTag,
} from "@rizumu/tanstack/api/hooks/useTag";
import { useToast } from "@rizumu/utils/toast/toast";
import { useAuth } from "@rizumu/context/AuthContext";

interface TagSelectorProps {
  selectedTag: ModelTag | null;
  onTagSelect: (tag: ModelTag | null) => void;
}

function TagSelector({ selectedTag, onTagSelect }: TagSelectorProps) {
  const toast = useToast();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<string>(TAG_COLORS[0].value);
  const [tagLoading, setTagLoading] = useState(false);
  const [editingTag, setEditingTag] = useState<ModelTag | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: tags } = useTags(!!user);
  const update = useUpdateTag();
  const deleteTag = useDeleteTag();
  const create = useCreateTag();

  useEffect(() => {
    if (tags && selectedTag) {
      const currentTag = tags.find((t) => t._id === selectedTag._id);
      // Don't have => Null
      if (!currentTag) {
        onTagSelect(null);
        // Update tag after edit
      } else if (
        currentTag.name !== selectedTag.name ||
        currentTag.color !== selectedTag.color
      ) {
        onTagSelect(currentTag);
      }
    }
  }, [tags, selectedTag, onTagSelect]);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: window.innerWidth < 768 ? 200 : 250,
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
      if (editingTag) {
        update.mutate(
          {
            tagId: editingTag._id,
            data: { name: newTagName.trim(), color: newTagColor },
          },
          {
            onSuccess: () => {
              toast.success("Update tag successfully!", "Success");
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to update tag",
                "Error"
              );
            },
          }
        );
      } else {
        create.mutate(
          { name: newTagName.trim(), color: newTagColor },
          {
            onSuccess: () => {
              toast.success("Create tag successfully!", "Success");
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to create tag",
                "Error"
              );
            },
          }
        );
      }

      setNewTagName("");
      setNewTagColor(TAG_COLORS[0].value);
      setShowCreateTag(false);
      setEditingTag(null);
    } catch (error) {
      console.error("Error saving tag:", error);
    } finally {
      setTagLoading(false);
    }
  };

  const handleOpenEdit = (e: React.MouseEvent, tag: ModelTag) => {
    e.stopPropagation();
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setShowCreateTag(true);
  };

  const handleDeleteTag = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();

    deleteTag.mutate(tagId, {
      onSuccess: () => {
        toast.success("Delete tag successfully!", "Success");
        if (selectedTag?._id === tagId) {
          onTagSelect(null);
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete tag",
          "Error"
        );
      },
    });
  };

  const handleCancelCreateTag = () => {
    setNewTagName("");
    setNewTagColor(TAG_COLORS[0].value);
    setShowCreateTag(false);
    setEditingTag(null);
  };

  return (
    <div aria-label="Tag selector" title="Tag selector">
      <div className="tag-dropdown-container">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center bg-primary-hover rounded-lg px-sm py-sm lg:px-md lg:py-sm cursor-pointer text-secondary/90 hover:bg-primary-hover/80 transition-all min-w-[120px] md:min-w-[150px] justify-between text-sm md:text-base"
        >
          <div className="flex items-center gap-2 mr-2">
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
                  <h3 className="font-semibold text-white">
                    {editingTag ? "Edit Tag" : "New Tag"}
                  </h3>
                  <button
                    onClick={handleCancelCreateTag}
                    className="text-secondary/60 hover:text-secondary transition-colors"
                  >
                    <IconX size={18} />
                  </button>
                </div>
                <TextInput
                  placeholder="Tag name"
                  value={newTagName}
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
                        className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
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
                    {tagLoading ? "" : editingTag ? "Update" : "Create"}
                  </ResponsiveButton>
                </div>
              </div>
            ) : (
              /* Tag List */
              <>
                <div className="max-h-[14vh] md:max-h-[28vh] lg:max-h-[14vh] overflow-y-auto custom-scrollbar scrollbar-hidden font-light">
                  {tags && tags.length > 0 ? (
                    tags.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagSelect(tag)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-secondary/5 transition-colors text-left text-text-inactive cursor-pointer group ${
                          selectedTag?._id === tag._id ? "bg-secondary/20" : ""
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="flex-3 text-secondary/90">
                          {tag.name}
                        </span>
                        <div className="flex gap-1">
                          <IconPencil
                            size={20}
                            className="flex-1 cursor-pointer hover:text-text-active transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleOpenEdit(e, tag)}
                          />
                          <IconTrash
                            size={20}
                            className="flex-1 cursor-pointer hover:text-text-active transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteTag(e, tag._id)}
                          />
                        </div>
                      </button>
                    ))
                  ) : (
                    <></>
                  )}
                </div>

                <button
                  onClick={() => setShowCreateTag(true)}
                  className="w-full px-3 py-2 flex items-center justify-center gap-2 bg-black hover:bg-white/10 transition-colors text-sm text-gray-300 hover:text-white border-t border-white/10 cursor-pointer"
                >
                  <IconPlus size={18} />
                  <span>Add Tag</span>
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export default TagSelector;
