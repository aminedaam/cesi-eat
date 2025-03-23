import { Position } from "./Position";

export interface Restaurant {
  id: number;
  name: string;
  deliveryCosts: number;
  image: string;
  position: Position;
}
