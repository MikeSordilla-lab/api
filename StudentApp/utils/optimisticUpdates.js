const cloneStudents = (students) => students.map((item) => ({ ...item }));

export const beginOptimisticDelete = (students, id) => {
  const previous = cloneStudents(students);
  const next = students.filter((item) => item.id !== id);
  return { next, rollback: previous };
};

export const beginOptimisticUpdate = (students, id, patch) => {
  const previous = cloneStudents(students);
  const next = students.map((item) =>
    item.id === id
      ? {
          ...item,
          ...patch,
          optimisticState: "pending-update",
        }
      : item,
  );
  return { next, rollback: previous };
};

export const beginOptimisticCreate = (students, draftStudent) => {
  const previous = cloneStudents(students);
  const tempId = `temp-${Date.now()}`;
  const next = [
    {
      id: tempId,
      ...draftStudent,
      optimisticState: "pending-create",
    },
    ...students,
  ];
  return { next, rollback: previous, tempId };
};

export const rollbackStudents = (rollback) => cloneStudents(rollback);
