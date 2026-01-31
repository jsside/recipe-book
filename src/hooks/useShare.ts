import { useCallback } from "react";
import { useNotification } from "@/context/NotificationContext";

interface ShareData {
  title: string;
  text?: string;
  url?: string;
}

export function useShare() {
  const { showNotification } = useNotification();

  const share = useCallback(
    async (data: ShareData) => {
      const shareUrl = data.url || window.location.href;

      // Check if Web Share API is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: data.title,
            text: data.text,
            url: shareUrl,
          });
          return;
        } catch (error) {
          // User cancelled or share failed - fall back to clipboard
          if ((error as Error).name === "AbortError") {
            return; // User cancelled, don't show any notification
          }
        }
      }

      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotification("Link copied to clipboard!", "success");
      } catch (error) {
        showNotification("Failed to copy link", "error");
      }
    },
    [showNotification],
  );

  const isSupported = typeof navigator !== "undefined" && !!navigator.share;

  return { share, isSupported };
}
