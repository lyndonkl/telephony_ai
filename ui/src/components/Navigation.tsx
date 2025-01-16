import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navigation: React.FC = () => {
  const router = useRouter();

  return (
    <div className="navbar bg-base-100 shadow-lg mb-8">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold">
            Doctor Visit Dashboard
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                href="/" 
                className={router.pathname === '/' ? 'active' : ''}
              >
                Doctors
              </Link>
            </li>
            <li>
              <Link 
                href="/visit-trends" 
                className={router.pathname === '/visit-trends' ? 'active' : ''}
              >
                Visit Trends
              </Link>
            </li>
            <li>
              <Link 
                href="/monthly-visits" 
                className={router.pathname === '/monthly-visits' ? 'active' : ''}
              >
                Monthly Breakdown
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 