import * as React from 'react';
import { NAME_SPACE } from '../constants/core';

function surroundSelection(elementType) {
  function getAllDescendants(node, callback) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      getAllDescendants(child, callback);
      callback(child);
    }
  }

  function glueSplitElements(firstEl, secondEl) {
    let done = false,
      result = [];

    if (firstEl === undefined || secondEl === undefined) {
      return false;
    }

    if (firstEl.nodeName === secondEl.nodeName) {
      result.push([firstEl, secondEl]);

      while (!done) {
        firstEl = firstEl.childNodes[firstEl.childNodes.length - 1];
        secondEl = secondEl.childNodes[0];

        if (firstEl === undefined || secondEl === undefined) {
          break;
        }

        if (firstEl.nodeName !== secondEl.nodeName) {
          done = true;
        } else {
          result.push([firstEl, secondEl]);
        }
      }
    }

    for (let i = result.length - 1; i >= 0; i--) {
      const elements = result[i];
      while (elements[1].childNodes.length > 0) {
        elements[0].appendChild(elements[1].childNodes[0]);
      }
      elements[1].parentNode.removeChild(elements[1]);
    }
  }

  // abort in case the given elemenType doesn't exist.
  try {
    document.createElement(elementType);
  } catch (e) {
    return false;
  }

  const selection = getSelection();

  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0),
      rangeContents = range.extractContents(),
      nodesInRange = rangeContents.childNodes,
      nodesToWrap = [];

    for (var i = 0; i < nodesInRange.length; i++) {
      if (nodesInRange[i].nodeName.toLowerCase() === '#text') {
        nodesToWrap.push(nodesInRange[i]);
      } else {
        getAllDescendants(nodesInRange[i], function (child) {
          if (child.nodeName.toLowerCase() === '#text') {
            nodesToWrap.push(child);
          }
        });
      }
    }

    for (var i = 0; i < nodesToWrap.length; i++) {
      let child = nodesToWrap[i],
        wrap = document.createElement(elementType);

      if (child.nodeValue.replace(/(\s|\n|\t)/g, '').length !== 0) {
        child.parentNode.insertBefore(wrap, child);
        wrap.appendChild(child);
      } else {
        wrap = null;
      }
    }

    const firstChild = rangeContents.childNodes[0];
    const lastChild =
      rangeContents.childNodes[rangeContents.childNodes.length - 1];

    range.insertNode(rangeContents);

    glueSplitElements(firstChild.previousSibling, firstChild);
    glueSplitElements(lastChild, lastChild.nextSibling);

    rangeContents = null;
  }
}

function Toolbar() {
  const boleHandler = () => {
    surroundSelection('b');
  };

  return (
    <div className={`${NAME_SPACE}__toolsbar`}>
      <button type="button" onClick={boleHandler}>
        bold
      </button>
    </div>
  );
}

export default Toolbar;
