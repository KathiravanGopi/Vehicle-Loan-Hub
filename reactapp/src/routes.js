import { createBrowserRouter } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import ErrorPage from "./Components/ErrorPage";
import HomePage from "./Components/HomePage";
import PrivateRoute from "./Components/PrivateRoute";
import RootRedirect from "./Components/RootRedirect";

// Admin Components
import LoanForm from "./AdminComponents/LoanForm";
import ViewLoans from "./AdminComponents/ViewLoans";
import LoanRequest from "./AdminComponents/LoanRequest";

// User Components
import ViewAllLoans from "./UserComponents/ViewAllLoans";
import LoanApplicationForm from "./UserComponents/LoanApplicationForm";
import AppliedLoans from "./UserComponents/AppliedLoans";
import AdminNavbar from "./AdminComponents/AdminNavbar";
import UserNavbar from "./UserComponents/UserNavbar";
import ForgotPassword from "./Components/ForgotPassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootRedirect />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path:'forgot-password',
        element:<ForgotPassword/>
    },
    {
        element: <PrivateRoute role="admin" />, // Only admin can access
        children: [
            {
                path: '/admin',
                element: <AdminNavbar />, // AdminNav as layout
                children: [
                    {
                        path:'home',
                        element: <HomePage />
                    },
                    {
                        path: 'add-loan',
                        element: <LoanForm />
                    },
                    {
                        path: 'view-loans',
                        element: <ViewLoans />
                    },
                    {
                        path: 'loan-form/:id',
                        element: <LoanForm />
                    },
                    {
                        path: 'edit-loan/:id',
                        element: <LoanForm />
                    },
                    {
                        path: 'loan-requests',
                        element: <LoanRequest />
                    }
                ]
            }
        ]
    },
    {
        element: <PrivateRoute role="user" />, // Only user can access
        children: [
            {
                path: '/user',
                element: <UserNavbar />, // UserNav as layout
                children: [
                    {
                        index: true,
                        element: <HomePage />
                    },
                    {
                        path:'home',
                        element:<HomePage/>
                    },
                    {
                        path: 'loans',
                        element: <ViewAllLoans />
                    },
                    {
                        path: 'apply-loan/:loanId',
                        element: <LoanApplicationForm />
                    },
                    {
                        path: 'applied-loans',
                        element: <AppliedLoans />
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <ErrorPage />
    }
]);

export default router;