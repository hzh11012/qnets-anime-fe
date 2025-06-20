import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
const themeOptions: Record<string, 'system' | 'light' | 'dark'> = {
    dark: 'light',
    light: 'dark'
};

interface ThemeSwitchProps {
    className?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div
            onClick={() => {
                theme && setTheme(themeOptions[theme]);
            }}
            className={cn(className)}
        >
            {theme === 'dark' && <Sun size={22} />}
            {theme === 'light' && <Moon size={22} />}
        </div>
    );
};

export default ThemeSwitch;
