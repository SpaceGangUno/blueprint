import { Shield, ShieldCheck } from 'lucide-react';

export default function ClientBanner() {
  const clients = [
    { name: 'NBA', description: 'Sports & Entertainment' },
    { name: 'Clorox', description: 'Fortune 500 Company' },
    { name: 'ACMS', description: 'Crossing Guard Services' },
    { name: 'New York Fashion House 7', description: 'Luxury Fashion & Design' }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 mb-12">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            Trusted by Industry Leaders
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl font-bold text-gray-800 tracking-tight">
                  {client.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                {client.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            All partnerships verified and authenticated
          </p>
        </div>
      </div>
    </section>
  );
}