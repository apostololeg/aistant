import { useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@homecode/ui';

import SvgIcon from 'components/SvgIcon/SvgIcon';
import { FILES_TO_UPLOAD } from 'components/Editor/embeds/components/Img/Img.helpers';

import Icon from './Image.svg';
// import S from './Image.styl';

let filesToAppend: File[] = [];

function appendFiles(action) {
  const file = filesToAppend.shift();

  if (file) {
    action(file);
    setTimeout(() => appendFiles(action), 100);
  }
}

export default {
  name: 'image',
  action({ editor, selection }, file) {
    const { index, length } = selection;
    const props = {
      component: 'Img',
      inline: true,
      photoKey: '', // full URL will be built by the component
      alt: '',
    } as any;

    if (file) {
      props.uploadKey = nanoid();
      FILES_TO_UPLOAD[props.uploadKey] = file;
    }

    if (length) editor.deleteText(index, length);

    const strtIndex = editor.selection.lastRange?.index ?? index;

    editor.insertEmbed(strtIndex, 'component', props);
  },
  Module({ className, action }) {
    const onDrop = useCallback(
      (e: any) => {
        [...e.dataTransfer.files].forEach(file => {
          if (file.type.startsWith('image/')) {
            filesToAppend.push(file);
          }
        });

        if (filesToAppend.length) {
          e.preventDefault();
          e.stopPropagation();

          appendFiles(action);
        }
      },
      [action]
    );

    useEffect(() => {
      editor.addEventListener('drop', onDrop);
    }, []);

    return (
      <Button className={className} size="m" square onClick={() => action()}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
