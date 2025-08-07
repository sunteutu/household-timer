'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const imageList = [
  "https://images.unsplash.com/photo-1606813909023-b342f3b6d273",
  "https://images.unsplash.com/photo-1586201375771-83865001e17b",
  "https://images.unsplash.com/photo-1573883430461-58d327f49e4e",
  "https://images.unsplash.com/photo-1556912999-86fddf6c4f7e",
  "https://images.unsplash.com/photo-1620745163986-21a2f2f5e5f4",
  "https://images.unsplash.com/photo-1598300052796-e637d5e59fa3",
  "https://images.unsplash.com/photo-1606813496729-f8e962eb470e",
  "https://images.unsplash.com/photo-1627394534016-c451d532b5b9"
];

const tickSound = typeof Audio !== 'undefined' ? new Audio('https://www.soundjay.com/clock/sounds/clock-ticking-4.mp3') : null;
const dingSound = typeof Audio !== 'undefined' ? new Audio('https://www.soundjay.com/button/sounds/beep-07.mp3') : null;

export default function Home() {
  const [duration, setDuration] = useState(60);
  const [sessionCount, setSessionCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const intervalRef = useRef(null);

  const [shuffledImages, setShuffledImages] = useState([]);

  const startSession = () => {
    const shuffled = [...imageList].sort(() => Math.random() - 0.5).slice(0, sessionCount);
    setShuffledImages(shuffled);
    setCurrentIndex(0);
    setSecondsLeft(duration);
    setRunning(true);
  };

  useEffect(() => {
    if (running && currentIndex < shuffledImages.length) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (dingSound) dingSound.play();
            setCurrentIndex((i) => i + 1);
            return duration;
          }
          if (tickSound) tickSound.play();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, currentIndex, duration]);

  const stopSession = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎨 Household Object Drawing Timer</h1>

      {!running && (
        <div className="space-y-4">
          <div>
            <p>⏱️ Alege durata fiecărei imagini:</p>
            <div className="flex justify-center gap-2 mt-2">
              {[60, 120, 300].map((d) => (
                <Button key={d} onClick={() => setDuration(d)} variant={duration === d ? "default" : "outline"}>
                  {d / 60} min
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p>🖼️ Câte imagini vrei în sesiune?</p>
            <div className="flex justify-center gap-2 mt-2">
              {[5, 10, 20].map((c) => (
                <Button key={c} onClick={() => setSessionCount(c)} variant={sessionCount === c ? "default" : "outline"}>
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={startSession} className="mt-4">Începe sesiunea</Button>
        </div>
      )}

      {running && currentIndex < shuffledImages.length && (
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <img src={shuffledImages[currentIndex]} alt="object" className="max-h-[400px] mx-auto rounded" />
              <p className="mt-4 text-lg">⏳ {secondsLeft}s</p>
              <p className="text-sm text-muted-foreground">Imaginea {currentIndex + 1} din {shuffledImages.length}</p>
              <Button className="mt-4" onClick={stopSession}>Oprește sesiunea</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {running && currentIndex >= shuffledImages.length && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">🎉 Gata sesiunea!</h2>
          <Button onClick={stopSession}>Încearcă din nou</Button>
        </div>
      )}
    </div>
  );
}
