interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
}

export default function TeamMember({ name, role, bio }: TeamMemberProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group p-6">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-blue-600">{role}</p>
      </div>
      <p className="text-gray-600 text-center">{bio}</p>
    </div>
  );
}