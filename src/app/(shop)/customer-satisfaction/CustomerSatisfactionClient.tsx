"use client";

import { useEffect, useState } from "react";
import type { CustomerVideo } from "@/types";

export function CustomerSatisfactionClient() {
  const [videos, setVideos] = useState<CustomerVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer-videos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVideos(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">هنوز ویدئویی منتشر نشده است.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-card rounded-xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-shadow"
        >
          <div className="aspect-video bg-black">
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full object-contain"
              poster={video.thumbnailUrl || undefined}
            >
              مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
            </video>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-muted">{video.description}</p>
            )}
            <p className="text-xs text-muted/60 mt-2">
              {new Date(video.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}