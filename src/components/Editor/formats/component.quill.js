import Embed from 'quill/blots/embed';

class ComponentBlot extends Embed {
  static create(props) {
    const node = super.create(props);

    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-props', JSON.stringify(props));

    return node;
  }
}

ComponentBlot.blotName = 'component';
ComponentBlot.tagName = 'span';

export default ComponentBlot;
