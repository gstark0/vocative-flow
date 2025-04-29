import React from 'react';
import GenericNode from './GenericNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const TemplateNode = (props) => {
  return <GenericNode {...props} nodeType={NODE_TYPES.TEMPLATE} />;
};

export default TemplateNode;