'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/common/ui/card'
import { Button } from '@/components/common/ui/button'
import { Input } from '@/components/common/ui/input'
import { Badge } from '@/components/common/ui/badge'
import { Users, Search, UserX, UserCheck, AlertCircle, Loader2 } from 'lucide-react'

interface AdminUser {
	id: string
	email: string
	name?: string
	role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
	createdAt: string
	enrollmentCount?: number
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([])
	const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'>('ALL')
	const [actionLoading, setActionLoading] = useState<string | null>(null)

	useEffect(() => {
		fetchUsers()
	}, [])

	useEffect(() => {
		let filtered = users
		if (searchTerm) {
			filtered = filtered.filter(
				(u) =>
					u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					u.name?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}
		if (filterRole !== 'ALL') {
			filtered = filtered.filter((u) => u.role === filterRole)
		}
		setFilteredUsers(filtered)
	}, [searchTerm, filterRole, users])

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/admin/users')
			if (!response.ok) throw new Error('Failed to fetch users')
			const data = await response.json()
			setUsers(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}

	const handlePromoteToInstructor = async (userId: string) => {
		if (!confirm('Promote this user to INSTRUCTOR?')) return
		setActionLoading(userId)
		try {
			const response = await fetch('/api/admin/users/promote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			})
			if (!response.ok) throw new Error('Failed to promote user')
			await fetchUsers()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setActionLoading(null)
		}
	}

	const handleDeactivateUser = async (userId: string) => {
		if (!confirm('Deactivate this user? This action can be reversed.')) return
		setActionLoading(userId)
		try {
			const response = await fetch('/api/admin/users/deactivate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId })
			})
			if (!response.ok) throw new Error('Failed to deactivate user')
			await fetchUsers()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setActionLoading(null)
		}
	}

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case 'ADMIN':
				return 'bg-red-500/20 text-red-700 border-red-200'
			case 'INSTRUCTOR':
				return 'bg-blue-500/20 text-blue-700 border-blue-200'
			case 'STUDENT':
				return 'bg-green-500/20 text-green-700 border-green-200'
			default:
				return 'bg-gray-500/20 text-gray-700 border-gray-200'
		}
	}

	if (loading) {
		return (
			<div className="space-y-6 p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 w-48 bg-muted rounded" />
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-12 bg-muted rounded" />
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
					<Users className="w-6 h-6" />
					<h1 className="text-3xl font-bold">User Management</h1>
				</div>
				<p className="text-muted-foreground">Manage user roles and status</p>
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
							placeholder="Search by email or name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Role Filter */}
					<select
						value={filterRole}
						onChange={(e) => setFilterRole(e.target.value as 'ALL' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT')}
						className="px-3 py-2 rounded-md border border-input bg-background"
					>
						<option value="ALL">All Roles</option>
						<option value="ADMIN">Admins</option>
						<option value="INSTRUCTOR">Instructors</option>
						<option value="STUDENT">Students</option>
					</select>
				</div>

				{/* Results Count */}
				<p className="text-sm text-muted-foreground mt-4">
					Showing {filteredUsers.length} of {users.length} users
				</p>
			</Card>

			{/* Users Table */}
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b bg-muted/50">
								<th className="px-6 py-3 text-left text-sm font-semibold">User</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">Courses</th>
								<th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
										<td className="px-6 py-4">
											<div>
												<p className="font-medium text-sm">{user.name || 'No Name'}</p>
												<p className="text-xs text-muted-foreground">{user.email}</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<Badge className={`${getRoleBadgeColor(user.role)} border`}>
												{user.role}
											</Badge>
										</td>
										<td className="px-6 py-4 text-sm text-muted-foreground">
											{new Date(user.createdAt).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 text-sm">{user.enrollmentCount || 0}</td>
										<td className="px-6 py-4 text-right space-x-2">
											{user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN' && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => handlePromoteToInstructor(user.id)}
													disabled={actionLoading === user.id}
													className="text-blue-600 hover:text-blue-700 border-blue-200"
												>
													{actionLoading === user.id ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<UserCheck className="w-4 h-4 mr-1" />
													)}
													Promote
												</Button>
											)}
											{user.role !== 'ADMIN' && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleDeactivateUser(user.id)}
													disabled={actionLoading === user.id}
													className="text-red-600 hover:text-red-700 border-red-200"
												>
													{actionLoading === user.id ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<UserX className="w-4 h-4 mr-1" />
													)}
													Deactivate
												</Button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
										No users found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</Card>

			{/* Info Box */}
			<Card className="p-4 bg-blue-50 border-blue-200">
				<p className="text-sm text-blue-900">
					<strong>💡 Tip:</strong> Promoting a student to instructor allows them to create and manage courses.
					Deactivated users can be reactivated through the database.
				</p>
			</Card>
		</div>
	)
}


