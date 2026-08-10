// api/postsApi.js
//
// Mock API layer. Simulates a real network call (JSONPlaceholder-style)
// without requiring an actual network connection, so the app works offline
// and in restricted environments. Swap the body of fetchPostsFromServer
// with a real `fetch("https://jsonplaceholder.typicode.com/posts")` call
// if you want genuine network requests.

const MOCK_PLATFORMS = ["Instagram", "Twitter", "LinkedIn", "Facebook", "YouTube"];

// Deterministic-ish mock dataset generator.
function generateMockPosts(count = 12) {
  const posts = [];
  for (let i = 1; i <= count; i += 1) {
    const platform = MOCK_PLATFORMS[i % MOCK_PLATFORMS.length];
    const isShort = i % 3 === 0;
    posts.push({
      id: `post-${i}`,
      title: `Sample Post #${i}`,
      content: isShort
        ? `Quick update ${i}.`
        : `This is a longer sample post body number ${i} used to demonstrate ` +
          `content length based analytics, filtering, and normalized state ` +
          `management inside the Redux Toolkit store.`,
      platform,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString() // staggered timestamps
    });
  }
  return posts;
}

/**
 * Simulates an asynchronous API request for posts.
 * Resolves after a short delay to mimic real network latency,
 * which lets us meaningfully demonstrate the `pending` state in the UI.
 */
export function fetchPostsFromServer() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = generateMockPosts(12);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    }, 900); // artificial latency so the loading spinner is visible
  });
}
