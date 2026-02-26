import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Define types for statistics
interface DashboardStats {
  totalUsers: number;
  totalStaff: number;
  totalToilets: number;
  usableToilets: number;
}

// Define type for Toilet data
interface Toilet {
  id: string;
  name: string | null;
  location: string | null;
  status: 'usable' | 'maintenance' | string;
  capacity?: number | null;
  region?: string | null;
  created_at?: string;
}

// Define props for StatCard component
interface StatCardProps {
  title: string;
  value: number;
  color: string;
  icon: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStaff: 0,
    totalToilets: 0,
    usableToilets: 0,
  })
  
  const [toilets, setToilets] = useState<Toilet[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true)
      
      // Fetch statistics
      const [
        { count: usersCount },
        { count: staffCount },
        { count: toiletsCount },
        { count: usableToiletsCount }
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "user"),
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "maintenance"),
        supabase.from("toilets").select("*", { count: "exact", head: true }),
        supabase.from("toilets").select("*", { count: "exact", head: true }).eq("status", "usable")
      ])

      // Fetch toilets list
      const { data: toiletsData, error } = await supabase
        .from("toilets")
        .select("*")
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching toilets:", error)
      }

      setStats({
        totalUsers: usersCount || 0,
        totalStaff: staffCount || 0,
        totalToilets: toiletsCount || 0,
        usableToilets: usableToiletsCount || 0,
      })
      
      setToilets(toiletsData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Card Component with typed props
  const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
        </View>
        <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, { color }]}>{icon}</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Public Toilet Management System</Text>
      </View>

      {/* Stats Cards - 2x2 Grid */}
      <View style={styles.cardsGrid}>
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers}
          color="#3b82f6"
          icon="👥"
        />
        <StatCard 
          title="Staff" 
          value={stats.totalStaff}
          color="#8b5cf6"
          icon="👨‍🔧"
        />
        <StatCard 
          title="Total Toilets" 
          value={stats.totalToilets}
          color="#f59e0b"
          icon="🚽"
        />
        <StatCard 
          title="Usable" 
          value={stats.usableToilets}
          color="#10b981"
          icon="✅"
        />
      </View>

      {/* Toilets List Section */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Toilet Status</Text>
          <View style={styles.listBadge}>
            <Text style={styles.listCount}>{toilets.length} Total</Text>
          </View>
        </View>

        {toilets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No toilets found</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.headerCellName]}>Toilet</Text>
              <Text style={[styles.headerCell, styles.headerCellLocation]}>Location</Text>
              <Text style={[styles.headerCell, styles.headerCellStatus]}>Status</Text>
            </View>
            
            {/* Table Rows */}
            {toilets.slice(0, 5).map((item: Toilet) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.cellName]} numberOfLines={1}>
                  {item.name || 'N/A'}
                </Text>
                <Text style={[styles.cell, styles.cellLocation]} numberOfLines={1}>
                  {item.location || 'N/A'}
                </Text>
                <View style={[styles.cellStatus]}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'usable' ? '#4CAF50' : '#f44336' }
                  ]}>
                    <Text style={styles.statusText}>
                      {item.status === 'usable' ? '✅' : '🔧'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

// Define styles with proper TypeScript typing
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cardsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    padding: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  cardTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500' as const,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  iconText: {
    fontSize: 20,
  },
  listSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
  },
  listBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden' as const,
  },
  tableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#4b5563',
  },
  headerCellName: {
    flex: 2,
  },
  headerCellLocation: {
    flex: 2,
  },
  headerCellStatus: {
    flex: 1,
    textAlign: 'center' as const,
  },
  tableRow: {
    flexDirection: 'row' as const,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center' as const,
  },
  cell: {
    fontSize: 12,
    color: '#374151',
  },
  cellName: {
    flex: 2,
  },
  cellLocation: {
    flex: 2,
  },
  cellStatus: {
    flex: 1,
    alignItems: 'center' as const,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  statusText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center' as const,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
} as const

export default Dashboard