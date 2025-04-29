// src/config/nodeConfig.js
import React from 'react';
import { NODE_COLORS } from './theme';

// Icons
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export const NODE_TYPES = {
  INPUT: 'input_node',
  CODE: 'code_node',
  AI: 'ai_node',
  TEMPLATE: 'template_node',
  OUTPUT: 'output_node',
};

export const NODE_CONFIG = {
  [NODE_TYPES.INPUT]: {
    type: 'input',
    label: 'Input',
    colors: NODE_COLORS.INPUT,
    icon: (props) => <InputOutlinedIcon {...props} />,
    description: 'The starting point of your workflow, providing data to subsequent nodes.',
    hasSourceHandle: true,
    hasTargetHandle: false,
    defaultData: {}
  },
  
  [NODE_TYPES.CODE]: {
    type: 'code',
    label: 'Code',
    colors: NODE_COLORS.CODE,
    icon: (props) => <CodeOutlinedIcon {...props} />,
    description: 'Executes custom code to transform and process data within your workflow.',
    hasSourceHandle: true,
    hasTargetHandle: true,
    defaultData: {
      code: ''
    }
  },
  
  [NODE_TYPES.AI]: {
    type: 'ai',
    label: 'AI',
    colors: NODE_COLORS.AI,
    icon: (props) => <SmartToyOutlinedIcon {...props} />,
    description: 'Processes data using AI models and generates outputs based on prompts.',
    hasSourceHandle: true,
    hasTargetHandle: true,
    defaultData: {
      prompt: '',
      examples: []
    }
  },
  
  [NODE_TYPES.TEMPLATE]: {
    type: 'template',
    label: 'Template',
    colors: NODE_COLORS.TEMPLATE,
    icon: (props) => <DescriptionOutlinedIcon {...props} />,
    description: 'Creates structured output using variables from previous nodes.',
    hasSourceHandle: true,
    hasTargetHandle: true,
    defaultData: {
      template: ''
    }
  },
  
  [NODE_TYPES.OUTPUT]: {
    type: 'output',
    label: 'Output',
    colors: NODE_COLORS.OUTPUT,
    icon: (props) => <OutputOutlinedIcon {...props} />,
    description: 'The final output destination of your workflow.',
    hasSourceHandle: false,
    hasTargetHandle: true,
    defaultData: {}
  },
};