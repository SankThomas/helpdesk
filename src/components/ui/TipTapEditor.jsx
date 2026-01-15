import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "./Button";

const ToolbarButton = ({ onClick, isActive, children, title }) => (
  <Button
    size="sm"
    onClick={onClick}
    title={title}
    type="button"
    variant={isActive ? "primary" : "outline"}
    className="size-12 p-0"
  >
    {children}
  </Button>
);

const TipTapEditor = forwardRef(
  ({ content, onChange, placeholder = "Add a comment" }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder }),
        CharacterCount.configure({ limit: 10000 }),
      ],
      content: content || "",
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm max-w-none focus:outline-none p-4 min-h-80 max-h-96 overflow-auto",
        },
      },
    });

    useEffect(() => {
      if (!editor) return;

      const currentHTML = editor.getHTML();
      if (content !== currentHTML) {
        editor.commands.setContent(content || "", false);
      }
    }, [content, editor]);

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      getEditor: () => editor,
    }));

    if (!editor) return null;

    return (
      <div className="w-full">
        {/* Toolbar */}
        <div className="border-surface-200 bg-surface-50 border-b p-2">
          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold (Ctrl + B)"
            >
              <Bold className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Code"
            >
              <Code className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="size-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="size-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Editor footer */}
        <div className="border-surface-200 bg-surface-50 text-surface-500 border-t p-2 text-xs">
          <div className="flex justify-between">
            <span>
              {editor.storage.characterCount.characters()} characters ,{" "}
              {editor.storage.characterCount.words()} words
            </span>

            <span>Limit: {editor.storage.characterCount.characters()}</span>
          </div>
        </div>
      </div>
    );
  },
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;
