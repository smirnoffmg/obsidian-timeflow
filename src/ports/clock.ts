import type { DayId } from "../domain/types";

export interface IClock {
	today(): DayId;
}
