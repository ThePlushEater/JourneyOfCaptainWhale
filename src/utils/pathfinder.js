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

export function getPath(start, end, vertices, edges) {
  // Run pathfinding.
  let frontier = [];
  frontier.push(start);
  let visited = [];
  visited.push(start);
  let cameFrom = [];
  cameFrom[start] = null;
  while (frontier.length > 0) {
    const current = frontier.shift();
    if (current.coordinate[0] == end.coordinate[0] && current.coordinate[1] == end.coordinate[1]) {
      break;
    }
    const neighbors = getNeightbors(current, vertices, edges);
    neighbors.forEach((next) => {
      let found = false;
      for (let i=0; i<visited.length && !found; i++) {
        if (next.coordinate[0] == visited[i].coordinate[0] && next.coordinate[1] == visited[i].coordinate[1]) {
          found = true;
        }
      }
      if (!found) {
        frontier.push(next);
        visited.push(next);
        let nextString = "[" + next.coordinate[0] + ", " + next.coordinate[1] + "]";
        cameFrom[nextString] = current;
      }
    });
  }

  // Reconstruct path.
  let current = end;
  let path = new Array();
  let index = 0;
  path[index++] = end.coordinate;
  while (current != null && ("[" + current.coordinate[0] + ", " + current.coordinate[1] + "]") != ("[" + start.coordinate[0] + ", " + start.coordinate[1] + "]")) {
    current = cameFrom["[" + current.coordinate[0] + ", " + current.coordinate[1] + "]"];
    if (current) {
      path[index++] = current.coordinate;
    }
  }
  path = path.reverse();
  // console.log(path, path.length);
  // for (let i=0; i<path.length; i++) {
  //   console.log(path[i]);
  // }
  return path;
}
