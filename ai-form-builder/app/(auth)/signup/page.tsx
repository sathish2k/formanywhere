/**
 * SignUp Page
 * Redirects to SignIn with signup mode
 */

import { SignIn } from '@/components';
import { Suspense } from 'react';

export const metadata = {
  title: 'Sign Up | FormBuilder AI',
  description: 'Create your FormBuilder AI account for free',
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
