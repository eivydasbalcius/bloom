// pages/auth/layout.tsx
import { ReactNode } from 'react';

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="h-full">
            <div className="auth-layout h-full bg-gray-50">
                {children}
            </div>
        </div>
    );
}
