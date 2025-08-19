import React, { memo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitchProps {
    className?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = memo(({ className }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === 'dark';

    return (
        <div
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(className)}
        >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </div>
    );
});

ThemeSwitch.displayName = 'ThemeSwitch';

export default ThemeSwitch;
