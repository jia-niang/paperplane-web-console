/** 获取数组的类型 */
type TypeofArray<T extends any[]> = T extends (infer U)[] ? U : never

/** 获取 Promise 的类型 */
type TypeofPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never
