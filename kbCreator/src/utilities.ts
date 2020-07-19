export async function delay(time: number = 1000) {
    return new Promise(res => {
        setTimeout(() => res(), time)
    })
}
