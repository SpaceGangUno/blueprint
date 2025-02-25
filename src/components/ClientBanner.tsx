import { Shield, ShieldCheck } from 'lucide-react';

export default function ClientBanner() {
  const clients = [
    { 
      name: 'NBA', 
      description: 'Sports & Entertainment',
      logo: 'https://cdn.nba.com/logos/nba/nba-logoman-75-word_white.svg'
    },
    { 
      name: 'Clorox', 
      description: 'Fortune 500 Company',
      logo: 'https://www.thecloroxcompany.com/wp-content/themes/clorox/assets/img/logo.svg'
    },
    { 
      name: 'ACMS', 
      description: 'Crossing Guard Services',
      logo: 'https://placehold.co/200x100/f0f0f0/333333?text=ACMS'
    },
    { 
      name: 'New York Fashion House 7', 
      description: 'Luxury Fashion & Design',
      logo: 'https://placehold.co/200x100/f0f0f0/333333?text=NYFH7'
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            Trusted by Industry Leaders
          </h2>
          <div className="w-20 h-1 bg-blue-600 mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group flex flex-col items-center bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all duration-300"
            >
              <div className="h-16 w-full flex items-center justify-center mb-4">
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`} 
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl font-bold text-gray-800 tracking-tight">
                  {client.name}
                </span>
              </div>
              <span className="text-sm text-gray-600 text-center group-hover:text-blue-700 transition-colors">
                {client.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-full inline-flex">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            All partnerships verified and authenticated
          </p>
        </div>
      </div>
    </section>
  );
}
