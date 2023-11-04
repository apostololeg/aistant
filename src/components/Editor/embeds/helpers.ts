function _setProps(
  elem: HTMLElement,
  props: Record<string, any>,
  isReplace = false
) {
  const wrapper = elem.closest('[data-props]');
  const propsAttr = wrapper?.getAttribute('data-props');
  const propsObj = propsAttr && !isReplace ? JSON.parse(propsAttr) : {};

  Object.assign(propsObj, props);
  wrapper?.setAttribute('data-props', JSON.stringify(propsObj));
}

export function setProps(elem: HTMLElement, props: Record<string, any>) {
  _setProps(elem, props, true);
}

export function updateProps(elem: HTMLElement, props: Record<string, any>) {
  _setProps(elem, props);
}
