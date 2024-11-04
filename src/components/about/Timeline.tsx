interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200" />
      
      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div key={index} className={`relative flex items-center ${
            index % 2 === 0 ? 'justify-start' : 'justify-end'
          }`}>
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="text-blue-600 font-bold">{milestone.year}</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  {milestone.title}
                </h3>
                <p className="text-gray-600 mt-2">{milestone.description}</p>
              </div>
            </div>

            {/* Circle marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white" />
          </div>
        ))}
      </div>
    </div>
  );
}