import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navigation: React.FC = () => {
  const router = useRouter();

  const links = [
    { href: '/', label: 'Doctors' },
    { href: '/visit-trends', label: 'Visits' },
    { href: '/monthly-visits', label: 'Monthly' },
    { href: '/relationships', label: 'Relationships' },
    { href: '/heart-rate', label: 'Heart Rate' }
  ];

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
            {links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={router.pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 