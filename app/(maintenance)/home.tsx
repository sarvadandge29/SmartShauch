import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

// Types
interface SensorData {
  odour: number;
  crossings: number;
  visitors: number;
  occupancy: string;
  waterLevel: number;
  waterLevelPercent: number;
  flowRate: number;
  dailyUsage: number;
  leak: string;
}

interface Task {
  id: string;
  type: string;
  description: string;
  priority: 'High' | 'Medium';
  assignedTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const Home: React.FC = () => {
  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData>({
    odour: 637,
    crossings: 4,
    visitors: 2,
    occupancy: 'VACANT',
    waterLevel: 206.8,
    waterLevelPercent: 0.0,
    flowRate: 0.000,
    dailyUsage: 0.00,
    leak: 'No'
  })

  // State for assigned tasks
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([])

  // Thresholds
  const THRESHOLDS = {
    ODOUR: 600,
    WATER_LEVEL_LOW: 20,
    LEAK: 'Yes' as const
  }

  // Simulate real-time data updates (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: SensorData = {
        odour: Math.floor(Math.random() * 800) + 200,
        crossings: Math.floor(Math.random() * 10) + 1,
        visitors: Math.floor(Math.random() * 5) + 1,
        occupancy: Math.random() > 0.5 ? 'OCCUPIED' : 'VACANT',
        waterLevel: parseFloat((Math.random() * 300 + 50).toFixed(1)),
        waterLevelPercent: Math.random() * 100,
        flowRate: parseFloat((Math.random() * 10).toFixed(3)),
        dailyUsage: parseFloat((Math.random() * 50).toFixed(2)),
        leak: Math.random() > 0.8 ? 'Yes' : 'No'
      }
      
      setSensorData(newData)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Check thresholds and auto-assign tasks
  useEffect(() => {
    const newTasks: Task[] = []
    const currentTime = new Date().toLocaleString()

    // Check odour threshold
    if (sensorData.odour > THRESHOLDS.ODOUR) {
      newTasks.push({
        id: `odour-${Date.now()}-${Math.random()}`,
        type: 'Odour Alert',
        description: `High odour level detected (${sensorData.odour})`,
        priority: 'High',
        assignedTime: currentTime,
        status: 'Pending'
      })
    }

    // Check water level
    if (sensorData.waterLevelPercent < THRESHOLDS.WATER_LEVEL_LOW) {
      newTasks.push({
        id: `water-${Date.now()}-${Math.random()}`,
        type: 'Low Water Level',
        description: `Water level is critically low (${sensorData.waterLevelPercent.toFixed(1)}%)`,
        priority: 'Medium',
        assignedTime: currentTime,
        status: 'Pending'
      })
    }

    // Check leak
    if (sensorData.leak === THRESHOLDS.LEAK) {
      newTasks.push({
        id: `leak-${Date.now()}-${Math.random()}`,
        type: 'Leak Detected',
        description: 'Water leak detected in the system',
        priority: 'High',
        assignedTime: currentTime,
        status: 'Pending'
      })
    }

    // Update tasks if new tasks are detected
    if (newTasks.length > 0) {
      setAssignedTasks(prevTasks => [...newTasks, ...prevTasks])
    }
  }, [sensorData])

  // Check if value exceeds threshold
  const isAlert = (type: keyof typeof THRESHOLDS, value: number | string): boolean => {
    switch(type) {
      case 'ODOUR':
        return typeof value === 'number' && value > THRESHOLDS.ODOUR
      case 'WATER_LEVEL_LOW':
        return typeof value === 'number' && value < THRESHOLDS.WATER_LEVEL_LOW
      case 'LEAK':
        return value === THRESHOLDS.LEAK
      default:
        return false
    }
  }

  // Render sensor data item
  const renderSensorItem = (label: string, value: string | number, unit: string = '') => {
    const valueStr = typeof value === 'number' ? value.toString() : value
    return (
      <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
        <Text className="text-base text-gray-600">{label}:</Text>
        <Text className="text-base font-semibold text-darkBlue">{valueStr}{unit}</Text>
      </View>
    )
  }

  // Render alert message
  const renderAlert = (condition: boolean, message: string) => {
    if (!condition) return null
    return (
      <Text className="text-alertRed font-bold text-sm -mt-1 mb-1 text-right">
        {message}
      </Text>
    )
  }

  // Render task item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View className={`p-4 my-1 rounded-lg border border-gray-200 ${
      item.priority === 'High' ? 'bg-red-50 border-l-4 border-l-alertRed' : 'bg-orange-50 border-l-4 border-l-orange-400'
    }`}>
      <Text className="text-base font-bold text-darkBlue mb-1">{item.type}</Text>
      <Text className="text-sm text-gray-600 mb-2">{item.description}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-400">Assigned: {item.assignedTime}</Text>
        <Text className="text-xs font-semibold text-green-600">{item.status}</Text>
      </View>
    </View>
  )

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-darkBlue py-6 px-4 mb-2">
        <Text className="text-2xl font-bold text-white text-center">
          Toilet Monitoring System
        </Text>
      </View>

      {/* Sensor Data Section */}
      <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-darkBlue mb-4">
          Real-time Sensor Data
        </Text>
        
        <View className="gap-2">
          {/* Odour */}
          <View>
            {renderSensorItem('Odour', sensorData.odour)}
            {renderAlert(isAlert('ODOUR', sensorData.odour), 'ALERT!')}
          </View>

          {/* Crossings and Visitors */}
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-base text-gray-600">Crossings: {sensorData.crossings}</Text>
            <Text className="text-base text-gray-600">Visitors: {sensorData.visitors}</Text>
          </View>

          {/* Occupancy */}
          {renderSensorItem('Occupancy', sensorData.occupancy)}

          {/* Water Level */}
          <View>
            {renderSensorItem('Water Level', sensorData.waterLevel, ' cm')}
          </View>
          
          {/* Water Level Percentage */}
          <View>
            {renderSensorItem('Water Level %', sensorData.waterLevelPercent.toFixed(1), '%')}
            {renderAlert(isAlert('WATER_LEVEL_LOW', sensorData.waterLevelPercent), 'LOW!')}
          </View>

          {/* Flow Rate */}
          {renderSensorItem('Flow Rate', sensorData.flowRate, ' L/min')}
          
          {/* Daily Usage */}
          {renderSensorItem('Daily Usage', sensorData.dailyUsage, ' L')}
          
          {/* Leak */}
          <View>
            {renderSensorItem('Leak', sensorData.leak)}
            {renderAlert(isAlert('LEAK', sensorData.leak), 'LEAK DETECTED!')}
          </View>
        </View>
      </View>

      {/* Assigned Tasks Section */}
      <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-darkBlue mb-4">
          Assigned Cleaning Tasks
        </Text>
        
        {assignedTasks.length > 0 ? (
          <FlatList
            data={assignedTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="py-6 items-center">
            <Text className="text-base text-gray-400 italic">
              No tasks assigned
            </Text>
          </View>
        )}
      </View>

      {/* Footer note */}
      <View className="mx-4 my-4">
        <Text className="text-xs text-gray-400 text-center">
          Auto-assign active • Last updated: {new Date().toLocaleTimeString()}
        </Text>
      </View>
    </ScrollView>
  )
}

export default Home