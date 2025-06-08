import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Settings, 
  Activity,
  CreditCard,
  Building,
  CheckCircle,
  XCircle,
  Globe,
  Users,
  Key,
  Smartphone,
  AlertCircle,
  Star,
  Crown,
  TrendingUp,
  BarChart3
} from 'lucide-react'

const Item1 = ({ showCheckinTabsFromSidebar, setShowCheckinTabsFromSidebar, goToLibraryTab, setgotolibrary, playnow, joindiscussion }) => {
  const { user } = useUser()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const quickActions = [
    {
      title: "Lead Discovery",
      description: "Find new prospects",
      icon: <Users className="w-6 h-6" />,
      action: playnow,
      color: "bg-blue-500"
    },
    {
      title: "Resource Library",
      description: "Browse tools & guides",
      icon: <BarChart3 className="w-6 h-6" />,
      action: goToLibraryTab,
      color: "bg-green-500"
    },
    {
      title: "Join Discussion",
      description: "Connect with community",
      icon: <Globe className="w-6 h-6" />,
      action: joindiscussion,
      color: "bg-purple-500"
    }
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back to your Lead Sparks dashboard
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Last active: {formatDate(user.lastSignInAt)}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src={user.imageUrl} 
              alt={user.fullName}
              className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <div 
            key={index}
            onClick={action.action}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`${action.color} p-3 rounded-lg text-white`}>
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Profile Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{user.primaryPhoneNumber?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Account Status
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Phone Verified</p>
                  <p className="font-semibold text-blue-600">Verified</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Key className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">2FA Status</p>
                  <p className="font-semibold text-yellow-600">
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-semibold text-purple-600">Premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Security Features
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Password Protection</span>
                </div>
                <div className="flex items-center">
                  {user.passwordEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${user.passwordEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {user.passwordEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Two-Factor Authentication</span>
                </div>
                <div className="flex items-center">
                  {user.twoFactorEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${user.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Backup Codes</span>
                </div>
                <div className="flex items-center">
                  {user.backupCodeEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${user.backupCodeEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {user.backupCodeEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          
          {/* Account Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Account Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account ID</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {user.id.slice(-8)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Addresses</span>
                <span className="font-semibold">{user.emailAddresses?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone Numbers</span>
                <span className="font-semibold">{user.phoneNumbers?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">External Accounts</span>
                <span className="font-semibold">{user.externalAccounts?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Organizations</span>
                <span className="font-semibold">{user.organizationMemberships?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Leads Found</span>
                </div>
                <span className="font-bold text-blue-600">127</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Conversion Rate</span>
                </div>
                <span className="font-bold text-green-600">24%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Active Campaigns</span>
                </div>
                <span className="font-bold text-purple-600">3</span>
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                Security Tips
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {!user.twoFactorEnabled && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Enable 2FA:</strong> Add an extra layer of security to your account.
                  </p>
                </div>
              )}
              
              {!user.backupCodeEnabled && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Setup Backup Codes:</strong> Ensure account recovery options.
                  </p>
                </div>
              )}
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Regular Updates:</strong> Keep your contact information current.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item1