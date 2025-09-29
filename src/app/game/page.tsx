import { Suspense } from "react";
import GameContent from "./GamePageClient";

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameContent/>
    </Suspense>
  );
}