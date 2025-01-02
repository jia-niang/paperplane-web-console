export function traverseTree<TTree extends { children?: TTree[] }>(tree: TTree[], callback: (item: TTree) => void) {
  for (const node of tree) {
    callback(node)

    if (node.children && node.children.length > 0) {
      traverseTree(node.children, callback)
    }
  }
}
