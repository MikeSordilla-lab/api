const BASE_URL = "http://192.168.0.78/api";

const postJson = async (path, payload) => {
  const response = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${BASE_URL}/students.php`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
};

export const createStudent = async ({ firstname, lastname, ratings }) => {
  return postJson("create_student.php", {
    firstname,
    lastname,
    ratings: parseInt(ratings, 10),
  });
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
