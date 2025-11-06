import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Options = { idleLimitMs?: number };
export function useIdleLogout({ idleLimitMs = 10 * 60 * 1000 }: Options = {}) {
  const lastActivity = useRef(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const mark = () => {
      lastActivity.current = Date.now();
    };
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ] as const;

    events.forEach((ev) =>
      window.addEventListener(ev, mark, { passive: true })
    );

    const t = setInterval(() => {
      const inactive = Date.now() - lastActivity.current;
      if (inactive >= idleLimitMs) {
        localStorage.removeItem("user");
        window.location.href = "/login"; 
      }
    }, 10000); 

    return () => {
      clearInterval(t);
      events.forEach((ev) => window.removeEventListener(ev, mark));
    };
  }, [idleLimitMs, navigate]);
}
