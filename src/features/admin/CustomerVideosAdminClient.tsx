"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CustomerVideo } from "@/types";

export function CustomerVideosAdminClient({
  initialVideos,
}: {
  initialVideos: CustomerVideo[];
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUploadAndSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !selectedFile) return;

    setUploading(true);
    setMessage("");

    // Step 1: Upload video file
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    const uploadRes = await fetch("/api/upload-video", {
      method: "POST",
      credentials: "include",
      body: uploadFormData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      setMessage(uploadData.error || "خطا در آپلود ویدئو");
      setUploading(false);
      return;
    }

    // Step 2: Save video metadata
    setSaving(true);
    const res = await fetch("/api/admin/customer-videos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        videoUrl: uploadData.data.path,
      }),
    });

    const data = await res.json();
    setUploading(false);
    setSaving(false);

    if (data.success) {
      setVideos((current) => [data.data, ...current]);
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("ویدئو با موفقیت اضافه شد.");
    } else {
      setMessage(data.error || "خطا در ثبت ویدئو.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این ویدئو اطمینان دارید؟")) return;
    const res = await fetch("/api/admin/customer-videos", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.success) {
      setVideos((current) => current.filter((video) => video.id !== id));
    } else {
      alert(data.error || "خطا در حذف ویدئو.");
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">رضایت مشتریان (ویدئوها)</h1>

      <Card className="p-6 mb-6">
        <form onSubmit={handleUploadAndSave} className="space-y-4">
          <Input
            label="عنوان ویدئو"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: رضایت مشتری از خرید"
          />
          <Textarea
            label="توضیحات (اختیاری)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیح مختصری درباره ویدئو"
          />
          <div>
            <label className="block text-sm font-medium mb-1">فایل ویدئو</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/mkv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-xs text-muted mt-1">حداکثر حجم: ۱۰۰ مگابایت</p>
          </div>
          {message && (
            <p className={`text-sm ${message.includes("خطا") ? "text-red-400" : "text-green-500"}`}>
              {message}
            </p>
          )}
          <Button type="submit" loading={uploading || saving} disabled={!title.trim() || !selectedFile}>
            {uploading ? "در حال آپلود..." : saving ? "در حال ذخیره..." : "آپلود و ذخیره ویدئو"}
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {videos.length === 0 ? (
          <p className="text-muted text-sm">هنوز ویدئویی آپلود نشده است.</p>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  {video.description && (
                    <p className="text-sm text-muted mt-1">{video.description}</p>
                  )}
                  <p className="text-xs text-muted/60 mt-2">
                    {new Date(video.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                  <div className="mt-3 max-w-md">
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: "200px" }}
                    >
                      مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
                    </video>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => handleDelete(video.id)}>
                  حذف
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}