/**
 * Simulates a backend API call to save a draft.
 * Has a simulated failure rate to demonstrate fault tolerance and retry behavior.
 */
export const saveDraftMock = (draft, failureRate = 0.4) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation or server error
      if (!draft.content || draft.content.trim() === '') {
        reject(new Error('Invalid content: Content cannot be empty.'));
        return;
      }

      // Random failure simulation
      const random = Math.random();
      if (random < failureRate) {
        reject(new Error('Network error: Request timed out.'));
      } else {
        resolve({ success: true, message: 'Draft saved successfully!', id: draft.id || Date.now() });
      }
    }, 1000);
  });
};

/**
 * Retry helper for asynchronous functions.
 * Retries execution of fn up to `retries` times on failure.
 * Captures retry attempts and triggers a callback to log/notify the UI.
 */
export const retry = async (fn, retries = 3, delayMs = 500, onRetryAttempt = () => {}) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      onRetryAttempt(retries, error.message);
      // Wait for a delay before retrying (linear/simple backoff)
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return retry(fn, retries - 1, delayMs, onRetryAttempt);
    }
    throw error;
  }
};
