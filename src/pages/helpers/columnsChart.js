export const columns = [
  { id: "id", label: "", minWidth: 250 },
  { id: "onHold", label: "On Hold", minWidth: 100 },
  { id: "open", label: "Open", minWidth: 100 },
  { id: "overDue", label: "OverDue", minWidth: 100 },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
];
