import { ResultAsync } from "neverthrow";

import { postgres as db } from "~~/server/repositories/conn";

export const useDatabaseRepository = () => {

    const getDatabaseInfo = () => {
        return ResultAsync.fromPromise(
            db.execute<{ pg_size_pretty: string }>("SELECT pg_size_pretty(pg_database_size(current_database()));"),
            (err) => new Error(String(err))
        );
    };

    return {
        getDatabaseInfo,
    }
}