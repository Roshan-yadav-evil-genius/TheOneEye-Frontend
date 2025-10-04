import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => (
  <Link href="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
    <Image src="/logo.png" width={70} height={10} alt='TheOneEye' />
    <p className='text-2xl font-bold'>TheOneEye</p>
  </Link>
);
