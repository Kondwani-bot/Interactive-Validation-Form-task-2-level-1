import React from 'react';
import InteractiveForm from './components/InteractiveForm';

const App: React.FC = () => {
  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 antialiased">
      <InteractiveForm />
    </main>
  );
};

export default App;