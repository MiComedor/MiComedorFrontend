import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Options = { idleLimitMs?: number };

export function useIdleLogout({ idleLimitMs = 10 * 60 * 1000 }: Options = {}) {
  const lastActivity = useRef(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return; // si no hay sesión, no activamos nada

    const mark = () => {
      lastActivity.current = Date.now();
      console.log("✅ Actividad detectada: reiniciando contador");
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
      console.log(`⏱ Inactivo por ${Math.round(inactive / 1000)} segundos`);
      if (inactive >= idleLimitMs) {
        localStorage.removeItem("user");
        window.location.href = "/login"; // fuerza el rerender de toda la app
      }
    }, 10000); // chequea cada 10s

    return () => {
      clearInterval(t);
      events.forEach((ev) => window.removeEventListener(ev, mark));
    };
  }, [idleLimitMs, navigate]);
}
