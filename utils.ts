export function trimMessage(message: string): string {
    const maxLength = 4090;
    return message.substring(0, maxLength);
}