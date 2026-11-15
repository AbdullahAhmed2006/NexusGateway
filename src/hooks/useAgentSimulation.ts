import { useState } from "react";
import type { Message, Stage } from "../lib/types";
import { useTimers } from "./useTimers";

/**
 * Simulated multi-agent run: the user message appears at once, the supervisor
 * steps through its stages, and a dummy assistant reply lands after 3 seconds.
 */
export function useAgentSimulation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>(0);
  const { schedule, clear } = useTimers();

  const send = (text: string, files: string[], onComplete: (id: number) => void) => {
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text, files }]);

    setStage(1);
    schedule(() => setStage(2), 700);
    schedule(() => setStage(3), 1300);
    schedule(() => setStage(4), 2200);
    schedule(() => {
      setStage(0);
      setMessages((m) => [...m, { id: id + 1, role: "assistant", prompt: text }]);
      onComplete(id);
    }, 3000);
  };

  const reset = () => {
    clear();
    setStage(0);
    setMessages([]);
  };

  return { messages, stage, send, reset };
}
