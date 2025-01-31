import React, { useState, useEffect } from 'react';
import { UserIcon, TrashIcon, Plus, X, UploadIcon, PencilIcon, ClipboardListIcon, LogOutIcon } from 'lucide-react';
import axios from 'axios';
import AgentForm from './AgentForm';
import { motion, } from 'framer-motion';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useNavigate } from 'react-router-dom';



const AgentList = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editAgent, setEditAgent] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [agentTasks, setAgentTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDelete = async (agent) => {
        setAgentToDelete(agent);
        setDeleteDialogOpen(true);
    };

    const fetchAgentTasks = async (agentId) => {
        console.log('agentId>>', agentId);

        setTasksLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/agents/${agentId}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgentTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setError('Failed to fetch agent tasks');
        } finally {
            setTasksLoading(false);
        }
    };



    const handleAgentClick = (agent) => {
        setSelectedAgent(agent);
        setTaskDialogOpen(true);
        fetchAgentTasks(agent._id);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
     
        const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid CSV or Excel file');
            return;
        }

        setSelectedFile(file);
    };

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/agents', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const agentsWithTaskCounts = await Promise.all(
                response.data.map(async (agent) => {
                    const tasksResponse = await axios.get(`http://localhost:5000/agents/${agent._id}/tasks`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    return {
                        ...agent,
                        taskCount: tasksResponse.data.length
                    };
                })
            );
            setAgents(agentsWithTaskCounts);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.response?.data?.message || 'Failed to fetch agents');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/agents/${agentToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgents(prevAgents => prevAgents.filter(agent => agent._id !== agentToDelete._id));
            setDeleteDialogOpen(false);
            setAgentToDelete(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete agent');
        }
    };

    const handleUpdate = (agent) => {
        setEditAgent(agent);
        setShowForm(true);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', selectedFile);

            await axios.post('http://localhost:5000/distribution/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => console.log(res.data)
            ).catch(error => console.log(error)
            )

            setError('');
            setSelectedFile(null);
            alert('File uploaded and distributed successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'File upload failed');
        }
    };

    const TaskDialog = () => (
        <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                            {selectedAgent?.name}'s Assigned Tasks
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        {tasksLoading ? (
                            <div className="flex justify-center py-8">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 1, repeat: Infinity }
                                    }}
                                    className="h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full"
                                />
                            </div>
                        ) : agentTasks.length > 0 ? (
                            <motion.div
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {agentTasks.map((task, index) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gradient-to-r from-violet-50 to-cyan-50 p-4 rounded-lg border border-violet-100 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <h4 className="font-medium text-gray-900">{task.firstName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong className="text-violet-600">Phone:</strong> {task.phone}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong className="text-violet-600">Notes:</strong> {task.notes}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-500">
                                                Created At: {new Date(task.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-8"
                            >
                                <ClipboardListIcon className="h-12 w-12 text-gray-400 mx-auto" />
                                <p className="mt-2 text-gray-500">No tasks assigned yet</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );

    const DeleteConfirmationDialog = () => (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                            Delete Agent
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 mt-2">
                            Are you sure you want to delete {agentToDelete?.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="border border-gray-200 hover:bg-gray-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </motion.div>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                        Agent Management
                    </h1>
                    <div className="flex gap-4">
                        <label className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer">
                            <UploadIcon size={20} />
                            Upload CSV
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditAgent(null);
                            }}
                            className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2"
                        >
                            {showForm ? <X size={20} /> : <Plus size={20} />}
                            {showForm ? 'Close Form' : 'Add New Agent'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:from-red-600 hover:to-pink-600"
                        >
                            <LogOutIcon size={20} />
                            Logout
                        </button>
                    </div>
                </div>

                {selectedFile && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-violet-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-violet-600">
                                Selected file: {selectedFile.name}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpload}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Confirm Upload
                                </button>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mb-8">
                        <AgentForm
                            onSuccess={() => {
                                fetchAgents();
                                setShowForm(false);
                            }}
                            onCancel={() => setShowForm(false)}
                            editAgent={editAgent}
                        />
                    </div>
                )}

            
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

        
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : agents && agents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map(agent => (
                            <div
                                key={agent._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-violet-100 cursor-pointer relative"
                                onClick={() => handleAgentClick(agent)}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-4 right-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                                >
                                    {agent.taskCount || 0} Tasks
                                </motion.div>

                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="ml-3 text-lg font-medium text-gray-900">
                                            {agent.name}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full bg-violet-400"></span>
                                            {agent.email}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
                                            {agent.mobile}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdate(agent);
                                                setEditAgent(agent)
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-2" />
                                            Edit Agent
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(agent);
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            Delete Agent
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-violet-100">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto">
                            <UserIcon className="h-10 w-10 text-violet-600" />
                        </div>
                        <h3 className="mt-6 text-xl font-medium text-gray-900">No agents found</h3>
                        <p className="mt-2 text-sm text-gray-500">Get started by creating a new agent.</p>
                    </div>
                )}
            </div>
          
            <TaskDialog />
            <DeleteConfirmationDialog />
        </div>
    );
};

export default AgentList;