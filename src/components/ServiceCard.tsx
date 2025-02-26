import { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 gradient-border">
      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white mb-6 animate-gradient">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 relative inline-block">
        {title}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
