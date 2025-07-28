import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

function WYSIWYGEditor({ content, onChange }) {
const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Underline,
    ],
    content: content || '<p>Start typing your email content...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200">
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2"
        >
          <ApperIcon name="Bold" size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2"
        >
          <ApperIcon name="Italic" size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('underline') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="p-2"
        >
          <ApperIcon name="Underline" size={16} />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-2" />
        
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="p-2"
        >
          H1
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="p-2"
        >
          H2
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('paragraph') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="p-2"
        >
          P
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-2" />
        
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="p-2"
        >
          <ApperIcon name="AlignLeft" size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="p-2"
        >
          <ApperIcon name="AlignCenter" size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="p-2"
        >
          <ApperIcon name="AlignRight" size={16} />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-2" />
        
        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-2"
        >
          <ApperIcon name="List" size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'primary' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="p-2"
>
          <ApperIcon name="ListOrdered" size={16} />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-2" />
        <div className="relative">
          <select
            onChange={(e) => {
              if (e.target.value) {
                editor.chain().focus().insertContent(`{{${e.target.value}}}`).run();
                e.target.value = '';
              }
            }}
            className="h-8 px-2 text-xs border border-gray-300 rounded bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue=""
          >
            <option value="" disabled>Insert Variable</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="fullName">Full Name</option>
            <option value="email">Email</option>
            <option value="department">Department</option>
            <option value="company">Company</option>
            <option value="position">Position</option>
            <option value="phone">Phone</option>
          </select>
        </div>
        
        <div className="w-px h-8 bg-gray-300 mx-2" />
        
        <input
          type="color"
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          value={editor.getAttributes('textStyle').color || '#000000'}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
title="Text Color"
        />
      </div>
    );
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Edit3" className="mr-2" />
          Rich Text Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MenuBar />
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default WYSIWYGEditor;