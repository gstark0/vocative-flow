import React from 'react';
import GenericNode from './GenericNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const AINode = (props) => {
  return <GenericNode {...props} nodeType={NODE_TYPES.AI} />;
};

export default AINode;