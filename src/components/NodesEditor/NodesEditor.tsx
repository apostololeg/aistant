import { Component } from 'react';
import { withStore, createStore } from 'justorm/react';
import cn from 'classnames';

import NodeForm from 'components/NodeForm/NodeForm';
import { Button, Icon } from '@homecode/ui';

import S from './NodesEditor.styl';

type Props = {
  store?: any;
};

@withStore({ nodes: 'items' })
export default class NodesEditor extends Component<Props> {
  store = null;
  innerRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      isDragging: false,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    });
  }

  componentDidMount() {
    console.log('123');

    document.addEventListener('wheel', this.onWheel);
    document.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  componentWillUnmount() {
    document.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  setTransform() {
    const { translateX, translateY, translateZ } = this.store;

    // @ts-ignore
    this.innerRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
  }

  onBgClick = e => {
    if (e.target.classList.contains(S.inner)) {
      this.props.store.nodes.setSelected(null);
    }
  };

  onPointerDown = e => {
    console.log('pointer down');

    const isInInput = e.target.closest('input, textarea, [contenteditable]');

    if (isInInput) return;

    this.store.isDragging = true;
  };

  onPointerMove = e => {
    console.log('pointer move');

    const { isDragging } = this.store;

    if (isDragging) {
      console.log('dragging', e.movementX, e.movementY);

      this.store.translateX += e.movementX;
      this.store.translateY += e.movementY;

      this.setTransform();
      return;
    }

    // Change transformOrigin of innerRef to center of pointer
    // // Get the bounding rectangle of the element
    // const rect = this.innerRef.current.getBoundingClientRect();

    // // Calculate the pointer's position relative to the element
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;

    // // Calculate the percentage position of the pointer within the element
    // const xPercent = (x / rect.width) * 100;
    // const yPercent = (y / rect.height) * 100;

    // // Update the transformOrigin property
    // this.innerRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  };

  onPointerUp = e => {
    console.log('pointer up');
    this.store.isDragging = false;
  };

  onWheel = e => {
    // TODO: settings.zoomKey
    if (!e.ctrlKey) return;

    e.preventDefault();
    e.stopPropagation();

    const prevVal = e.altKey ? this.store.translateY : this.store.translateZ;
    const newVal = Math.min(100, Math.max(prevVal - e.deltaY, -3000));

    if (e.altKey) {
      this.store.translateY = newVal;
    } else {
      this.store.translateZ = newVal;
    }

    console.log('zoom', this.store.translateZ);

    this.setTransform();

    // @ts-ignore
    // this.innerRef.current.style.transform = `translateZ(${this.zoom}px)`;
  };

  render() {
    const { isDragging, translateX, translateY, translateZ } = this.store;
    const { nodes } = this.props.store;
    const items = nodes.items.originalObject;

    console.log('RENDER', isDragging, translateX, translateY, translateZ);

    return (
      <div className={cn(S.root, isDragging && S.isDragging)}>
        <div className={S.inner} ref={this.innerRef} onClick={this.onBgClick}>
          {items.map(({ id }) => (
            <NodeForm key={id} id={id} className={S.item} />
          ))}

          <div className={cn(S.item, S.createNodeButton)}>
            <Button variant="default" onClick={() => nodes.createNode()}>
              <Icon type="plus" />
              &nbsp; Create new node
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
