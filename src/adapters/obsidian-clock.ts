import { dayIdFromDateLocal } from "../domain/dates";
import type { DayId } from "../domain/types";
import type { IClock } from "../ports/clock";

export class ObsidianClock implements IClock {
	today(): DayId {
		return dayIdFromDateLocal(new Date());
	}
}
