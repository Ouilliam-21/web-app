import { processingRiotEventsJobs as eventsTable } from "@Ouilliam-21/database"
import { and, desc,eq, lt, or } from "drizzle-orm";

import { postgres as db } from "../conn";

export const useEventsRepository = () => {
    const LIMIT = 10
    const getLastEventsFrom = async (from?: Date) => {

        const conditions = [
            or(
                eq(
                    eventsTable.status,
                    "completed"
                ),
                eq(eventsTable.status, "failed")
            ),
        ];

        if (isPresent(from)) {
            conditions.push(
                lt(eventsTable.createdAt, from)
            );
        }

        const events = await db
            .select()
            .from(eventsTable)
            .where(and(...conditions))
            .orderBy(desc(eventsTable.createdAt))
            .limit(LIMIT + 1);

        const hasNext = events.length > LIMIT

        return {
            hasNext: hasNext,
            events: hasNext ? events.slice(0, LIMIT) : events
        }
    };

    return {
        getLastEventsFrom
    }
}