import { postgres as db } from "~~/server/repositories/conn";

export const useDatabaseRepository = () => {

    const getDatabaseInfo = async () => {
        return await db.execute<{
            pg_size_pretty: string;
        }>("SELECT pg_size_pretty(pg_database_size(current_database()));");
    };

    return {
        getDatabaseInfo,
    }
}