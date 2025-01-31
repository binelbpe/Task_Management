import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, Mail, Phone, Lock } from 'lucide-react';
import axios from 'axios';

const AgentForm = ({ onSuccess, onCancel, editAgent }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editAgent) {
            setFormData({
                name: editAgent.name || '',
                email: editAgent.email || '',
                mobile: editAgent.mobile || '',
                password: '' 
            });
        }
    }, [editAgent]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const submitData = { ...formData };
            if (editAgent && !submitData.password) {
                delete submitData.password;
            }
            if (editAgent) {
                await axios.patch(`http://localhost:5000/agents/${editAgent._id}`, submitData, { headers });
            } else {
                await axios.post('http://localhost:5000/agents', submitData, { headers });
            }
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || `Failed to ${editAgent ? 'update' : 'create'} agent`);
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.3
            }
        }
    };

    const inputVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    const fields = [
        { name: 'name', icon: UserIcon, type: 'text', placeholder: 'Full Name' },
        { name: 'email', icon: Mail, type: 'email', placeholder: 'Email Address' },
        { name: 'mobile', icon: Phone, type: 'text', placeholder: 'Mobile Number' },
        {
            name: 'password',
            icon: Lock,
            type: 'password',
            placeholder: editAgent ? 'Leave blank to keep current password' : 'Password',
            required: !editAgent
        }
    ];

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 rounded-xl shadow-lg border border-violet-100"
        >
            <div className="flex items-center justify-between mb-6">
                <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 text-transparent bg-clip-text"
                >
                    {editAgent ? 'Update Agent' : 'Add New Agent'}
                </motion.h3>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                    ×
                </motion.button>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-red-50 text-red-600 p-4 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field, index) => (
                    <motion.div
                        key={field.name}
                        variants={inputVariants}
                        custom={index}
                        className="group"
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field.name}
                        </label>
                        <div className="relative">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                                <field.icon className="h-5 w-5 text-violet-500 transition-colors duration-200" />
                            </motion.div>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="pl-10 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 bg-white hover:bg-gray-50 focus:bg-white"
                                required={field.required !== false}
                            />
                        </div>
                    </motion.div>
                ))}

                <div className="pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white py-3 px-4 rounded-lg hover:from-violet-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: 360,
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{
                                            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 1, repeat: Infinity }
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                    />
                                    {editAgent ? 'Updating...' : 'Creating...'}
                                </motion.div>
                            ) : (
                                <motion.span
                                    key="submit"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center"
                                >
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    {editAgent ? 'Update Agent' : 'Create Agent'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center"
            >
                <p className="text-sm text-gray-500">
                    Fill in all required fields to create a new agent
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AgentForm;