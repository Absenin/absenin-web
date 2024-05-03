import { LoaderCircle } from 'lucide-react';

export default function Loading() {
    return (
        <main className='min-h-screen bg-background flex items-center justify-center'>
            <LoaderCircle className='w-14 h-14 stroke-primary animate-spin' />
        </main>
    )
}