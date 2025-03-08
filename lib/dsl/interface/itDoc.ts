import { getTestAdapterExports } from "../adapters"

/**
 * 케이스 별 테스트를 정의를 위한 함수
 * @param description 테스트 설명
 * @param testFn 테스트 함수
 */
export const itDoc = (description: string, testFn: () => Promise<void>): void => {
    if (!description) {
        throw new Error("테스트 설명이 필요합니다.")
    }

    if (!testFn) {
        throw new Error("테스트 함수가 필요합니다.")
    }

    const { itCommon } = getTestAdapterExports()
    itCommon(description, async () => {
        await testFn()
    })
}
