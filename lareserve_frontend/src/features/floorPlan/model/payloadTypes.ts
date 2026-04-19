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
  width?: number;
  height?: number;
  label?: string;
};

export type AddPayloadByType = {
  roundTable: AddRoundTablePayload;
  rectTable: AddRectTablePayload;
  wall: AddWallPayload;
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
  width?: number;
  height?: number;
};

export type ResizePayloadByType = {
  roundTable: ResizeRoundTablePayload;
  rectTable: ResizeRectTablePayload;
  wall: ResizeWallPayload;
};
