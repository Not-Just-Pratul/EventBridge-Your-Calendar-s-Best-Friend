
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Calendar,
  Clock,
  MessageSquare,
  Video,
  UserPlus,
  Settings,
  Crown,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Product Development',
      description: 'Main product development team',
      members: [
        { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'online' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'member', status: 'busy' },
        { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'member', status: 'offline' }
      ],
      createdAt: '2025-01-01'
    }
  ]);
  
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0] || null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      description: 'New team',
      members: [
        { 
          id: user?.id || '1', 
          name: user?.email?.split('@')[0] || 'You', 
          email: user?.email || 'you@company.com', 
          role: 'admin', 
          status: 'online' 
        }
      ],
      createdAt: new Date().toISOString()
    };

    setTeams([...teams, newTeam]);
    setSelectedTeam(newTeam);
    setNewTeamName('');
    setIsCreateTeamOpen(false);
  };

  const handleInviteMember = () => {
    if (!newMemberEmail.trim() || !selectedTeam) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'member',
      status: 'offline'
    };

    const updatedTeam = {
      ...selectedTeam,
      members: [...selectedTeam.members, newMember]
    };

    setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
    setSelectedTeam(updatedTeam);
    setNewMemberEmail('');
    setIsInviteMemberOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view teams</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teams</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Collaborate with your team</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Team Name</label>
                      <Input
                        placeholder="Enter team name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTeam} className="flex-1">
                        Create Team
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => navigate('/calendar')}>
                Back to Calendar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Teams Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Teams</h2>
            <div className="space-y-3">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedTeam?.id === team.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{team.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {team.members.length} members
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-white dark:border-gray-800">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            +{team.members.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedTeam ? (
            <Tabs defaultValue="members" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedTeam.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedTeam.description}
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="members" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Members ({selectedTeam.members.length})
                  </h3>
                  <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Email Address</label>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-3 pt-4">
                          <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleInviteMember} className="flex-1">
                            Send Invite
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {selectedTeam.members.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </h4>
                              {member.role === 'admin' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getRoleColor(member.role)}>
                                {member.role}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {member.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Team Calendar
                  </h3>
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Team calendar integration coming soon
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <Card className="p-6 h-[500px] flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Team Chat
                  </h3>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Team chat feature coming soon
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button>Send</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No team selected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a team from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
