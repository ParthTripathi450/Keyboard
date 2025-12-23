import { useEffect, useRef } from "react";
import gsap from "gsap";
import { KeyboardRefs } from "./Keyboard";


const KEY_PRESS_DEPTH = 0.0021;
const BASE_VOLUME = 0.25;

const KEYBOARD_MAP = {
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",

  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "0": "zero",

  Enter: "enter",
  Backspace: "backspace",
  Escape: "esc",
  Tab: "tab",
  " ": "space",

  ArrowUp: "arrowup",
  ArrowDown: "arrowdown",
  ArrowLeft: "arrowleft",
  ArrowRight: "arrowright",
} as const;

type MappedKey = (typeof KEYBOARD_MAP)[keyof typeof KEYBOARD_MAP];

export function useKeyboardTyping(
  keyboardRef: React.RefObject<KeyboardRefs | null>,
) {
  const pressedKeys = useRef<Set<MappedKey>>(new Set());

  // 🔊 Audio pool (single reusable sound)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/blue-1.mp3");
    audioRef.current.volume = BASE_VOLUME;
  }, []);

  useEffect(() => {
    const playSound = () => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = 0;

      audioRef.current.playbackRate =
        0.95 + Math.random() * 0.1;

      audioRef.current.play().catch(() => {});
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === " " ||        
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          e.preventDefault();
        }
      
        if (e.repeat) return;
      
        const mappedKey =
          KEYBOARD_MAP[e.key as keyof typeof KEYBOARD_MAP];
        if (!mappedKey) return;
      
        const mesh =
          keyboardRef.current?.keys[mappedKey]?.current;
        if (!mesh || pressedKeys.current.has(mappedKey)) return;
      
        pressedKeys.current.add(mappedKey);
      
        playSound();
      
        gsap.killTweensOf(mesh.position);
      
        gsap.to(mesh.position, {
          y: mesh.position.y - KEY_PRESS_DEPTH,
          duration: 0.07,
          ease: "power2.out",
        });
      };
      

    const handleKeyUp = (e: KeyboardEvent) => {
      const mappedKey =
        KEYBOARD_MAP[e.key as keyof typeof KEYBOARD_MAP];
      if (!mappedKey) return;

      const mesh =
        keyboardRef.current?.keys[mappedKey]?.current;
      if (!mesh) return;

      pressedKeys.current.delete(mappedKey);

      gsap.killTweensOf(mesh.position);

      gsap.to(mesh.position, {
        y: mesh.position.y + KEY_PRESS_DEPTH,
        duration: 0.12,
        ease: "power2.out",
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyboardRef]);
}
