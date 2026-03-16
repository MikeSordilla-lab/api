import { getApiBaseUrl } from "../utils/config";

const createApiError = async (response) => {
  let message = `HTTP ${response.status}`;
  try {
    const payload = await response.json();
    if (payload?.message) {
      message = payload.message;
    }
  } catch {
    // Keep fallback message when response payload is not JSON.
  }

  const error = new Error(message);
  error.status = response.status;
  return error;
};

const postJson = async (path, payload, { withCredentials = false } = {}) => {
  const response = await fetch(`${getApiBaseUrl()}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: withCredentials ? "include" : "same-origin",
    body: JSON.stringify(payload || {}),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${getApiBaseUrl()}/students.php`, {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
};

export const createStudent = async ({ firstname, lastname, ratings }) => {
  return postJson(
    "create_student.php",
    {
      firstname,
      lastname,
      ratings: parseInt(ratings, 10),
    },
    { withCredentials: true },
  );
};

export const updateStudent = async ({ id, firstname, lastname, ratings }) => {
  return postJson("update_student.php", {
    id,
    firstname,
    lastname,
    ratings: parseInt(ratings, 10),
  });
};

export const deleteStudent = async (id) => {
  return postJson("delete_student.php", { id });
};

export const login = async ({ username, password }) => {
  return postJson(
    "login.php",
    { username, password },
    { withCredentials: true },
  );
};

export const logout = async () => {
  return postJson("logout.php", {}, { withCredentials: true });
};

export const getAuthStatus = async () => {
  const response = await fetch(`${getApiBaseUrl()}/me.php`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return response.json();
};
