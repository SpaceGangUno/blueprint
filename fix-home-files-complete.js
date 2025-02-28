import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix the style object and add missing closing tags in a file
function fixFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the style object by adding a comma between properties
    content = content.replace(/style={{ width: '300%' transform:/g, "style={{ width: '300%', transform:");
    
    // Add missing closing tags
    // The file is cut off, so we need to add the closing tags for all open elements
    content += `
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#FFEC00] transition-colors">
                      Project Title
                    </h3>
                    <p className="text-gray-400 mb-4">Project Description</p>
                    <a
                      href="/portfolio"
                      className="inline-flex items-center text-[#FFEC00] hover:text-[#FFEC00]/80 font-medium relative group/link"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFEC00] to-[#FF6B00] group-hover/link:w-full transition-all duration-300"></span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Project 3 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="group bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://i.imgur.com/JYzMCDD.jpeg"
                      alt="Sneaker launch event with crowd"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-[#00E0FF] text-black rounded-full text-sm">Launch Event</span>
                          <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-full text-sm">Retail</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 relative">
                    <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#00E0FF] to-[#FF6B00] group-hover:w-full transition-all duration-500"></div>
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00E0FF] transition-colors">
                      Sneaker Launch Event
                    </h3>
                    <p className="text-gray-400 mb-4">Retail Store Opening</p>
                    <a
                      href="/portfolio"
                      className="inline-flex items-center text-[#00E0FF] hover:text-[#00E0FF]/80 font-medium relative group/link"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00E0FF] to-[#FF6B00] group-hover/link:w-full transition-all duration-300"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {showQuoteModal && <QuoteRequest onClose={() => setShowQuoteModal(false)} />}
      {showHypeAuditForm && <HypeAuditForm onClose={() => setShowHypeAuditForm(false)} />}
    </div>
  );
}`;
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

// Fix the files
fixFile(path.join(__dirname, 'src/pages/Home.tsx'));
fixFile(path.join(__dirname, 'src/pages/Home.new.tsx'));
fixFile(path.join(__dirname, 'src/pages/Home.fixed.tsx'));

console.log('All files fixed!');
