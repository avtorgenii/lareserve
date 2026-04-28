export type AddRoundTablePayload = {
  x?: number;
  y?: number;
  radius?: number;
  label?: string;
};

export type AddRectTablePayload = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
};

export type AddWallPayload = {
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  height?: number;
  label?: string;
};

export type AddWindowPayload = {
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  height?: number;
  label?: string;
};

export type AddDoorPayload = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
};

export type AddSeparatorPayload = {
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
  height?: number;
  label?: string;
};

export type AddPayloadByType = {
  roundTable: AddRoundTablePayload;
  rectTable: AddRectTablePayload;
  wall: AddWallPayload;
  window: AddWindowPayload;
  door: AddDoorPayload;
  separator: AddSeparatorPayload;
};

export type MoveElementPayload = {
  id: string;
  x: number;
  y: number;
};

export type UpdateLabelPayload = {
  id: string;
  label: string;
};

export type SetViewportScalePayload = {
  scale: number;
};

export type ResizeRoundTablePayload = {
  id: string;
  type: 'roundTable';
  radius?: number;
};

export type ResizeRectTablePayload = {
  id: string;
  type: 'rectTable';
  width?: number;
  height?: number;
};

export type ResizeWallPayload = {
  id: string;
  type: 'wall';
  height?: number;
};

export type ResizeWindowPayload = {
  id: string;
  type: 'window';
  height?: number;
};

export type ResizeDoorPayload = {
  id: string;
  type: 'door';
  width?: number;
  height?: number;
};

export type ResizeSeparatorPayload = {
  id: string;
  type: 'separator';
  height?: number;
};

export type MoveWallEndpointPayload = {
  id: string;
  endpoint: 'start' | 'end';
  x: number;
  y: number;
};

export type ResizePayloadByType = {
  roundTable: ResizeRoundTablePayload;
  rectTable: ResizeRectTablePayload;
  wall: ResizeWallPayload;
  window: ResizeWindowPayload;
  door: ResizeDoorPayload;
  separator: ResizeSeparatorPayload;
};
