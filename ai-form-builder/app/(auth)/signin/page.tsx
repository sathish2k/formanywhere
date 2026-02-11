/**
 * SignIn Page
 */

import { SignIn } from '@/components';
import { Suspense } from 'react';

export const metadata = {
  title: 'Sign In | FormBuilder AI',
  description: 'Sign in to your FormBuilder AI account',
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
