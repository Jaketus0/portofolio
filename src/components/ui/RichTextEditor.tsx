'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useRef } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';
import api from '../../lib/api';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Tulis deskripsi…' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-content min-h-[220px] px-4 py-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      const isEmpty = editor.isEmpty && (!value || value === '<p></p>');
      if (!isEmpty) editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `grid h-8 w-8 place-items-center rounded-md transition-colors ${
      active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-900'
    }`;

  const addLink = () => {
    const url = window.prompt('URL:', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      editor.chain().focus().setImage({ src: data.data.url }).run();
    } catch {
      alert('Upload gambar gagal');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-black/[0.02] px-2 py-1.5">
        <button type="button" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold className="h-4 w-4" /></button>
        <button type="button" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic className="h-4 w-4" /></button>
        <button type="button" aria-label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))}><UnderlineIcon className="h-4 w-4" /></button>
        <button type="button" aria-label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}><Strikethrough className="h-4 w-4" /></button>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <button type="button" aria-label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn(editor.isActive('heading', { level: 2 }))} w-auto px-2 text-xs font-semibold`}>H2</button>
        <button type="button" aria-label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btn(editor.isActive('heading', { level: 3 }))} w-auto px-2 text-xs font-semibold`}>H3</button>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <button type="button" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List className="h-4 w-4" /></button>
        <button type="button" aria-label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered className="h-4 w-4" /></button>
        <button type="button" aria-label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}><Quote className="h-4 w-4" /></button>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <button type="button" aria-label="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))}><AlignLeft className="h-4 w-4" /></button>
        <button type="button" aria-label="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))}><AlignCenter className="h-4 w-4" /></button>
        <button type="button" aria-label="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))}><AlignRight className="h-4 w-4" /></button>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <button type="button" aria-label="Insert link" onClick={addLink} className={btn(editor.isActive('link'))}><Link2 className="h-4 w-4" /></button>
        <button type="button" aria-label="Insert image" onClick={() => fileRef.current?.click()} className={btn(false)}><ImagePlus className="h-4 w-4" /></button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              uploadImage(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
