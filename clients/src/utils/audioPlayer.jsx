import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const AudioPlayer = forwardRef((props, ref) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
      audioRef.current.loop = true; // Set loop after successful play
    }
  };

  // Expose handlePlay function to the parent component
  useImperativeHandle(ref, () => ({
    play: handlePlay,
  }));

  return (
    <div>
      <audio ref={audioRef} src="/backgroundMusic.mp3" />
    </div>
  );
});

export default AudioPlayer;
