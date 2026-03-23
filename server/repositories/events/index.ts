import { processingRiotEventsJobs as eventsTable } from "@Ouilliam-21/database"
import { and, desc,eq, lt, or } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

import { postgres as db } from "../conn";

export const useEventsRepository = () => {
    const LIMIT = 10
    const getLastEventsFrom = (from?: Date) => {

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

        return ResultAsync.fromPromise(
            db.select()
                .from(eventsTable)
                .where(and(...conditions))
                .orderBy(desc(eventsTable.createdAt))
                .limit(LIMIT + 1)
                .then(events => {
                    const hasNext = events.length > LIMIT;
                    return {
                        hasNext,
                        events: hasNext ? events.slice(0, LIMIT) : events,
                    };
                }),
            (err) => new Error(String(err))
        );
    };

    return {
        getLastEventsFrom
    }
}