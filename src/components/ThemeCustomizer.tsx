
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
    primary: '#4f46e5',
    secondary: '#6366f1',
    accent: '#3b82f6',
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
    {
      name: 'Midnight Blue',
      primary: '#1e40af',
      secondary: '#1d4ed8',
      accent: '#2563eb',
      background: '#eff6ff',
    },
  ];

  useEffect(() => {
    const savedColors = localStorage.getItem('custom-theme-colors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  const applyCustomTheme = (colors: typeof customColors) => {
    const root = document.documentElement;
    
    // Convert hex to RGB for CSS custom properties
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
    const accentRgb = hexToRgb(colors.accent);
    const backgroundRgb = hexToRgb(colors.background);

    if (primaryRgb) {
      root.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
    }
    if (secondaryRgb) {
      root.style.setProperty('--secondary', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`);
    }
    if (accentRgb) {
      root.style.setProperty('--accent', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
    }
    if (backgroundRgb) {
      root.style.setProperty('--background', `${backgroundRgb.r} ${backgroundRgb.g} ${backgroundRgb.b}`);
    }
    
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
      primary: '#4f46e5',
      secondary: '#6366f1',
      accent: '#3b82f6',
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>Theme Customizer</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Mode */}
          <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Theme Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(themeIcons).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    theme === mode
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium capitalize">{mode}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Preset Themes */}
          <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Preset Themes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyCustomTheme(preset)}
                  className="p-4 border-2 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <div className="flex space-x-1 mb-2 justify-center">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{preset.name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom Colors */}
          <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Custom Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">{key}</Label>
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...customColors, [key]: e.target.value };
                        setCustomColors(newColors);
                      }}
                      className="w-10 h-10 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newColors = { ...customColors, [key]: e.target.value };
                        setCustomColors(newColors);
                      }}
                      className="flex-1 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => applyCustomTheme(customColors)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              >
                Apply Custom Theme
              </Button>
              <Button 
                variant="outline" 
                onClick={resetToDefault}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                Reset to Default
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Preview</h3>
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-600"
                style={{ backgroundColor: customColors.background }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: customColors.primary }}
                >
                  Sample Event Title
                </h4>
                <p
                  className="text-sm mb-3"
                  style={{ color: customColors.secondary }}
                >
                  This is how your events will look with the selected theme colors.
                </p>
                <div
                  className="inline-block px-3 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: customColors.accent }}
                >
                  Meeting
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
