
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Palette, Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [customColors, setCustomColors] = useState({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
  });

  const presetThemes: CustomTheme[] = [
    {
      name: 'Ocean Blue',
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#f0f9ff',
    },
    {
      name: 'Forest Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#f0fdf4',
    },
    {
      name: 'Sunset Orange',
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: '#fffbeb',
    },
    {
      name: 'Purple Dream',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a855f7',
      background: '#faf5ff',
    },
    {
      name: 'Rose Gold',
      primary: '#e11d48',
      secondary: '#be185d',
      accent: '#f43f5e',
      background: '#fff1f2',
    },
  ];

  useEffect(() => {
    // Load custom colors from localStorage
    const savedColors = localStorage.getItem('custom-theme-colors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  const applyCustomTheme = (colors: typeof customColors) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    
    localStorage.setItem('custom-theme-colors', JSON.stringify(colors));
    setCustomColors(colors);
  };

  const resetToDefault = () => {
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--background');
    
    localStorage.removeItem('custom-theme-colors');
    setCustomColors({
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
    });
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <span>Theme Customizer</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Mode */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(themeIcons).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    theme === mode
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium capitalize">{mode}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Preset Themes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preset Themes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyCustomTheme(preset)}
                  className="p-4 border-2 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex space-x-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-sm font-medium">{preset.name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom Colors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-sm font-medium capitalize">{key}</Label>
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...customColors, [key]: e.target.value };
                        setCustomColors(newColors);
                      }}
                      className="w-10 h-10 border rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...customColors, [key]: e.target.value };
                        setCustomColors(newColors);
                      }}
                      className="flex-1 p-2 text-sm border rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={() => applyCustomTheme(customColors)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Apply Custom Theme
              </Button>
              <Button variant="outline" onClick={resetToDefault}>
                Reset to Default
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: customColors.background }}
              >
                <h4
                  className="font-semibold"
                  style={{ color: customColors.primary }}
                >
                  Sample Event Title
                </h4>
                <p
                  className="text-sm"
                  style={{ color: customColors.secondary }}
                >
                  This is how your events will look with the selected theme.
                </p>
                <div
                  className="inline-block px-2 py-1 rounded text-white text-xs mt-2"
                  style={{ backgroundColor: customColors.accent }}
                >
                  Meeting
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
