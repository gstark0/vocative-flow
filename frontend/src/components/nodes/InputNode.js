import React from 'react';
import GenericNode from './GenericNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const InputNode = (props) => {
  return <GenericNode {...props} nodeType={NODE_TYPES.INPUT} />;
};

export default InputNode;