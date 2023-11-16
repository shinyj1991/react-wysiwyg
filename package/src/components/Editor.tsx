import * as React from 'react';
import { useRef, useEffect } from 'react';
import { NAME_SPACE } from '../constants/core';

function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (e.currentTarget.innerHTML === '') {
      e.currentTarget.innerHTML = '<p><br /></p>';
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = '<p><br /></p>';
    }
  }, [editorRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // 다음 줄에 들어갈 p 태그 생성
      const newParagraph = document.createElement('p');

      // 현재 커서의 부모 p태그를 기준으로 다음 라인에 p태그 insert
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (!range) return;

      // const commonAncestorContainer = range.commonAncestorContainer;
      const node = selection?.focusNode;
      const selectionNode = node?.nodeType == 3 ? node.parentNode : node;
      // console.dir(selectionNode);
      // const thisParagraph = selectionNode?.closest('p');

      range.deleteContents();
      selectionNode?.parentNode?.insertBefore(
        newParagraph,
        selectionNode.nextSibling
      );

      // caret 부터 라인의 마지막까지 범위 선택
      const caretToLastRange = document.createRange();
      const childTextNode = selectionNode?.childNodes[0] as Node;
      // 간헐적으로 childTextNode.textContent의 길이보다 시작 offset이 더 클 때 에러를 방지하는 코드.
      if (
        childTextNode.textContent &&
        childTextNode.textContent?.length >= range.startOffset
      ) {
        caretToLastRange.setStart(childTextNode, range.startOffset);
        caretToLastRange.setEndAfter(childTextNode);
      }

      // 범위 복사
      const afterText = caretToLastRange.cloneContents();

      // 텍스트가 존재 한다면 잘라낸 후 newParagraph 에 추가
      if (afterText.textContent) {
        newParagraph.appendChild(caretToLastRange.extractContents());
        if (range.startOffset === 0) {
          const lineBreak = document.createElement('br');
          selectionNode?.appendChild(lineBreak);
        }
      } else {
        const lineBreak = document.createElement('br');
        newParagraph.appendChild(lineBreak);
      }

      // 생성한 p태그에 커서 위치
      const newRange = document.createRange();
      newRange.setStart(newParagraph, 0);
      newRange.setEnd(newParagraph, 0);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  };

  return (
    <div
      ref={editorRef}
      role="presentation"
      className={`${NAME_SPACE}__editor`}
      contentEditable={true}
      spellCheck={false}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
}

export default Editor;
