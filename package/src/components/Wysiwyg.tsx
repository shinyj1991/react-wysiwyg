import * as React from 'react';
import { NAME_SPACE } from '../constants/core';
import Editor from './Editor';
import Toolbar from './Toolbar';

function Wysiwyg() {
  return (
    <div className={`${NAME_SPACE}__wrapper`}>
      <Toolbar />
      <Editor />
    </div>
  );
}

export default Wysiwyg;
