import { Shield, ShieldCheck } from 'lucide-react';

export default function ClientBanner() {
  const clients = [
    { name: 'NBA', description: 'Sports & Entertainment' },
    { name: 'Clorox', description: 'Fortune 500 Company' },
    { name: 'ACMS', description: 'Crossing Guard Services' },
    { name: 'New York Fashion House 7', description: 'Luxury Fashion & Design' }
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
              <div className="flex items-center gap-2 mb-3">
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
