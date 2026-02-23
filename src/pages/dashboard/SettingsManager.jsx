import React, { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { motion } from 'framer-motion';

export default function SettingsManager() {
    const [settings, setSettings] = useState({
        primaryColor: '#1E4266',
        secondaryColor: '#EFCF96',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const defaultColors = {
        primaryColor: '#1E4266',
        secondaryColor: '#EFCF96',
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('Website/settings');
                const data = response.data;
                setSettings({
                    primaryColor: data.primaryColor || data.PrimaryColor || defaultColors.primaryColor,
                    secondaryColor: data.secondaryColor || data.SecondaryColor || defaultColors.secondaryColor,
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleColorChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        // Live preview
        document.documentElement.style.setProperty(`--${key.replace('Color', '-color')}`, value);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // Using PascalCase to match C# DTO strictly if needed
            await api.post('Website/settings', { Key: 'primaryColor', Value: settings.primaryColor });
            await api.post('Website/settings', { Key: 'secondaryColor', Value: settings.secondaryColor });

            setMessage({ type: 'success', text: 'Theme colors saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            const status = error.response?.status;
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;

            setMessage({
                type: 'error',
                text: `Failed to save theme colors${status ? ` (${status})` : ''}. ${typeof errorMsg === 'string' ? errorMsg : ''}`
            });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Reset to default brand colors?")) {
            handleColorChange('primaryColor', defaultColors.primaryColor);
            handleColorChange('secondaryColor', defaultColors.secondaryColor);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Brand Identity & Colors</h3>
                            <p className="text-sm text-gray-500">Customize the primary and secondary colors of your website.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{message.text}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Primary Color */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Primary Color</label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl shadow-inner border-4 border-white"
                                    style={{ backgroundColor: settings.primaryColor }}
                                />
                                <div className="flex-1">
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                        className="w-full h-10 cursor-pointer rounded-lg border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.primaryColor}
                                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                        className="mt-2 w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 italic font-medium">Used for headers, main buttons, and primary elements.</p>
                        </div>

                        {/* Secondary Color */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Secondary Color</label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl shadow-inner border-4 border-white"
                                    style={{ backgroundColor: settings.secondaryColor }}
                                />
                                <div className="flex-1">
                                    <input
                                        type="color"
                                        value={settings.secondaryColor}
                                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                                        className="w-full h-10 cursor-pointer rounded-lg border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.secondaryColor}
                                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                                        className="mt-2 w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 italic font-medium">Used for accents, progress bars, and hover states.</p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Live Preview Examples</h4>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20">Primary Button</button>
                            <button className="px-6 py-2 bg-secondary text-primary rounded-lg font-bold">Secondary Accent</button>
                            <div className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-bold">Outline</div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-primary" />
                                </div>
                                <span className="text-primary font-bold">Contrast Check</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        <RotateCcw size={18} />
                        Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Theme Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
