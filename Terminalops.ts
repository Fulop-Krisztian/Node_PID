export function updateTerminal(output: string): void {
    process.stdout.write('\x1B[H'); // Move cursor to top-left corner
    process.stdout.write('\x1B[2J'); // Clear entire screen
    process.stdout.write(output); // Write updated content
}