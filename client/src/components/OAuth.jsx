import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            })

            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || `Google sign-in failed (${res.status})`);
            }
            dispatch(signInSuccess(data));

            // Navigate to Home after successful Sign In
            navigate('/');

        } catch (error) {
            console.error('Could not sign in with Google', error);
            setErrorMessage(error.code || error.message || 'Google sign-in failed');
        }
    };

    return (
        <>
        <button
            onClick={handleGoogleClick}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
            <FcGoogle aria-hidden="true" className="text-xl" />
            Continue with Google
        </button>
        {errorMessage && <p className="text-red-700 text-sm" role="alert">Google sign-in failed: {errorMessage}</p>}
        </>
    );
}