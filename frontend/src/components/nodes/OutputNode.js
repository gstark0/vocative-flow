import React from 'react';
import GenericNode from './GenericNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const OutputNode = (props) => {
  return <GenericNode {...props} nodeType={NODE_TYPES.OUTPUT} />;
};

export default OutputNode;
