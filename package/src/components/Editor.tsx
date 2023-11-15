import * as React from 'react';
import { NAME_SPACE } from '../constants/core';

function Editor() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e);
    if (e.key === 'Enter') {
      console.log('enter');
      document.execCommand('formatBlock', false, 'p');
    }
  };

  return (
    <div
      role="presentation"
      contentEditable={true}
      data-placeholder="Body Contents"
      className={`${NAME_SPACE}__editor`}
      onKeyDown={handleKeyDown}
    >
      <p>
        <br />
      </p>
    </div>
  );
}

export default Editor;
