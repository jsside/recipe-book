import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography, Paper, Fade } from "@mui/material";
import {
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface TimerProps {
  seconds: number;
  open: boolean;
  onClose: () => void;
}

// TODO [feat]: allow personalization. User should be able to select their preferred sound
export function Timer({ seconds, open, onClose }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setRemaining(seconds);
      setPaused(false);
    }
  }, [open, seconds]);

  // Countdown logic
  useEffect(() => {
    if (!open || paused || remaining <= 0) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [open, paused, remaining]);

  // Play sound when done
  useEffect(() => {
    if (remaining === 0) {
      audioRef.current?.play();
    }
  }, [remaining]);

  if (!open) return null;

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <>
      <Fade in={open}>
        <Box
          sx={{
            position: "fixed",
            insetX: 0,
            bottom: 0,
            zIndex: 1300,
            p: 2,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: "100%", md: 380 },
              borderRadius: 2,
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "text.primary",
              color: "background.paper",
            }}
          >
            {/* Controls */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setPaused((p) => !p)}
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                {paused ? <PlayIcon /> : <PauseIcon />}
              </IconButton>

              <IconButton
                onClick={onClose}
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Time */}
            <Typography
              sx={{
                ml: "auto",
                fontSize: "2.5rem",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {minutes}:{String(secs).padStart(2, "0")}
            </Typography>
          </Paper>
        </Box>
      </Fade>

      {/* Sound */}
      <audio ref={audioRef}>
        <source src="/sounds/classic-alarm-clock.mp3" type="audio/webm" />
      </audio>
    </>
  );
}
