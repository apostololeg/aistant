export const DEFAULT_SELECTION = { index: 0, length: 0 };

export default class Tools {
  constructor(editor, Quill) {
    this.editor = editor;
    this.Quill = Quill
  }

  insertEmbed(type, params) {
    this.editor.focus();

    const index = this.getCaretPosition() + 1;

    this.editor.insertEmbed(index, type, params, this.Quill.sources.USER);
  }

  getCurrentBlot(index = 0) {
    return this.editor.scroll.path(index).slice(-1)[0][0];
  }

  getCaretPosition() {
    const userSelection = this.editor.getSelection();

    return userSelection?.index || 0;
  }

  getWordSelection() {
    const index = this.getCaretPosition();
    const blot = this.getCurrentBlot(index);

    if (blot.length() === 0 || !blot.text?.trim()) {
      return { index, length: 0 };
    }

    // try select word
    //  – in blot text
    //  – at carret position

    const words = blot.text.split(' ');
    let wordIndex = blot.offset(editor.scroll); // blot index
    let wordLength = 0;
    let nextWord = null;

    for (let i = 0; i < words.length; i++) {
      wordLength = words[i].length;
      nextWord = words[i + 1];

      if (!nextWord || wordIndex + nextWord.length >= index) break;

      wordIndex += wordLength + 1;
    }

    return {
      index: wordIndex,
      length: wordLength
    };
  }
}
