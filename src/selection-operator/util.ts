import ComponentType from "../const/component-type";

export interface cursorType {
  id: string;
  offset: number;
}

export const getParent = (
  element: HTMLElement | Node | null | undefined
): HTMLElement => {
  if (element === null || element === undefined) throw Error("获取父节点失败");
  // 文本节点处理
  if (element.nodeType === 3) {
    return getParent(element.parentElement);
  }
  if (element instanceof HTMLElement) {
    let type = element.dataset.type;
    if (
      type === ComponentType.article ||
      type === ComponentType.paragraph ||
      type === ComponentType.image ||
      type === ComponentType.audio ||
      type === ComponentType.video
    ) {
      return element;
    }
  }
  return getParent(element.parentElement);
};

export const getContainer = (
  element: HTMLElement | Node | null | undefined
): HTMLElement => {
  if (element === null || element === undefined)
    throw Error("获取容器节点失败");
  // 文本节点处理
  if (element.nodeType === 3) {
    return getContainer(element.parentElement);
  }
  if (element instanceof HTMLElement) {
    let type = element.dataset.type;
    if (
      type === ComponentType.article ||
      type === ComponentType.paragraph ||
      type === ComponentType.image ||
      type === ComponentType.audio ||
      type === ComponentType.video
    ) {
      return element;
    }
  }
  return getContainer(element.parentElement);
};

export const getElememtSize = (element?: Element): number => {
  if (element === undefined) return 0;
  if (element instanceof HTMLElement) {
    let type = element.dataset.type;
    if (type === ComponentType.characterList) {
      return element.innerText.length;
    }
    if (type === ComponentType.inlineImage) {
      return 1;
    }
  }
  return 0;
};

export const getCursorPosition = (
  cursor: cursorType
): {
  node: Node;
  index: number;
} | undefined => {
  let dom: Element | null = document.getElementById(cursor.id);
  let node = dom;
  let now = 0;
  let index = 0;
  if (dom === null) return;
  for (let i = 0; i < dom.children.length; i++) {
    const element = dom.children[i];
    let elementSize = getElememtSize(element);
    if (elementSize === 0) {
      continue;
    }
    if (now + elementSize < cursor.offset) {
      now += elementSize;
    } else {
      node = element;
      index = cursor.offset - now;
      now = 0;
      break;
    }
  }
  if (now !== 0) {
    let last = dom.children[dom.children.length - 1];
    return {
      node: last.childNodes[0],
      index: getElememtSize(last),
    };
  }
  if (!node?.childNodes[0]) return
  return {
    node: node?.childNodes[0],
    index,
  };
};
