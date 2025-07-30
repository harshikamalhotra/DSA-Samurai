import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

function FirebaseDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    setDiagnostics({
      authInitialized: !!auth,
      projectId: config.projectId,
      authDomain: config.authDomain,
      apiKeyExists: !!config.apiKey,
      configComplete: Object.values(config).every(val => !!val)
    });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h3>Firebase Diagnostic</h3>
      <ul>
        <li>Auth Initialized: {diagnostics.authInitialized ? '✅' : '❌'}</li>
        <li>Project ID: {diagnostics.projectId || '❌'}</li>
        <li>Auth Domain: {diagnostics.authDomain || '❌'}</li>
        <li>API Key Exists: {diagnostics.apiKeyExists ? '✅' : '❌'}</li>
        <li>Config Complete: {diagnostics.configComplete ? '✅' : '❌'}</li>
      </ul>
    </div>
  );
}

export default FirebaseDiagnostic;
