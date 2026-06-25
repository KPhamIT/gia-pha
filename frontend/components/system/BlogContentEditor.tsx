"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import type { UploadedImage } from "@/lib/api/modules/media";

type BlogContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  imageAltBase?: string;
};

function ToolbarButton({
  onClick,
  active,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
        active
          ? "border-amber-500 bg-amber-100 text-amber-900"
          : "border-amber-200 bg-white text-neutral-700 hover:bg-amber-50"
      }`}
    >
      {label}
    </button>
  );
}

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaKey: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-key"),
        renderHTML: (attributes) =>
          attributes.mediaKey ? { "data-media-key": attributes.mediaKey } : {},
      },
      mediaProvider: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-provider"),
        renderHTML: (attributes) =>
          attributes.mediaProvider
            ? { "data-media-provider": attributes.mediaProvider }
            : {},
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) =>
          attributes.width ? { width: String(attributes.width) } : {},
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) =>
          attributes.height ? { height: String(attributes.height) } : {},
      },
    };
  },
});

const MAX_UPLOAD_WIDTH = 1600;
const MAX_UPLOAD_HEIGHT = 1600;

function sanitizeAltBase(raw?: string): string {
  const normalized = raw?.trim();
  if (!normalized) return "Ảnh bài viết gia phả";
  return normalized.replace(/\s+/g, " ");
}

async function compressBeforeUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") return file;
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(sourceUrl);
    const { width, height } = fitSize(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, "image/webp", 0.82);
    if (!blob) return file;
    if (blob.size >= file.size) return file;
    const ext = "webp";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.${ext}`, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không thể đọc ảnh"));
    image.src = src;
  });
}

function fitSize(width: number, height: number) {
  const ratio = Math.min(MAX_UPLOAD_WIDTH / width, MAX_UPLOAD_HEIGHT / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export default function BlogContentEditor({
  value,
  onChange,
  imageAltBase,
}: BlogContentEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [selectedImageSize, setSelectedImageSize] = useState<{
    width: string;
    height: string;
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      BlogImage,
      Link.configure({
        autolink: true,
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Nhập nội dung bài viết...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor: current }) {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const syncSelectedImage = () => {
      if (!editor.isActive("image")) {
        setSelectedImageSize(null);
        return;
      }
      const attrs = editor.getAttributes("image") as {
        width?: string | number | null;
        height?: string | number | null;
      };
      setSelectedImageSize({
        width: attrs.width ? String(attrs.width) : "",
        height: attrs.height ? String(attrs.height) : "",
      });
    };

    syncSelectedImage();
    editor.on("selectionUpdate", syncSelectedImage);
    editor.on("transaction", syncSelectedImage);
    return () => {
      editor.off("selectionUpdate", syncSelectedImage);
      editor.off("transaction", syncSelectedImage);
    };
  }, [editor]);

  if (!editor) return null;

  const openImagePicker = () => {
    if (imageBusy) return;
    fileInputRef.current?.click();
  };

  const handleImagePicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setImageBusy(true);
    try {
      const compressed = await compressBeforeUpload(file);
      const uploaded = await api.media.uploadImage(compressed);
      insertUploadedImage(editor, uploaded, sanitizeAltBase(imageAltBase));
    } catch (error) {
      notify.error(error, UI.ERR_SAVE);
    } finally {
      setImageBusy(false);
    }
  };

  const removeCurrentImage = async () => {
    if (!editor.isActive("image")) return;
    const attrs = editor.getAttributes("image") as {
      mediaKey?: string;
      mediaProvider?: "cloudinary" | "local";
    };
    setImageBusy(true);
    try {
      if (attrs.mediaKey && attrs.mediaProvider) {
        await api.media.deleteImage({
          provider: attrs.mediaProvider,
          key: attrs.mediaKey,
        });
      }
      editor.chain().focus().deleteSelection().run();
    } catch (error) {
      notify.error(error, UI.ERR_DELETE);
    } finally {
      setImageBusy(false);
    }
  };

  const applyImageSize = () => {
    if (!editor.isActive("image") || !selectedImageSize) return;
    const width = Number.parseInt(selectedImageSize.width, 10);
    const height = Number.parseInt(selectedImageSize.height, 10);
    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        width: Number.isFinite(width) && width > 0 ? width : null,
        height: Number.isFinite(height) && height > 0 ? height : null,
      })
      .run();
  };

  const headingLevel = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "p";

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-amber-200/60 bg-white p-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImagePicked}
        />
        <select
          className="rounded-md border border-amber-200 bg-white px-2 py-1 text-xs text-neutral-700"
          value={headingLevel}
          onChange={(e) => {
            const next = e.target.value;
            if (next === "p") {
              editor.chain().focus().setParagraph().run();
              return;
            }
            editor
              .chain()
              .focus()
              .setHeading({ level: Number(next.slice(1)) as 1 | 2 | 3 })
              .run();
          }}
        >
          <option value="p">Đoạn văn</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <ToolbarButton
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="S"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          label="Mã"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          label="• List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1. List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const href = window.prompt("Nhập URL", prev ?? "https://");
            if (href == null) return;
            if (!href.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: href.trim() }).run();
          }}
        />
        <ToolbarButton
          label={imageBusy ? "Đang xử lý..." : "Ảnh"}
          onClick={openImagePicker}
        />
        <ToolbarButton
          label="Clear"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        />
      </div>

      {selectedImageSize ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-200/60 bg-amber-50/40 p-2">
          <span className="text-xs font-medium text-neutral-700">Ảnh đang chọn</span>
          <input
            type="number"
            min={1}
            className="w-24 rounded-md border border-amber-200 bg-white px-2 py-1 text-xs text-neutral-700"
            placeholder="Width"
            value={selectedImageSize.width}
            onChange={(e) =>
              setSelectedImageSize((prev) =>
                prev ? { ...prev, width: e.target.value } : prev,
              )
            }
          />
          <input
            type="number"
            min={1}
            className="w-24 rounded-md border border-amber-200 bg-white px-2 py-1 text-xs text-neutral-700"
            placeholder="Height"
            value={selectedImageSize.height}
            onChange={(e) =>
              setSelectedImageSize((prev) =>
                prev ? { ...prev, height: e.target.value } : prev,
              )
            }
          />
          <ToolbarButton label="Áp dụng size" onClick={applyImageSize} />
          <ToolbarButton label="🗑 Xóa ảnh" onClick={() => void removeCurrentImage()} />
        </div>
      ) : null}

      <div className="max-h-[520px] overflow-auto bg-[#f8f9fb] p-4">
        <div className="mx-auto w-full max-w-[820px] rounded-md border border-neutral-200 bg-white px-8 py-8 shadow-sm">
          <EditorContent
            editor={editor}
            className="text-sm text-neutral-900 [&_.ProseMirror]:min-h-[360px] [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_ul]:mb-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:mb-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_a]:text-amber-700 [&_.ProseMirror_a]:underline"
          />
        </div>
      </div>
    </div>
  );
}

function insertUploadedImage(
  editor: NonNullable<ReturnType<typeof useEditor>>,
  uploaded: UploadedImage,
  altBase: string,
) {
  const fallbackAlt = `${altBase} - hình minh họa`;
  editor
    .chain()
    .focus()
    .insertContent({
      type: "image",
      attrs: {
        src: uploaded.url,
        alt: fallbackAlt,
        mediaKey: uploaded.key,
        mediaProvider: uploaded.provider,
      },
    })
    .run();
}
