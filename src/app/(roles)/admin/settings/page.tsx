'use client'

import { useState } from 'react'
import { Card } from '@/components/common/ui/card'
import { Button } from '@/components/common/ui/button'
import { Input } from '@/components/common/ui/input'
import { Settings, Save, AlertCircle, CheckCircle, Mail, Shield, Database } from 'lucide-react'

export default function AdminSettingsPage() {
	const [activeTab, setActiveTab] = useState<'general' | 'security' | 'maintenance'>('general')
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

	// General Settings
	const [platformName, setPlatformName] = useState('AI-LMS')
	const [supportEmail, setSupportEmail] = useState('support@ai-lms.com')
	const [maxEnrollmentPerCourse, setMaxEnrollmentPerCourse] = useState('100')

	// Security Settings
	const [requireMFA, setRequireMFA] = useState(false)
	const [sessionTimeout, setSessionTimeout] = useState('30')
	const [passwordMinLength, setPasswordMinLength] = useState('8')

	// Maintenance Settings
	const [maintenanceMode, setMaintenanceMode] = useState(false)
	const [maintenanceMessage, setMaintenanceMessage] = useState('System is under maintenance. Please try again later.')

	const handleSaveSettings = async (section: 'general' | 'security' | 'maintenance') => {
		setSaving(true)
		try {
			const payload =
				section === 'general'
					? { platformName, supportEmail, maxEnrollmentPerCourse: parseInt(maxEnrollmentPerCourse) }
					: section === 'security'
						? { requireMFA, sessionTimeout: parseInt(sessionTimeout), passwordMinLength: parseInt(passwordMinLength) }
						: { maintenanceMode, maintenanceMessage }

			const response = await fetch('/api/admin/settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ section, ...payload })
			})

			if (!response.ok) throw new Error('Failed to save settings')

			setMessage({ type: 'success', text: 'Settings saved successfully!' })
			setTimeout(() => setMessage(null), 3000)
		} catch (err) {
			setMessage({
				type: 'error',
				text: err instanceof Error ? err.message : 'Failed to save settings'
			})
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div>
				<div className="flex items-center gap-2 mb-2">
					<Settings className="w-6 h-6" />
					<h1 className="text-3xl font-bold">Platform Settings</h1>
				</div>
				<p className="text-muted-foreground">Configure platform-wide settings and policies</p>
			</div>

			{/* Success/Error Message */}
			{message && (
				<div
					className={`flex items-center gap-2 p-4 rounded-lg border ${
						message.type === 'success'
							? 'bg-green-50 border-green-200 text-green-700'
							: 'bg-red-50 border-red-200 text-red-700'
					}`}
				>
					{message.type === 'success' ? (
						<CheckCircle className="w-5 h-5" />
					) : (
						<AlertCircle className="w-5 h-5" />
					)}
					<p className="text-sm">{message.text}</p>
				</div>
			)}

			{/* Tabs */}
			<div className="flex gap-2 border-b">
				{(['general', 'security', 'maintenance'] as const).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
							activeTab === tab
								? 'border-primary text-primary'
								: 'border-transparent text-muted-foreground hover:text-foreground'
						}`}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>

			{/* General Settings */}
			{activeTab === 'general' && (
				<Card className="p-6 space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Mail className="w-5 h-5" />
							General Settings
						</h2>
					</div>

					{/* Platform Name */}
					<div>
						<label className="block text-sm font-medium mb-2">Platform Name</label>
						<Input
							value={platformName}
							onChange={(e) => setPlatformName(e.target.value)}
							placeholder="e.g., AI-LMS"
						/>
						<p className="text-xs text-muted-foreground mt-1">Displayed in emails and UI</p>
					</div>

					{/* Support Email */}
					<div>
						<label className="block text-sm font-medium mb-2">Support Email</label>
						<Input
							type="email"
							value={supportEmail}
							onChange={(e) => setSupportEmail(e.target.value)}
							placeholder="support@example.com"
						/>
						<p className="text-xs text-muted-foreground mt-1">Users can contact this email for support</p>
					</div>

					{/* Max Enrollment */}
					<div>
						<label className="block text-sm font-medium mb-2">Max Enrollment Per Course</label>
						<Input
							type="number"
							value={maxEnrollmentPerCourse}
							onChange={(e) => setMaxEnrollmentPerCourse(e.target.value)}
							placeholder="100"
						/>
						<p className="text-xs text-muted-foreground mt-1">Leave empty for unlimited</p>
					</div>

					<Button onClick={() => handleSaveSettings('general')} disabled={saving} className="w-full">
						<Save className="w-4 h-4 mr-2" />
						{saving ? 'Saving...' : 'Save Changes'}
					</Button>
				</Card>
			)}

			{/* Security Settings */}
			{activeTab === 'security' && (
				<Card className="p-6 space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Shield className="w-5 h-5" />
							Security Settings
						</h2>
					</div>

					{/* Require MFA */}
					<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
						<div>
							<p className="font-medium">Require Multi-Factor Authentication</p>
							<p className="text-sm text-muted-foreground">Force all admin users to use MFA</p>
						</div>
						<button
							onClick={() => setRequireMFA(!requireMFA)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								requireMFA ? 'bg-green-500' : 'bg-gray-300'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									requireMFA ? 'translate-x-6' : 'translate-x-1'
								}`}
							/>
						</button>
					</div>

					{/* Session Timeout */}
					<div>
						<label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
						<Input
							type="number"
							value={sessionTimeout}
							onChange={(e) => setSessionTimeout(e.target.value)}
							placeholder="30"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Auto logout users after this period of inactivity
						</p>
					</div>

					{/* Password Min Length */}
					<div>
						<label className="block text-sm font-medium mb-2">Minimum Password Length</label>
						<Input
							type="number"
							value={passwordMinLength}
							onChange={(e) => setPasswordMinLength(e.target.value)}
							placeholder="8"
						/>
						<p className="text-xs text-muted-foreground mt-1">Minimum characters required for passwords</p>
					</div>

					<Button onClick={() => handleSaveSettings('security')} disabled={saving} className="w-full">
						<Save className="w-4 h-4 mr-2" />
						{saving ? 'Saving...' : 'Save Changes'}
					</Button>
				</Card>
			)}

			{/* Maintenance Settings */}
			{activeTab === 'maintenance' && (
				<Card className="p-6 space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Database className="w-5 h-5" />
							Maintenance
						</h2>
					</div>

					{/* Maintenance Mode */}
					<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
						<div>
							<p className="font-medium">Maintenance Mode</p>
							<p className="text-sm text-muted-foreground">Disable platform access for non-admins</p>
						</div>
						<button
							onClick={() => setMaintenanceMode(!maintenanceMode)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									maintenanceMode ? 'translate-x-6' : 'translate-x-1'
								}`}
							/>
						</button>
					</div>

					{maintenanceMode && (
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<p className="text-sm text-yellow-900">
								⚠️ Maintenance mode is active. All non-admin users will see the maintenance message.
							</p>
						</div>
					)}

					{/* Maintenance Message */}
					<div>
						<label className="block text-sm font-medium mb-2">Maintenance Message</label>
						<textarea
							value={maintenanceMessage}
							onChange={(e) => setMaintenanceMessage(e.target.value)}
							placeholder="Enter maintenance message..."
							rows={4}
							className="w-full px-3 py-2 border border-input rounded-md bg-background"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Shown to users when maintenance mode is active
						</p>
					</div>

					<Button onClick={() => handleSaveSettings('maintenance')} disabled={saving} className="w-full">
						<Save className="w-4 h-4 mr-2" />
						{saving ? 'Saving...' : 'Save Changes'}
					</Button>
				</Card>
			)}

			{/* Info Box */}
			<Card className="p-4 bg-blue-50 border-blue-200">
				<p className="text-sm text-blue-900">
					<strong>💡 Note:</strong> These settings are stored in memory for this demo. In production, implement
					database persistence in `/api/admin/settings` endpoint.
				</p>
			</Card>
		</div>
	)
}


