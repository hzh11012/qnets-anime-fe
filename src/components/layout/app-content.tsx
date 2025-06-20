import { Outlet } from 'react-router-dom';

const AppContent = () => {
    return (
        <main>
            <Outlet />
        </main>
    );
};

export default AppContent;
