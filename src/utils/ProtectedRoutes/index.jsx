import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/" />;
    }

    // Verifica se o cargo do usuário está na lista de cargos permitidos
    if (!allowedRoles.includes(user.cargo)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;
