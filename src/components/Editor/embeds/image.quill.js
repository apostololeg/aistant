import Quill from 'quill/core'

const BlockEmbed = Quill.import('blots/block/embed');

class Image extends BlockEmbed {
  static create({ url, alt }) {
    const node = super.create();
    node.setAttribute('alt', alt);
    node.setAttribute('src', url);
    return node;
  }

  static value(node) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    };
  }
}

Image.blotName = 'image';
Image.tagName = 'img';

export default Image
