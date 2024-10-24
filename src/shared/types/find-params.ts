import { FindOptionsWhere, FindOptionsSelect, FindOptionsOrder } from "typeorm";

export type FindManyParams<T> = {
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    select?: FindOptionsSelect<T>,
    relations?: string[],
    limit?: number,
    page?: number,
    order?: FindOptionsOrder<T>,
}
