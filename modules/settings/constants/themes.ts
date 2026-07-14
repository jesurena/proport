export interface ColorThemeItem {
    id: string;
    name: string;
    sidebarBg: string;
    chatBg: string;
    accentBg: string;
}

export const COLOR_THEMES: ColorThemeItem[] = [
    {
        id: 'system',
        name: 'System',
        sidebarBg: '#FFFFFF',
        chatBg: '#F8FAFC',
        accentBg: '#64748b',
    },
    {
        id: 'light',
        name: 'Light',
        sidebarBg: '#FFFFFF',
        chatBg: '#F8FAFC',
        accentBg: '#64748b',
    },
    {
        id: 'dark',
        name: 'Dark',
        sidebarBg: '#141414',
        chatBg: '#212121',
        accentBg: '#3b82f6',
    },
    {
        id: 'lavender',
        name: 'Lavender',
        sidebarBg: '#221523',
        chatBg: '#1f1220',
        accentBg: '#c084fc',
    },
    {
        id: 'copper-teal',
        name: 'Copper Teal',
        sidebarBg: '#082c2f',
        chatBg: '#0b3134',
        accentBg: '#e07a5f',
    },
    {
        id: 'coffee',
        name: 'Coffee',
        sidebarBg: '#2b1e1b',
        chatBg: '#352724',
        accentBg: '#48c0a4',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        sidebarBg: '#142230',
        chatBg: '#172635',
        accentBg: '#3b82f6',
    },
    {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        sidebarBg: '#ffe5ec',
        chatBg: '#fff0f3',
        accentBg: '#ff4d6d',
    },
];

export const getPreviewColors = (id: string, baseThemeDark?: boolean) => {
    if (id === 'system') {
        return { sidebarBg: '#FFFFFF', chatBg: '#eaeaea', accentBg: '#3b82f6' };
    }
    const found = COLOR_THEMES.find(t => t.id === id);
    return found
        ? { sidebarBg: found.sidebarBg, chatBg: found.chatBg, accentBg: found.accentBg }
        : { sidebarBg: '#FFFFFF', chatBg: '#eaeaea', accentBg: '#3b82f6' };
};
