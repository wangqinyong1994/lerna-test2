export const flatArr = (arr: any[]): any[] => {
    return arr.reduce((prev, next) => {
        return prev.concat(Array.isArray(next) ? flatArr(next) : next)
    }, [])
}