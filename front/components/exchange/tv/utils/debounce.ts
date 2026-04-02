export default function debounce(limit: number, callback: Function) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    // Clear the existing timeout (reset the debounce timer)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      callback(...args); // Call the callback with the latest arguments
    }, limit);
  };
}
