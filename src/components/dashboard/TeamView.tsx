import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  projects: string[];
}

export default function TeamView() {
  const [team] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Project Manager',
      email: 'sarah@blueprintstudios.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
      projects: ['Website Redesign', 'Mobile App']
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Lead Developer',
      email: 'michael@blueprintstudios.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen',
      projects: ['E-commerce Platform', 'Website Redesign']
    }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {member.location}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Active Projects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.projects.map(project => (
                      <span
                        key={project}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}