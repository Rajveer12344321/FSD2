const API_BASE = 'http://localhost:8080/api/posts';

async function handleResponse(response) {
  // DELETE responses (and some errors) may have no body at all.
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status} ${response.statusText}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // Backend sent something that wasn't JSON (e.g. an HTML error page) -
    // treat it as a failure instead of crashing the caller.
    throw new Error('Received an unexpected response from the server.');
  }
}

/**
 * fetch() only rejects on true network failures (server unreachable, CORS
 * block, DNS error, etc). We rewrap that specific case with a clearer
 * message so the UI can tell "backend is down / CORS blocked" apart from
 * "backend responded but with an error".
 */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    throw new Error(
      `Could not reach ${API_BASE}. Is the Spring Boot backend running on port 8080? (${err.message})`
    );
  }
}

export async function fetchPosts() {
  const res = await safeFetch(API_BASE);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await safeFetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  const res = await safeFetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await safeFetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
