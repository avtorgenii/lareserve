import type { KonvaEventObject } from 'konva/lib/Node';

export function setCursor(e: KonvaEventObject<MouseEvent>, cursor: string): void {
  const stage = e.target.getStage();
  if (stage) stage.container().style.cursor = cursor;
}
