import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';

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
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover: opacity-95"
        >
            Continue with Google
        </button>
        {errorMessage && <p className="text-red-700 text-sm" role="alert">Google sign-in failed: {errorMessage}</p>}
        </>
    );
}