import { Component, ReactNode } from 'react';
import { Button, Icon, Scroll, Select, debounce } from '@homecode/ui';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import Time from 'timen';
import compare from 'compareq';

import Quill from './Quill';
import Toolbar from './Toolbar/Toolbar';
import Tools from './tools';

import S from './Editor.styl';
import {
  hydrateComponents,
  bus,
  removeAllChildNodes,
  selectInputText,
} from './Editor.helpers';
import PostRenderHelpers from './PostRenderHelpers';

// const Parchment = Quill.import('parchment');

type Props = {
  className?: string;
  store?: any;
  readOnly?: boolean;
  value: string;
  onChange?: (value: string) => void;
  toolbarAddons?: ReactNode;
};

@withStore({ router: ['query'] })
export default class Editor extends Component<Props> {
  editor;
  tools;
  domParser;
  store;

  state = {
    showToolbar: false,
    isFullscreen: false,
    isSuggestOpen: true,
  };

  componentDidMount() {
    const { value, readOnly } = this.props;

    this.editor = new Quill('#editor');
    this.tools = new Tools(this.editor, Quill);
    this.domParser = new DOMParser();

    // @ts-ignore
    window.editor = this.editor;

    if (readOnly) this.editor.enable(false);

    this.setValue(value);
    this.setState({ showToolbar: true });

    this.editor.on('editor-change', this.onChange);
    this.editor.on('selection-change', this.onSelectionChange);
    // window.addEventListener('keydown', this.onSelectionChange);

    bus.addEventListener('change', this.onChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value, toolbarAddons } = this.props;

    return (
      nextProps.value !== value ||
      (nextProps.toolbarAddons && !toolbarAddons) ||
      !compare(nextState, this.state)
    );
  }

  componentDidUpdate() {
    const { value } = this.props;

    if (value !== this.getValue()) this.setValue(value);
  }

  componentWillUnmount() {
    this.editor.off('editor-change', this.onChange);
  }

  hydrateComponents = debounce(
    () => hydrateComponents(this.editor.root, { isEditor: true }),
    500
  );

  setValue = value => {
    this.editor.root.innerHTML = value;
    this.hydrateComponents();
  };

  getValue = () => {
    const { root } = this.editor;
    const tree = root.cloneNode(true);

    tree.querySelectorAll('[data-props]').forEach(node => {
      removeAllChildNodes(node);
      node.removeAttribute('data-inited');
    });

    return tree.innerHTML;
  };

  onSelectionChange = (range, prevRange) => {
    if (!range || range.index === prevRange?.index) return;

    const dir = !prevRange ? 0 : range.index < prevRange?.index ? -1 : 1;
    const blot = this.editor.getLeaf(range.index + dir)[0];
    const input = blot?.domNode?.querySelector?.('[contenteditable=true]');

    if (!input) return;

    console.log('onSelectionChange', input);
    input.focus();
    Time.after(50, () => selectInputText(input));
  };

  onChange = () => {
    const { value, onChange } = this.props;
    const newVal = this.getValue();

    if (value === newVal) return;

    this.updateSuggest();

    onChange?.(newVal);
    this.hydrateComponents();
  };

  updateSuggest = () => {};

  toggleFullscreen = () => {
    const content = this.editor.innerHTML;
    const { isFullscreen } = this.state;

    this.setState({ isFullscreen: !isFullscreen });
    Time.after(100, () => (this.editor.innerHTML = content));
  };

  render() {
    const { toolbarAddons } = this.props;
    const { showToolbar, isFullscreen, isSuggestOpen } = this.state;

    return (
      <div className={cn(S.root, isFullscreen && S.fullscreen)}>
        <PostRenderHelpers />
        {/* {showToolbar && (
          <Toolbar
            className={S.toolbar}
            editor={this.editor}
            tools={this.tools}
          >
            {toolbarAddons}
            {/* <Button
              className={S.fullscreenButton}
              square
              variant="clear"
              onClick={this.toggleFullscreen}
            >
              <Icon type="fullscreen" size="l" />
            </Button>}
          </Toolbar>
        )*/}
        <Scroll y>
          <div id="editor" className={S.editor} />
        </Scroll>
      </div>
    );
  }
}

export { hydrateComponents, PostRenderHelpers };
