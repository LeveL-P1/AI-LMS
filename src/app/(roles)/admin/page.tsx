'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/common/ui/card'
import { Users, BookOpen, FileText, Activity, TrendingUp, AlertCircle } from 'lucide-react'

interface PlatformStats {
	totalUsers: number
	totalInstructors: number
	totalStudents: number
	totalCourses: number
	totalEnrollments: number
	recentActions: Array<{
		id: string
		userId: string
		userName?: string
		actionType: string
		timestamp: string
	}>
}

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<PlatformStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/admin/stats')
				if (!response.ok) throw new Error('Failed to fetch stats')
				const data = await response.json()
				setStats(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
			} finally {
				setLoading(false)
			}
		}

		fetchStats()
	}, [])

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 w-48 bg-muted rounded" />
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-24 bg-muted rounded" />
						))}
					</div>
				</div>
			</div>
		)
	}

	if (error || !stats) {
		return (
			<div className="p-6">
				<div className="flex items-center gap-2 text-red-500">
					<AlertCircle className="w-5 h-5" />
					<p>{error || 'Failed to load dashboard'}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
				<p className="text-muted-foreground mt-1">Platform overview and management</p>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Total Users */}
				<Card className="p-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground font-medium">Total Users</p>
							<p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
						</div>
						<Users className="w-8 h-8 text-blue-500 opacity-20" />
					</div>
					<p className="text-xs text-muted-foreground mt-4">
						{stats.totalInstructors} instructors, {stats.totalStudents} students
					</p>
				</Card>

				{/* Total Courses */}
				<Card className="p-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground font-medium">Total Courses</p>
							<p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
						</div>
						<BookOpen className="w-8 h-8 text-green-500 opacity-20" />
					</div>
					<p className="text-xs text-muted-foreground mt-4">Active courses on platform</p>
				</Card>

				{/* Total Enrollments */}
				<Card className="p-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground font-medium">Enrollments</p>
							<p className="text-3xl font-bold mt-2">{stats.totalEnrollments}</p>
						</div>
						<TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
					</div>
					<p className="text-xs text-muted-foreground mt-4">
						Avg {Math.round(stats.totalEnrollments / stats.totalCourses) || 0} per course
					</p>
				</Card>
			</div>

			{/* Recent Actions */}
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<Activity className="w-5 h-5 text-orange-500" />
					<h2 className="text-lg font-semibold">Recent Platform Actions</h2>
				</div>

				<div className="space-y-3 max-h-96 overflow-y-auto">
					{stats.recentActions.length > 0 ? (
						stats.recentActions.map((action) => (
							<div
								key={action.id}
								className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
							>
								<div>
									<p className="font-medium text-sm">{action.userName || 'Unknown User'}</p>
									<p className="text-xs text-muted-foreground">{action.actionType}</p>
								</div>
								<p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
									{new Date(action.timestamp).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</p>
							</div>
						))
					) : (
						<p className="text-sm text-muted-foreground text-center py-8">No recent actions</p>
					)}
				</div>
			</Card>

			{/* Quick Actions */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
					<a
						href="/admin/users"
						className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center"
					>
						<Users className="w-5 h-5 mx-auto mb-2" />
						<p className="text-sm font-medium">Manage Users</p>
					</a>
					<a
						href="/admin/courses"
						className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center"
					>
						<BookOpen className="w-5 h-5 mx-auto mb-2" />
						<p className="text-sm font-medium">Courses</p>
					</a>
					<a
						href="/admin/settings"
						className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center"
					>
						<FileText className="w-5 h-5 mx-auto mb-2" />
						<p className="text-sm font-medium">Settings</p>
					</a>
					<a
						href="/dashboard"
						className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center"
					>
						<Activity className="w-5 h-5 mx-auto mb-2" />
						<p className="text-sm font-medium">Analytics</p>
					</a>
				</div>
			</Card>
		</div>
	)
}
