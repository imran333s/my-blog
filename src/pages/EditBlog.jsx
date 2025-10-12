// src/components/EditBlogModal.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import "./EditBlog.css";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditBlogModal = ({ blogId, onClose, onUpdate }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]); // ✅ Add this
  const [status, setStatus] = useState(null);

  // initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit, // Bold, Italic, Strike, Paragraph, etc.
      Underline,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
    ],
    content: "",
  });

  // ✅ Fetch categories dynamically from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);

        // Filter only active categories if needed
        const activeCategories = res.data.filter(
          (cat) => cat.status?.toLowerCase() === "active"
        );

        // Convert to react-select format
        const formatted = activeCategories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));

        setCategoryOptions(formatted);
      } catch (err) {
        console.error("Error fetching categories:", err);
        Swal.fire("Error", "Could not load categories", "error");
      }
    };

    fetchCategories();
  }, [API_URL]);

  // fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${blogId}`);
        setTitle(res.data.title || "");
        setImage(res.data.image || "");
        if (res.data.category) {
          setCategories(
            res.data.category
              .split(",")
              .map((c) => ({ value: c.trim(), label: c.trim() }))
          );
        }
        if (res.data.status) {
          setStatus({ value: res.data.status, label: res.data.status });
        }
        if (editor) editor.commands.setContent(res.data.content || "");
      } catch (err) {
        console.error(err);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId, API_URL, editor]);

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Select category",
        text: "Please select at least one category",
      });
    }
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Not authorized", "error");

    try {
      await axios.put(
        `${API_URL}/api/blogs/${blogId}`,
        {
          title,
          image,
          content: editor.getHTML(),
          category: categories.map((c) => c.value).join(", "),
          status: status ? status.value : "Active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Blog updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update blog", "error");
    }
  };

  // toolbar button helper
  const toolbarButton = (label, command, isActive) => (
    <button
      type="button"
      onClick={command}
      className={isActive ? "active" : ""}
      title={label}
    >
      {label}
    </button>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Blog</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="blog-form">
          <label>Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Category</label>
          <Select
            options={categoryOptions}
            isMulti
            value={categories}
            onChange={setCategories}
            placeholder="Select categories..."
          />

          <label>Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status..."
          />

          <label>Content</label>
          {editor && (
            <div className="editor-toolbar">
              {toolbarButton(
                "Normal",
                () =>
                  editor
                    .chain()
                    .focus()
                    .unsetAllMarks()
                    .clearNodes()
                    .setParagraph()
                    .run(),
                editor.isActive("paragraph")
              )}

              {toolbarButton(
                "B",
                () => editor.chain().focus().toggleBold().run(),
                editor.isActive("bold")
              )}
              {toolbarButton(
                "I",
                () => editor.chain().focus().toggleItalic().run(),
                editor.isActive("italic")
              )}
              {toolbarButton(
                "U",
                () => editor.chain().focus().toggleUnderline().run(),
                editor.isActive("underline")
              )}
              {toolbarButton(
                "S",
                () => editor.chain().focus().toggleStrike().run(),
                editor.isActive("strike")
              )}

              {toolbarButton(
                "H1",
                () => {
                  if (!editor) return;
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                },
                editor.isActive("heading", { level: 1 })
              )}

              {toolbarButton(
                "H2",
                () => {
                  if (!editor) return;
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                },
                editor.isActive("heading", { level: 2 })
              )}

              {toolbarButton(
                "• List",
                () => editor.chain().focus().toggleBulletList().run(),
                editor.isActive("bulletList")
              )}

              {toolbarButton(
                "1. List",
                () => editor.chain().focus().toggleOrderedList().run(),
                editor.isActive("orderedList")
              )}
            </div>
          )}

          <EditorContent editor={editor} className="editor" />

          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
