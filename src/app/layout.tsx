import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ForumProvider } from '@/contexts/ForumContext';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QA Forum - Anonymous Q&A Community',
  description: 'Ask questions anonymously and get answers from the community. Upvote and downvote to help surface the best content.',
  keywords: 'questions, answers, forum, community, anonymous, Q&A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ForumProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </ForumProvider>
      </body>
    </html>
  );
}