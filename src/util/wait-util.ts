export async function wait(s: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
