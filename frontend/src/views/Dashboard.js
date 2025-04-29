import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import CssBaseline from '@mui/joy/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Form, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/joy/Tooltip';

import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import CircularProgress from '@mui/joy/CircularProgress';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

import NodeDetailsSidebar from '../components/NoteDetailsSidebar';

import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { ReactFlow, addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Modal from '@mui/joy/Modal';

import LeftSidebar from '../components/LeftSidebar';
import PromptEditor from './modals/PromptEditor';
import ExamplesEditor from './modals/ExamplesEditor';
import CodeEditor from './modals/CodeEditor';
import TemplateEditor from './modals/TemplateEditor';

import AINode from '../components/nodes/AINode';
import CodeNode from '../components/nodes/CodeNode';
import InputNode from '../components/nodes/InputNode';
import OutputNode from '../components/nodes/OutputNode';
import TemplateNode from '../components/nodes/TemplateNode';

import { useAutosave } from '../hooks/useAutosave';
import { SaveIndicator } from '../components/SaveIndicator'; 
import { useAuth } from '../contexts/AuthContext';
import { flowService } from '../api/services/flowService';
import { projectService } from '../api/services/projectService';

const nodeTypes = {
    ai_node: AINode,
    code_node: CodeNode,
    input_node: InputNode,
    output_node: OutputNode,
    template_node: TemplateNode,
}

const initialNodes = [];
const initialEdges = [];

export default function Dashboard() {
    const { user } = useAuth();
    const { id } = useParams(); // Get project ID from URL params
    const projectId = id; // For clarity
    const navigate = useNavigate();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [project, setProject] = useState(null);
    const [generalSettings, setGeneralSettings] = useState(null);

    const [nodeLabelsMap, setNodeLabelsMap] = useState({}); // Map to track node labels
    const [selectedNode, setSelectedNode] = useState(null); // Track the selected node
    const [selectedNodeInputs, setSelectedNodeInputs] = useState([]); // Track the selected node's inputs
    const [selectedNodeOutputs, setSelectedNodeOutputs] = useState([]); // Track the selected node's outputs
    const [sidebarVisible, setSidebarVisible] = useState(false); // Track sidebar visibility

    const [isPromptModalOpen, setPromptModalOpen] = useState(false);
    const [isExamplesModalOpen, setExamplesModalOpen] = useState(false);
    const [isCodeEditorOpen, setCodeEditorOpen] = useState(false);
    const [isTemplateEditorOpen, setTemplateEditorOpen] = useState(false);

    // API
    const [loading, setLoading] = useState(true);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState(null);

    // Open and close modals
    const openPromptEditor = () => setPromptModalOpen(true);
    const openTemplateEditor = () => setTemplateEditorOpen(true);
    const closeTemplateEditor = () => setTemplateEditorOpen(false);
    const closePromptEditor = () => setPromptModalOpen(false);
    const openExamplesModal = () => setExamplesModalOpen(true);
    const closeExamplesModal = () => setExamplesModalOpen(false);
    const openCodeEditor = () => setCodeEditorOpen(true);
    const closeCodeEditor = () => setCodeEditorOpen(false);
    
    // Add auto-save functionality using the project ID
    const { saveStatus, lastSaved, forceSave } = useAutosave({
        nodes,
        edges,
        projectId // Use projectId directly (from the id parameter)
    });    

    // Load project info
    useEffect(() => {
        const loadProjectInfo = async () => {
            setProjectLoading(true);
            if (!projectId) return;
            
            try {
                const projectData = await projectService.getProject(projectId);
                const generalSettings = await projectService.getGeneralSettings();
                setProject(projectData);
                setGeneralSettings(generalSettings);
                setProjectLoading(false);
            } catch (err) {
                console.error('Failed to load project info:', err);
                setProjectLoading(false);
                // Non-critical error, so we don't set the error state
            }
        };
        
        loadProjectInfo();
    }, [projectId]);

    // Load flow data
    useEffect(() => {
        const loadFlow = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use projectId from URL or fallback to "1" for backward compatibility
                const flowData = await flowService.getFlow(projectId || "1");
                
                if (flowData.nodes) {
                    // Make input and output nodes non-deletable
                    const updatedNodes = flowData.nodes.map(node => {
                        if (node.type === 'input_node' || node.type === 'output_node') {
                            return { ...node, deletable: false };
                        }
                        return node;
                    });
                    setNodes(updatedNodes);
                }
                
                if (flowData.edges) {
                    setEdges(flowData.edges);
                }
                
                console.log('Loaded flow:', flowData);
            } catch (err) {
                console.error('Failed to load flow:', err);
                setError('Failed to load flow data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadFlow();
    }, [projectId, setNodes, setEdges]);

    // Whenever node or edge is updated, update the nodes map
    useEffect(() => {
        updateNodesMap();
    }, [nodes, edges]);

    // Function to handle back navigation to projects page
    const handleBackToProjects = () => {
        if (saveStatus === 'saving') {
            // Wait for save to complete or force save
            forceSave().then(() => {
                navigate('/projects');
            });
        } else {
            navigate('/projects');
        }
    };

    const updateNodesMap = () => {
        // Create a map of node IDs to labels for easy access
        const labelsMap = {};
        nodes.forEach(node => {
            labelsMap[node.id] = {
                label: node.data.label,
                inputs: [],
                outputs: []
            };
        });
        console.log(labelsMap)

        for (const edge of edges) {
            labelsMap[edge.source].outputs.push(labelsMap[edge.target].label);
            labelsMap[edge.target].inputs.push(labelsMap[edge.source].label);
        }
        setNodeLabelsMap(labelsMap);
    }

    // Function to handle node click and show sidebar
    const onNodeClick = (event, node) => {
        setSelectedNode(node);
        setSidebarVisible(true); // Open the sidebar
    };

    // Close the right sidebar
    const closeSidebar = () => {
        setSidebarVisible(false);
        setSelectedNode(null);
    };

    const onConnect = useCallback((params) =>
        setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds)),
    [setEdges]);
    

    // Function to add a new node
    const addNode = (type) => {
        const userId = localStorage.getItem('user_id');
        const newNode = {
            id: `${userId}_${projectId || '1'}_${nodes.length + 1}`,
            sourcePosition: 'right',
            type: type,
            targetPosition: 'left',
            data: { label: `Node ${nodes.length + 1}`, examples: [] },
            position: { x: Math.random() * 400, y: Math.random() * 400 }, // random positioning for now
        };
        setNodes((nds) => [...nds, newNode]);
    };

    // Function to remove a node
    const removeNode = () => {
        if (nodes.length === 0) return; // Prevent removing when no nodes
        setNodes((nds) => nds.slice(0, -1)); // Removes the last node
    };

    const updateNode = (updatedNode) => {
        // For code nodes, make sure the code field is in the right place in data structure
        if (updatedNode.type === 'code_node' && updatedNode.data.code) {
            // Structure needs to match what the backend expects
            updatedNode = {
                ...updatedNode,
                data: {
                    ...updatedNode.data,
                    code: updatedNode.data.code // Ensure code is part of data
                }
            };
        }
        
        setNodes((nds) => nds.map((node) => 
            (node.id === updatedNode.id ? updatedNode : node)
        ));
        setSelectedNode(updatedNode);
    };
    
    // Handle code saving
    const handleCodeSave = (newCode) => {
        if (!selectedNode) return;
        
        const updatedNode = {
            ...selectedNode,
            data: { ...selectedNode.data, code: newCode }
        };
        updateNode(updatedNode);
    };

    // Function to handle node name change
    const handleNodeNameChange = (event) => {
        if (!selectedNode) return;
        
        const newName = event.target.value;
        // Update the node's label
        setNodes((nds) =>
            nds.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, label: newName } } : node))
        );
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: newName } });
    };

    // If loading, show loading indicator
    if (loading && nodes.length === 0) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <CircularProgress size="lg" />
                <Typography level="body-lg" sx={{ ml: 2 }}>
                    Loading flow data...
                </Typography>
            </Box>
        );
    }

    return (
        <Sheet sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider' 
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Back to projects">
                        <IconButton 
                            variant="soft" 
                            color="neutral" 
                            onClick={handleBackToProjects}
                            size="sm"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography level="h4" sx={{ ml: 1 }}>
                        {project?.name || 'Flow Editor'}
                    </Typography>
                </Box>
                
                <SaveIndicator status={saveStatus} lastSaved={lastSaved} sidebarVisible={sidebarVisible} />
            </Box>
            
            <Box sx={{
                display: 'flex',
                direction: 'row',
                flex: 1,
                overflow: 'hidden',
            }}>
                {/* Sidebar */}
                { !projectLoading ?
                    <LeftSidebar
                        onAddNode={addNode}
                        onRemoveNode={removeNode}
                        supportedTranscriptLanguages={generalSettings?.transcript_languages}
                        selectedTranscriptLanguages={project?.supported_languages}
                        clientSystemUrl={project?.url_name}
                        onLanguagesChange={languageIds => {
                            projectService.updateProject(projectId, {
                                'language_ids': languageIds
                            })
                        }}
                    /> : 
                    <Box sx={{ width: 280, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }

                {/* Main Content */}
                <Box sx={{
                    flex: 1,
                    height: '100%',
                    backgroundColor: 'background.surface',
                }}>
                    {error ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%' 
                        }}>
                            <Typography level="h4" color="danger">
                                Error
                            </Typography>
                            <Typography level="body-md" sx={{ mt: 2, mb: 4 }}>
                                {error}
                            </Typography>
                            <Button 
                                variant="soft" 
                                color="primary" 
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </Button>
                        </Box>
                    ) : (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick} // Listen to node clicks
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            style={{ width: '100%', height: '100%' }}
                            fitView
                        >
                            <Controls />
                            <Background />
                        </ReactFlow>
                    )}
                </Box>

                {/* Right Sidebar for Node Details */}
                <NodeDetailsSidebar
                    visible={sidebarVisible}
                    selectedNode={selectedNode}
                    onClose={closeSidebar}
                    onNodeNameChange={handleNodeNameChange}
                    selectedNodeInputs={nodeLabelsMap[selectedNode?.id]?.inputs || []}
                    selectedNodeOutputs={nodeLabelsMap[selectedNode?.id]?.outputs || []}
                    openPromptModal={openPromptEditor}
                    openTemplateEditor={openTemplateEditor}
                    openExamplesModal={openExamplesModal}
                    openCodeEditor={openCodeEditor}
                    prompt={selectedNode?.data?.prompt}
                />
            </Box>

            {/* Full-Screen Modal for Editing Prompt */}
            <PromptEditor
                open={isPromptModalOpen}
                onClose={() => setPromptModalOpen(false)}
                selectedNode={selectedNode}
                availableVariables={nodeLabelsMap[selectedNode?.id]?.inputs || []}
                onSave={(newPrompt) => {
                    // Update node with new prompt
                    if (!selectedNode) return;
                    
                    const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, prompt: newPrompt }
                    };
                    updateNode(updatedNode);
                }}
            />

            {/* Full-Screen Modal for Examples */}
            <ExamplesEditor
                open={isExamplesModalOpen}
                onClose={() => setExamplesModalOpen(false)}
                selectedNode={selectedNode}
                onUpdateExamples={(newExamples) => {
                    // Update node with new examples
                    if (!selectedNode) return;
                    
                    const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, examples: newExamples }
                    };
                    updateNode(updatedNode);
                }}
            />

            <CodeEditor
                open={isCodeEditorOpen}
                onClose={closeCodeEditor}
                selectedNode={selectedNode}
                onSave={handleCodeSave}
            />

            <TemplateEditor
                open={isTemplateEditorOpen}
                onClose={closeTemplateEditor}
                selectedNode={selectedNode}
                availableVariables={nodeLabelsMap[selectedNode?.id]?.inputs || []}
                onSave={(newTemplate) => {
                    // Update node with new template
                    if (!selectedNode) return;
                    
                    const updatedNode = {
                        ...selectedNode,
                        data: { ...selectedNode.data, template: newTemplate }
                    };
                    updateNode(updatedNode);
                }}
            />
        </Sheet>
    );
}