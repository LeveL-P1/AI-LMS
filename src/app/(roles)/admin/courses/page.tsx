'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/common/ui/card'
import { Button } from '@/components/common/ui/button'
import { Input } from '@/components/common/ui/input'
import { Badge } from '@/components/common/ui/badge'
import { BookOpen, Search, Trash2, Pause, Play, AlertCircle, Loader2 } from 'lucide-react'

interface AdminCourse {
	id: string
	title: string
	description?: string
	instructorId?: string
	instructorName?: string
	enrollmentCount: number
	status: 'ACTIVE' | 'SUSPENDED'
	createdAt: string
}

export default function AdminCoursesPage() {
	const [courses, setCourses] = useState<AdminCourse[]>([])
	const [filteredCourses, setFilteredCourses] = useState<AdminCourse[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL')
	const [actionLoading, setActionLoading] = useState<string | null>(null)

	useEffect(() => {
		fetchCourses()
	}, [])

	useEffect(() => {
		let filtered = courses
		if (searchTerm) {
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					c.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}
		if (filterStatus !== 'ALL') {
			filtered = filtered.filter((c) => c.status === filterStatus)
		}
		setFilteredCourses(filtered)
	}, [searchTerm, filterStatus, courses])

	const fetchCourses = async () => {
		try {
			const response = await fetch('/api/admin/courses')
			if (!response.ok) throw new Error('Failed to fetch courses')
			const data = await response.json()
			setCourses(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}

	const handleSuspendCourse = async (courseId: string) => {
		if (!confirm('Suspend this course? Students will not be able to access it.')) return
		setActionLoading(courseId)
		try {
			const response = await fetch('/api/admin/courses/suspend', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ courseId })
			})
			if (!response.ok) throw new Error('Failed to suspend course')
			await fetchCourses()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setActionLoading(null)
		}
	}

	const handleResumeCourse = async (courseId: string) => {
		setActionLoading(courseId)
		try {
			const response = await fetch('/api/admin/courses/resume', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ courseId })
			})
			if (!response.ok) throw new Error('Failed to resume course')
			await fetchCourses()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setActionLoading(null)
		}
	}

	const handleDeleteCourse = async (courseId: string) => {
		if (!confirm('Delete this course? This action cannot be undone. All associated data will be removed.'))
			return
		setActionLoading(courseId)
		try {
			const response = await fetch('/api/admin/courses/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ courseId })
			})
			if (!response.ok) throw new Error('Failed to delete course')
			await fetchCourses()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setActionLoading(null)
		}
	}

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 w-48 bg-muted rounded" />
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-20 bg-muted rounded" />
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div>
				<div className="flex items-center gap-2 mb-2">
					<BookOpen className="w-6 h-6" />
					<h1 className="text-3xl font-bold">Courses Management</h1>
				</div>
				<p className="text-muted-foreground">Monitor and manage all courses</p>
			</div>

			{/* Error Alert */}
			{error && (
				<div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
					<AlertCircle className="w-5 h-5 text-red-500" />
					<p className="text-sm text-red-700">{error}</p>
					<button
						onClick={() => setError(null)}
						className="ml-auto text-xs font-medium text-red-600 hover:text-red-700"
					>
						Dismiss
					</button>
				</div>
			)}

			{/* Filters */}
			<Card className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Search */}
					<div className="md:col-span-2 relative">
						<Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search by course title or instructor..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Status Filter */}
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'SUSPENDED')}
						className="px-3 py-2 rounded-md border border-input bg-background"
					>
						<option value="ALL">All Status</option>
						<option value="ACTIVE">Active</option>
						<option value="SUSPENDED">Suspended</option>
					</select>
				</div>

				{/* Results Count */}
				<p className="text-sm text-muted-foreground mt-4">
					Showing {filteredCourses.length} of {courses.length} courses
				</p>
			</Card>

			{/* Courses Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredCourses.length > 0 ? (
					filteredCourses.map((course) => (
						<Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-6">
								{/* Status Badge */}
								<div className="flex items-start justify-between mb-3">
									<Badge
										className={
											course.status === 'ACTIVE'
												? 'bg-green-500/20 text-green-700 border-green-200 border'
												: 'bg-yellow-500/20 text-yellow-700 border-yellow-200 border'
										}
									>
										{course.status}
									</Badge>
									<span className="text-xs text-muted-foreground">{course.enrollmentCount} enrolled</span>
								</div>

								{/* Course Info */}
								<h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
								<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
									{course.description || 'No description'}
								</p>

								{/* Instructor */}
								<p className="text-xs text-muted-foreground mb-4">
									<strong>Instructor:</strong> {course.instructorName || 'Unassigned'}
								</p>

								{/* Created Date */}
								<p className="text-xs text-muted-foreground mb-4">
									Created {new Date(course.createdAt).toLocaleDateString()}
								</p>

								{/* Actions */}
								<div className="flex gap-2">
									{course.status === 'ACTIVE' ? (
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleSuspendCourse(course.id)}
											disabled={actionLoading === course.id}
											className="flex-1 text-yellow-600 hover:text-yellow-700 border-yellow-200"
										>
											{actionLoading === course.id ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<Pause className="w-4 h-4 mr-1" />
											)}
											Suspend
										</Button>
									) : (
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleResumeCourse(course.id)}
											disabled={actionLoading === course.id}
											className="flex-1 text-green-600 hover:text-green-700 border-green-200"
										>
											{actionLoading === course.id ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<Play className="w-4 h-4 mr-1" />
											)}
											Resume
										</Button>
									)}
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleDeleteCourse(course.id)}
										disabled={actionLoading === course.id}
										className="text-red-600 hover:text-red-700 border-red-200"
									>
										{actionLoading === course.id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Trash2 className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>
						</Card>
					))
				) : (
					<div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
						<BookOpen className="w-12 h-12 mb-3 opacity-50" />
						<p>No courses found</p>
					</div>
				)}
			</div>

			{/* Info Box */}
			<Card className="p-4 bg-blue-50 border-blue-200">
				<p className="text-sm text-blue-900">
					<strong>💡 Tip:</strong> Suspending a course prevents new enrollments and access without deleting data.
					Use delete only for duplicate or test courses.
				</p>
			</Card>
		</div>
	)
}


