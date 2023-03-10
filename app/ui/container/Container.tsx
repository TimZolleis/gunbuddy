import type { ReactNode } from 'react';

export const Container = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div
            className={`rounded-lg px-5 pt-3 pb-5 border border-zinc-800 hover:bg-accent transition-all ease-in-out delay-150 duration-150 ${className}`}>
            {children}
        </div>
    );
};
