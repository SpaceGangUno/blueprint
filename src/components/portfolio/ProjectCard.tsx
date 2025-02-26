import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  imageAlt?: string;
}

export default function ProjectCard({ title, description, image, link, tags, imageAlt }: ProjectCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={imageAlt || `${title} - ${description}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gradient-primary animate-gradient text-white rounded-full text-sm transform transition-all duration-300"
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    opacity: 0,
                    transform: 'translateY(10px)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
        <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <a
          href={link}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium relative group/link"
        >
          <span>View Project</span>
          <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover/link:w-full transition-all duration-300"></span>
        </a>
      </div>
    </div>
  );
}
