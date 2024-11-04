import { Layout, Monitor, Phone, Palette, Code } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: any;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: Category[] = [
    { id: 'all', label: 'All Projects', icon: Layout },
    { id: 'web', label: 'Websites', icon: Monitor },
    { id: 'mobile', label: 'Mobile Apps', icon: Phone },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'development', label: 'Development', icon: Code }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map(category => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center px-6 py-3 rounded-full transition-all
              ${selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }
            `}
          >
            <Icon className="w-5 h-5 mr-2" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}