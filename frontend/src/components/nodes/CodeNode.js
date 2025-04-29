import React from 'react';
import GenericNode from './GenericNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const CodeNode = (props) => {
  return <GenericNode {...props} nodeType={NODE_TYPES.CODE} />;
};

export default CodeNode;