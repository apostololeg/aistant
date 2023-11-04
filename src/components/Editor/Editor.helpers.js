import { createRoot, hydrateRoot } from 'react-dom/client';

import { Tag } from './embeds/components/Tag/Tag';

// import { Img, ImgEditable } from './embeds/components/Img';

const VIEW_COMPONENTS = {
  Tag,
  // Img,
};

const EDITABLE_COMPONENTS = {
  // Img: ImgEditable,
};

const NODE_TO_RENDER_ROOT = new WeakMap();

function getNodeRoot(node) {
  if (NODE_TO_RENDER_ROOT.has(node)) {
    return NODE_TO_RENDER_ROOT.get(node);
  }

  const root = createRoot(node);

  NODE_TO_RENDER_ROOT.set(node, root);

  return root;
}

export function selectInputText(node) {
  let sel, range;

  if (window.getSelection && document.createRange) {
    range = document.createRange();
    range.selectNodeContents(node);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  }
}

export function hydrateComponents(rootNode, { isEditor, onChange } = {}) {
  const nodes = rootNode.querySelectorAll('[data-props]:not([data-inited])');

  nodes.forEach(node => {
    const { component, ...props } = JSON.parse(node.dataset.props);
    const C = isEditor
      ? EDITABLE_COMPONENTS[component] ?? VIEW_COMPONENTS[component]
      : VIEW_COMPONENTS[component];

    if (C) {
      if (onChange) props.onChange = onChange;

      node.innerHTML = '';
      const root = getNodeRoot(node);
      root.render(<C {...props} />);
      node.setAttribute('data-inited', '');
    }
  });
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export const bus = new EventTarget();
