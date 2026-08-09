"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  prefix?: string;
}

export function ImageUpload({
  images,
  onChange,
  multiple = true,
  prefix = "product",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");
    const newImages = [...images];
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      let data: { success?: boolean; data?: { path?: string }; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: "پاسخ نامعتبر از سرور دریافت شد" };
      }

      if (res.ok && data.success && data.data?.path) {
        if (multiple) {
          newImages.push(data.data.path);
          uploadedCount += 1;
        } else {
          onChange([data.data.path]);
          setUploading(false);
          e.target.value = "";
          return;
        }
      } else {
        setError(data.error || "آپلود تصویر ناموفق بود");
      }
    }

    if (uploadedCount > 0) onChange(newImages);
    e.target.value = "";
    setUploading(false);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-background border border-border">
            <Image src={img} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 end-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          className="hidden"
        />
        <span className="inline-flex px-4 py-2 rounded-xl bg-card border border-border text-sm cursor-pointer hover:border-primary/50 transition-colors">
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
        </span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
