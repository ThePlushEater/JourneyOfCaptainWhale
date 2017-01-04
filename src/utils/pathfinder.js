export function getNeightbors(vertex, vertices, edges) {
  let neighbors = [];
  let vertexIndex = -1;
  vertices.forEach((item, index) => {
    if (vertex.coordinate[0] == item.coordinate[0] && vertex.coordinate[1] == item.coordinate[1]) {
      vertexIndex = index;
    }
  });
  edges[vertexIndex].forEach((item, index) => {
    if (item == 1) {
      neighbors.push(vertices[index]);
    }
  });
  return neighbors;
}
