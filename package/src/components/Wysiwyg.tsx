import * as React from 'react';
import { NAME_SPACE } from '../constants/core';
import Editor from './Editor';
import Toolsbar from './Toolsbar';

interface IProps {}

function Wysiwyg({}: IProps) {
  return (
    <div className={`${NAME_SPACE}__wrapper`}>
      <Toolsbar />
      <Editor />
    </div>
  );
}

export default Wysiwyg;
